# GitHub Sticky Sidebar

GitHub の PR / Issue ページで右サイドバー（Reviewers / Assignees / Labels 等）を画面に固定する Chrome 拡張。

## 動機

PR の Merge ボタンや CI 結果を見るためにページ下端までスクロールすると、Reviewers などのレビュー状態が
画面外に消える。確認のたびに上下移動するのが面倒なので、サイドバーを常に見える位置に留める。

## 挙動

- サイドバーを `position: sticky` で固定する
- スクロール時に出る PR タイトルのスティッキーヘッダーと重ならないよう、その高さを実測して上端オフセットにする
- サイドバーが画面より高い場合は、固定エリアの中でサイドバーだけがスクロールする

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
