/**
 * スクロール時に出現する GitHub のスティッキーヘッダー（PR タイトルバー等）の高さを
 * 実測し、CSS 変数 --ghss-top に反映する。
 *
 * NOTE: ヘッダーはスクロール位置に応じて position: fixed に切り替わり、
 *       クラス名もハッシュ付きで不安定。固定値を CSS に書く代わりに実行時に測る。
 */
(() => {
  const ROOT = document.documentElement
  const VAR_NAME = '--ghss-top'
  const HEADER_SELECTORS = [
    '[data-component="PageHeader"]',
    '.gh-header-sticky',
    '.js-sticky',
  ].join(',')

  const isPinnedToTop = (el) => {
    const { position } = getComputedStyle(el)
    if (position !== 'fixed' && position !== 'sticky') return false
    const rect = el.getBoundingClientRect()
    // NOTE: 幅の条件は、サイドバー自身など横幅の狭い sticky 要素をヘッダーと誤認しないため
    return rect.height > 0 && rect.top <= 0 && rect.bottom > 0 && rect.width >= window.innerWidth * 0.5
  }

  const measureHeaderBottom = () => {
    let bottom = 0
    for (const el of document.querySelectorAll(HEADER_SELECTORS)) {
      if (!isPinnedToTop(el)) continue
      bottom = Math.max(bottom, el.getBoundingClientRect().bottom)
    }
    return Math.round(bottom)
  }

  let scheduled = false
  let lastValue = -1
  const update = () => {
    scheduled = false
    if (!document.getElementById('partial-discussion-sidebar')) return
    const value = measureHeaderBottom()
    if (value === lastValue) return
    lastValue = value
    ROOT.style.setProperty(VAR_NAME, `${value}px`)
  }
  const schedule = () => {
    if (scheduled) return
    scheduled = true
    // NOTE: requestAnimationFrame は非表示タブで停止し、復帰直後の再測定が遅れるため setTimeout で間引く
    setTimeout(update, 0)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  // NOTE: GitHub は Turbo によるソフトナビゲーションで DOM を差し替えるため、
  //       ページ遷移後もヘッダーの再測定が必要
  document.addEventListener('turbo:load', schedule)
  document.addEventListener('turbo:render', schedule)
  schedule()
})()
