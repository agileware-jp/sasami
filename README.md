# Environment

- node: v22.14.0
- npm: v10.9.2

# Setup

## Slackアプリの作成

（todo: 作成手順）


## Nodeモジュールのインストール

```shell
npm install
```

## 環境変数の追加

`.env`ファイルに次の環境変数を指定してください。

```
SLACK_SINGING_SECRET=XXXXXX
SLACK_BOT_TOKEN=YYYYYY
SLACK_APP_TOKEN=ZZZZZZ
KINCONE_TOKEN=WWWWWW
```

## Slack上でアプリに権限付与

ユーザー情報を用いるため、Slack上でワークスペースの設定からアプリケーションにユーザー情報を読み取る権限を付与してください。

## kinkoneのAPIトークン取得

キンコンのサイトの右上の歯車マークを押し。「外部連携」ボタン > 「APIトークン」を押し。トークンを発行する。<br/>
注意:「設定」項目から「交通費登録」の権限を付与したトークンにする。

# Slack側の操作手順

todo: 

1. チャンネルにてコマンド「todo」を打つ。
2. （todo: メールアドレスがSlackに紐づいているメールアドレスと異なる場合、コマンドを用いて変更）
3. フォームに必要事項を入力
4. （完了後、入力内容とユーザーのメールアドレスに対応してキンコンに交通費情報が追加される）
