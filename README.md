# 目次

- [目次](#目次)
- [環境情報](#環境情報)
- [導入方法](#導入方法)
  - [1. キンコンAPIのトークン取得](#1-キンコンapiのトークン取得)
    - [参考](#参考)
  - [2. Slackアプリの作成](#2-slackアプリの作成)
    - [2-1. 権限設定 \& 導入](#2-1-権限設定--導入)
    - [2-2. スラッシュコマンドの登録](#2-2-スラッシュコマンドの登録)
    - [参考](#参考-1)
  - [3. Nodeモジュールのインストール](#3-nodeモジュールのインストール)
  - [4. 環境変数の追加](#4-環境変数の追加)

# 環境情報

- Node.js: v22.14.0
- npm: v10.9.2
- PostgreSQL: v17

# 導入方法

## 1. キンコンAPIのトークン取得

[参考1-1](https://support.kincone.com/hc/ja/articles/4411890251801-%E3%82%AD%E3%83%B3%E3%82%B3%E3%83%B3-API%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3) を参考に、キンコンAPIのAPIキーを取得して控えてください。後の環境変数の設定に使います。

具体的には、[キンコンのサイト](https://kincone.com/dashboard/admin)の右上の歯車マークを押し、「外部連携」ボタン > 「APIトークン」を押し、トークンを発行します。<br/>
注意:「設定」項目から「交通費登録」の権限を付与したトークンにしてください。

### 参考

- 1-1（キンコンのAPI設定）: https://support.kincone.com/hc/ja/articles/4411890251801-%E3%82%AD%E3%83%B3%E3%82%B3%E3%83%B3-API%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3

## 2. Slackアプリの作成

Slackのアプリケーションを作成し、必要な権限を付与します。また、本アプリケーションではWebSocketを用いた通信方式を使うため、ソケットモード（[参考2-2](https://qiita.com/seratch/items/1a460c08c3e245b56441)）を用います。

### 2-1. 権限設定 & 導入

Oauth設定でBotに付与する権限を設定し、ワークスペースに導入します。
Slackのアプリケーション設定画面から「OAuth & Permissions」 > 「Scopes」で必要な権限設置を行い、その後動作させる対象のワークスペースにInstallしてください。OauthトークンとSigning Secret（[参考2-1](https://qiita.com/tomomi_slack/items/21fedcc6ce07aa44a670)）、SLACK_APP_TOKEN（[参考2-2](https://qiita.com/seratch/items/1a460c08c3e245b56441)）は後の環境変数に用いるため、控えてください。

今回必要な権限は次のとおりです。

- `channels:history`
- `chat:write`
- `chat:write.public`
- `commands`
- `users.profile:read`

### 2-2. スラッシュコマンドの登録

Slack Appの設定画面の左部分から、「Slash Commands」を選択し、Nameを「`/kincone`」としたコマンドを追加してください。

### 参考

- 2-1（Slackのアプリケーション作成）: https://qiita.com/tomomi_slack/items/21fedcc6ce07aa44a670 

- 2-2（ソケットモードについて）: https://qiita.com/seratch/items/1a460c08c3e245b56441


## 3. Nodeモジュールのインストール

```shell
npm install
```

## 4. 環境変数の追加

開発用の環境では、`.env`ファイルに次の環境変数を指定してください。本番環境ではデプロイ先の環境変数を直接設定してください。

それぞれの環境変数の意味は次のとおりです。
- `SLACK_SIGNING_SECRET` ... SlackアプリのSigning Secret（[参考2-1](https://qiita.com/tomomi_slack/items/21fedcc6ce07aa44a670)）
- `SLACK_BOT_TOKEN` ... SlackアプリのOauthトークン（[参考2-1](https://qiita.com/tomomi_slack/items/21fedcc6ce07aa44a670)）。`xoxb-`から始まる。
- `SLACK_APP_TOKEN` ... SlackアプリのSocket ModeのためのApp Levelトークン（[参考2-2](https://qiita.com/seratch/items/1a460c08c3e245b56441)）。`xapp-`から始まる。
- `KINCONE_TOKEN` ... キンコンAPIのトークン（[参考1-1](https://support.kincone.com/hc/ja/articles/4411890251801-%E3%82%AD%E3%83%B3%E3%82%B3%E3%83%B3-API%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3)）。
- `DATABASE_URL`...データベースのURL。
- `NODE_ENV` ... `production`または`development`。この環境変数の値が`production`のときに限り、Slackのコマンドが本番環境のものとなる。

[設定例]
```
SLACK_SIGNING_SECRET=xxxxx
SLACK_BOT_TOKEN=xoxb-yyyyy
SLACK_APP_TOKEN=xapp-zzzzz
KINCONE_TOKEN=wwwww
DATABASE_URL="postgresql://aaaaa@bbbbb:ccccc/ddddd"
NODE_ENV=development
```
