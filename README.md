# GitHub Sticky Sidebar

GitHub の PR ページで右サイドバー（Reviewers / Assignees / Labels 等）を画面に固定する Chrome 拡張。

## 動機

PR の Merge ボタンや CI 結果を見るためにページ下端までスクロールすると、Reviewers などのレビュー状態が
画面外に消える。確認のたびに上下移動するのが面倒なので、サイドバーを常に見える位置に留める。

## 挙動

- サイドバーを `position: sticky` で固定する（ウィンドウ幅 1012px 以上の 2 カラム表示のみ）
- スクロール時に出る PR タイトルのスティッキーヘッダーと重ならないよう、その高さを実測して上端オフセットにする
- サイドバーが画面より高い場合は、固定エリアの中でサイドバーだけがスクロールする
- Reviewers / Labels などのメニューを開いている間は、メニューが切れないよう内側スクロールを解除する

Issue ページは React 実装でサイドバーの DOM 構造が異なるため対象外。

## インストール（開発者モード）

1. `chrome://extensions` を開き、右上の「デベロッパーモード」を有効にする
2. 「パッケージ化されていない拡張機能を読み込む」でこのディレクトリを選ぶ
3. 任意の PR ページを開いて下方向にスクロールする

## ファイル構成

| ファイル | 役割 |
|---|---|
| `manifest.json` | Manifest V3。`https://github.com/*` に content script を注入する |
| `content.css` | `#partial-discussion-sidebar` を sticky にし、はみ出し時に内側スクロールさせる |
| `content.js` | スティッキーヘッダーの高さを実測して CSS 変数 `--ghss-top` に反映する |
| `.node-version` | 将来ツールチェーンを入れる際の Node バージョン固定（現状ビルド工程はない） |

注入先を `https://github.com/*` 全体にしているのは、GitHub が Turbo によるソフトナビゲーションで
ページを差し替えるため。PR ページだけに絞ると、一覧から PR へ遷移したときに content script が
注入されず動かない。script 側は `#partial-discussion-sidebar` が無いページでは何もしない。
