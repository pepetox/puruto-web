---
title: 最初のプルト
description: コマンド一つで完全なプルトリポジトリを生成します。
sidebar:
  order: 2
---

## エージェントでプルトを生成

フレームワークをエージェントに読み込ませて実行：

```
/puruto-generator
```

ジェネレーターが質問します：

1. **名前** — 規則: `puruto-<名前>`、スペースなし（例: `puruto-notes`）
2. **説明** — 何をするかを一行で
3. **データベースが必要ですか？** — デフォルトはローカルSQLite
4. **追加スキル** — 追加機能のリスト（例: `create,search,export`）

## CLIから直接実行

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-notes \
  --description "個人メモ管理" \
  --db true \
  --skills "create,search,export"
```

## 生成されたの構造

```
~/purutos/puruto-notes/
├── CLAUDE.md              ← エージェントのアイデンティティとルール
├── agent.md               ← Codex/Windsurf/Gemini用の等価ファイル
├── README.md              ← 人間向けドキュメント
├── .env.example           ← 環境変数テンプレート
├── .env                   ← ローカル設定（gitに含めない）
├── .gitignore
├── .puruto-standard-version
├── db/                    ← ローカルSQLiteデータベース
└── .claude/skills/
    ├── init/SKILL.md      ← 環境をセットアップ
    ├── help/SKILL.md      ← 使い方の説明
    ├── list/SKILL.md      ← 全機能を一覧
    ├── status/SKILL.md    ← 現在の状態
    ├── create/SKILL.md    ← カスタムスキル
    ├── search/SKILL.md    ← カスタムスキル
    └── export/SKILL.md    ← カスタムスキル
```

## 試してみる

```bash
cd ~/purutos/puruto-notes

# エージェントで：
/init      ← ローカル環境をセットアップ（.envを作成、dbを初期化）
/help      ← 使い方を説明
/list      ← 利用可能なスキルを一覧表示
/status    ← 現在の状態を表示
```

## 高度なオプション

### IPCあり — プルト間の委任

プルト間のエージェント通信ランタイムを生成：

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-finance \
  --description "個人財務" \
  --ipc true
```

リポジトリに追加されます：
- `.claude/skills/call/SKILL.md` — 他のプルトにタスクを委任する`/call`スキル
- `.puruto-ipc.json` — ターゲットの許可リストと委任制限
- `ipc.py` + `invoker.py` — ローカル呼び出しランタイム

### Agent-CIあり — エージェントテスト

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo-ci \
  --description "エージェントテスト付きデモ" \
  --agent-tests true
```

以下を含む`tests/agent/`を生成：
- YAMLの宣言的テストケース
- モックランナー（実際のLLM不要）
- オプションのOllamaアダプター

## 次のステップ

→ [スキルを理解する](/ja/guia/skills/)
