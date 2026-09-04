/**
 * スクロール時に出現する GitHub のスティッキーヘッダー（PR タイトルバー）の高さを
 * 実測し、CSS 変数 --ghss-top に反映する。
 *
 * NOTE: ヘッダーはスクロール位置に応じて position: fixed に切り替わり（実測 70px）、
 *       クラス名もハッシュ付きで不安定。固定値を CSS に書く代わりに実行時に測る。
 *       グローバルヘッダー（AppHeader）は static でスクロールと共に消えるため対象外。
 */
(() => {
  const ROOT = document.documentElement
  const VAR_NAME = '--ghss-top'
  // NOTE: 前者が現行レイアウト、後者が旧レイアウトのスティッキーヘッダー。
  //       汎用クラス .js-sticky は Files changed タブのファイルヘッダー等にも付くため使わない
  const HEADER_SELECTORS = ['[data-component="PageHeader"]', '.gh-header-sticky'].join(',')

  const isPinnedToTop = (el) => {
    const { position } = getComputedStyle(el)
    if (position !== 'fixed' && position !== 'sticky') return false
    const rect = el.getBoundingClientRect()
    // NOTE: 幅の条件は、サイドバー自身など横幅の狭い sticky 要素をヘッダーと誤認しないため
    return rect.height > 0 && rect.top <= 0 && rect.bottom > 0 && rect.width >= window.innerWidth * 0.5
  }

  const measureHeaderBottom = () =>
    Math.round(
      [...document.querySelectorAll(HEADER_SELECTORS)]
        .filter(isPinnedToTop)
        .reduce((max, el) => Math.max(max, el.getBoundingClientRect().bottom), 0),
    )

  // NOTE: スクロールごとの再入を 1 フレームに間引くフラグと、同値の再書き込みを抑止する
  //       直前値。イベントをまたいで持ち越す可変状態なので let にしている
  let scheduled = false
  let lastValue = null
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
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  // NOTE: GitHub は Turbo によるソフトナビゲーションで DOM を差し替えるため、
  //       ページ遷移後もヘッダーの再測定が必要
  document.addEventListener('turbo:load', schedule)
  document.addEventListener('turbo:render', schedule)
  schedule()
})()
