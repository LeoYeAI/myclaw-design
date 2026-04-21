<sub>🌐 <a href="README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <b>日本語</b> · <a href="README.it.md">Italiano</a> · <a href="README.es.md">Español</a></sub>

<div align="center">

# MyClaw Design

> *「タイプする。Enterを押す。完成したデザインが手元に届く。」*

[![Powered by MyClaw.ai](https://img.shields.io/badge/Powered%20by-MyClaw.ai-blue?style=flat-square)](https://myclaw.ai)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blueviolet?style=flat-square)](https://github.com/openclaw/openclaw)
[![License](https://img.shields.io/badge/License-Personal%20Use-orange?style=flat-square)](LICENSE)

<br>

**エージェントに一言伝えるだけ。納品可能なデザインが返ってきます。**

3〜30分で、**プロダクトローンチアニメーション**、クリッカブルなアプリプロトタイプ、編集可能なスライドデッキ、印刷対応のインフォグラフィックを出荷。「AI生成っぽい」ものではなく、本物のデザインチームが作ったように見えるクオリティです。

スキルにブランドアセット（ロゴ、カラーパレット、UIスクリーンショット）を渡せば、ブランドDNAを読み取ります。何も渡さなくても、20種類の組み込みデザイン哲学がAIスロップから遠ざけます。

</div>

---

<p align="center">
  <img src="docs/hero-animation-v10-en.gif" alt="MyClaw Design Hero — タイプ → 方向選択 → ギャラリー → フォーカス → ブランドリビール" width="100%">
</p>

<p align="center"><sub>
  ▲ 25秒 · ターミナル → 4方向 → ギャラリーリップル → 4× フォーカス → ブランドリビール<br>
  👉 <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.mp4">BGM + SFX付きMP4をダウンロード（10 MB）</a>
</sub></p>

---

## インストール

```bash
# OpenClawスキルディレクトリにコピー
git clone https://github.com/LeoYeAI/myclaw-design.git ~/.openclaw/skills/myclaw-design
```

あとはエージェントに話しかけるだけ：

```
"新機能のプロダクトローンチアニメーションを作って、3つのスタイル方向を提案して"
"クリッカブルなiOSプロトタイプを作って — コア画面4つ、リアルなナビゲーション付き"
"1920×1080のスライドデッキを作成、編集可能なPPTXでエクスポート"
"このロジックを60秒のモーショングラフィックに変換、MP4とGIFでエクスポート"
"このデザインに5次元エキスパートレビューを実施して"
```

ボタンなし。パネルなし。Figmaプラグインなし。会話だけ。

---

## できること

| 機能 | 成果物 | 所要時間 |
|---|---|---|
| **インタラクティブプロトタイプ**（App / Web） | 単一ファイルHTML · リアルなiPhoneベゼル · クリッカブル · Playwright検証済み | 10〜15分 |
| **スライドデッキ** | HTMLデッキ（ブラウザでプレゼン） + 編集可能PPTX（テキストボックス保持） | 15〜25分 |
| **タイムラインアニメーション** | MP4（25fps / 60fps補間） + GIF（パレット最適化） + BGM + SFX | 8〜12分 |
| **デザインバリアント** | 3つ以上の並列比較 · ライブTweaks · 多次元探索 | 10分 |
| **インフォグラフィック** | 印刷対応レイアウト · PDF/PNG/SVGエクスポート | 10分 |
| **デザイン方向アドバイザー** | 5流派 × 20哲学 · 3つの推薦 · 並列デモ生成 | 5分 |
| **5次元エキスパートレビュー** | レーダーチャート + 維持/修正/クイックウィン · 実行可能な修正リスト | 3分 |

---

## デモギャラリー

### デザイン方向アドバイザー

要件が曖昧な場合、スキルは5流派 × 20デザイン哲学から3つの差別化された方向を選び、並列デモを生成し、選択させます。

<p align="center"><img src="docs/w3-fallback-advisor-en.gif" width="100%"></p>

### iOSアプリプロトタイプ

iPhone 15 Pro精密ベゼル（Dynamic Island / ステータスバー / Home Indicator） · ステート駆動マルチスクリーンナビゲーション · Wikimedia/Met/Unsplashからのリアル画像 · 納品前のPlaywright自動クリックテスト。

<p align="center"><img src="docs/c1-ios-prototype-en.gif" width="100%"></p>

### モーションデザインエンジン

Stage + Spriteタイムラインモデル · `useTime` / `useSprite` / `interpolate` / `Easing` — 4つのAPIですべてのアニメーションニーズをカバー。1コマンドでMP4 / GIF / 60fps補間 / BGM + SFX付きファイナルカットをエクスポート。

<p align="center"><img src="docs/c3-motion-design-en.gif" width="100%"></p>

### スライドデッキ + 編集可能PPTX

HTML-firstスライド、自動スケーリング、キーボードナビゲーション、スピーカーノート付き。ネイティブテキストボックスを持つ編集可能PPTXにエクスポート — スクリーンショットをスライドに貼り付けたものではありません。

<p align="center"><img src="docs/c2-slides-pptx-en.gif" width="100%"></p>

### ライブTweaks

リアルタイムパラメータ調整 — カラースキーム、レイアウト、タイポグラフィ、密度を再生成なしで切り替え。変更はlocalStorageで永続化。

<p align="center"><img src="docs/c4-tweaks-en.gif" width="100%"></p>

### インフォグラフィック

精密なタイポグラフィを備えた、印刷対応のデータ駆動レイアウト。PDF/PNG/SVGにエクスポート。

<p align="center"><img src="docs/c5-infographic-en.gif" width="100%"></p>

### 5次元エキスパートレビュー

哲学的一貫性 / 視覚的階層 / ディテール実行 / 機能性 / 革新性 — 各項目0〜10点で評価、レーダーチャート、維持リスト、修正リスト（重要度順）、クイックウィン付き。

<p align="center"><img src="docs/c6-expert-review-en.gif" width="100%"></p>

---

## 仕組み

### ブランドアセットプロトコル

スキルはブランドを推測しません。厳格な5ステッププロトコルに従います：

1. **確認** — ロゴ、製品写真、UIスクリーンショット、カラーパレット、タイポグラフィを要求
2. **検索** — 公式サイト、プレスキット、アプリストアをクロールしてアセットを探索
3. **ダウンロード** — 実ファイルを取得（ロゴSVG、製品ヒーロー画像、UIスクリーンショット）
4. **検証** — 解像度、透過性、バージョンの新しさをチェック
5. **ロック** — すべてのアセットパスを含む`brand-spec.md`を作成；CSS変数で一貫性を強制

<p align="center"><img src="docs/w1-brand-protocol-en.gif" width="100%"></p>

> **なぜ重要か：** リアルなブランドアセットがなければ、AI生成デザインはすべて同じに見えます — 汎用グラデーション、プレースホルダーアイコン、ブランド認知ゼロ。プロトコルは最初に30分かかりますが、1〜2時間の手戻りを節約します。

### ジュニアデザイナーワークフロー

スキルはあなたに報告するジュニアデザイナーのように動作します：

1. **まず仮説を提示** — コードの前に推論 + プレースホルダーを記述
2. **承認を得る** — 詳細を埋める前にあなたの方向性を待つ
3. **イテレーション** — 最終結果だけでなく、途中経過を表示
4. **検証** — 納品前にPlaywrightスクリーンショット + コンソールエラーチェックを実行

<p align="center"><img src="docs/w2-junior-designer-en.gif" width="100%"></p>

### アンチAIスロップ

すべてのデザイン判断は厳格なアンチスロップリストに照らしてチェックされます：

| 避けるべきもの | 代わりに使うもの |
|---|---|
| 紫のグラデーション | ブランドカラー / `oklch()`ハーモニクス |
| 絵文字をアイコンとして使用 | 正直なプレースホルダーまたはリアルアセット |
| 角丸カード + 左ボーダーアクセント | コンテンツで獲得したクリーンな境界線 |
| SVGで描いた顔/オブジェクト | リアル画像または正直なプレースホルダー |
| 製品写真の代わりにCSSシルエット | ブランドプロトコルからの実際の製品画像 |
| Inter/Roboto/システムフォントをディスプレイに | 特徴的なディスプレイ + 本文フォントの組み合わせ |

---

## スターターコンポーネント

すぐに使えるプリビルトコンポーネント：

| コンポーネント | ユースケース |
|---|---|
| `assets/ios_frame.jsx` | iPhone 15 Proベゼル（Dynamic Island、ステータスバー、Home Indicator付き） |
| `assets/android_frame.jsx` | Androidデバイスフレーム |
| `assets/macos_window.jsx` | macOSウィンドウクローム（信号機ボタン付き） |
| `assets/browser_window.jsx` | ブラウザウィンドウ（URLバー + タブ付き） |
| `assets/animations.jsx` | Stage + Sprite + useTime + Easingエンジン |
| `assets/deck_index.html` | マルチファイルスライドデッキアセンブラー |
| `assets/deck_stage.js` | 単一ファイルスライドデッキWebコンポーネント |
| `assets/design_canvas.jsx` | バリアント並列比較グリッド |

## オーディオアセット

6つのシーン対応BGMトラック + 37の分類済みSFXファイルで、プロダクション品質のアニメーション出力：

- **BGM**：テック / 広告 / 教育 / チュートリアル（+ 代替バリアント）
- **SFX**：キーボード、ターミナル、トランジション、インパクト、マジック、フィードバック、UI、コンテナ、プログレス

---

## プロジェクト構造

```
myclaw-design/
├── SKILL.md              # コアスキル命令（OpenClawが読み込み）
├── assets/               # スターターコンポーネント、BGM、SFX、ショーケース
│   ├── *.jsx             # Reactコンポーネント（iOS/Android/macOSフレーム等）
│   ├── bgm-*.mp3         # 6つのシーン対応BGMトラック
│   ├── sfx/              # 37の分類済みサウンドエフェクト
│   └── showcases/        # 24のプリビルトデザインサンプル（8シーン × 3スタイル）
├── references/           # 詳細ガイド（オンデマンドで読み込み）
│   ├── animation-*.md    # アニメーションベストプラクティス + 落とし穴
│   ├── design-styles.md  # 20デザイン哲学データベース
│   ├── react-setup.md    # React + Babel技術セットアップ
│   ├── slide-decks.md    # スライドアーキテクチャガイド
│   ├── video-export.md   # MP4/GIFエクスポートパイプライン
│   └── ...               # 計18リファレンスファイル
└── scripts/              # 自動化スクリプト
    ├── render-video.js   # HTML → MP4（25fps）
    ├── convert-formats.sh # 60fps補間 + GIF
    ├── add-music.sh      # BGM + SFXミキシング
    ├── export_deck_*.mjs # PDF + PPTXエクスポート
    └── verify.py         # Playwright検証
```

---

## 要件

- [OpenClaw](https://github.com/openclaw/openclaw)（最新バージョン）
- Node.js ≥ 18（スクリプト用）
- [Playwright](https://playwright.dev/)（検証 + 動画エクスポート用）
- ffmpeg（動画フォーマット変換 + オーディオミキシング用）

---

## ライセンス

個人利用は無料。商用利用には許可が必要です。詳細は[LICENSE](LICENSE)をご覧ください。

---

<div align="center">

**[MyClaw.ai](https://myclaw.ai)** — すべてのユーザーに完全なサーバーとコード制御を提供するAIパーソナルアシスタントプラットフォーム。

</div>
