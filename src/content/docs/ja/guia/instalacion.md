---
title: インストール
description: 5分でプルト環境をゼロからセットアップします。
sidebar:
  order: 1
---

## 必要条件

- **Python 3.10以上** — ジェネレーターとバリデーターはモダンな構文（`|`、ジェネリック型）を使用
- **SKILL.md互換エージェント**: [Claude Code](https://claude.ai/code)、Gemini CLI、Codex、またはWindsurf
- **Git**

Pythonのバージョン確認：

```bash
python3 --version
# Python 3.10.x 以上
```

## 1. フレームワークをクローン

```bash
git clone https://github.com/pepetox/puruto.git
cd puruto
```

## 2. 依存関係をインストール

フレームワークの唯一の要件はJinja2（ジェネレーターテンプレートのレンダリング用）です：

```bash
pip install jinja2
```

## 3. エコシステムを初期化

エージェントでリポジトリを開いて実行：

```
/init
```

`/init`スキルが自動的に作成します：

```
~/purutos/
├── puruto-data/       ← プライベートデータ保管庫
├── puruto-telegram/   ← Telegramコネクタ（MVPスキャフォールド）
├── puruto-cron/       ← ローカルスケジューラ（MVPスキャフォールド）
└── puruto-gateway/    ← ローカルREST API（MVPスキャフォールド）
```

:::tip
最小限から始めたい場合、`/init`は`puruto-data`だけを生成することもできます。他のリポジトリは必要なときに`/puruto-generator`で後から追加できます。
:::

## 4. インストールを確認

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-data
```

正常なら、タイプ検出とOK要約（エラー/警告数を含む）が表示されます。

## 環境変数

フレームワークの`.env.example`をコピーしてエコシステムのパスを設定：

```bash
cp .env.example .env
```

主な変数：

| 変数 | 説明 | デフォルト |
|---|---|---|
| `PURUTO_DATA_PATH` | `puruto-data`へのパス | `../puruto-data/` |
| `PURUTO_TELEGRAM_BOT_TOKEN` | TelegramボットトークN | *(空)* |

## 次のステップ

→ [最初のプルトを作成する](/ja/guia/primer-puruto/)
