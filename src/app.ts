import { App } from "@slack/bolt";
import dotenv from "dotenv";

dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    // ソケットモードではポートをリッスンしませんが、アプリを OAuth フローに対応させる場合、
    // 何らかのポートをリッスンする必要があります
    port: Number(process.env.PORT) || 3000
});

// // Listens to incoming messages that contain "hello"
// app.message("hello", async ({ message, say }) => {
//   // say() sends a message to the channel where the event was triggered
//   if ("user" in message) {
//     await   say(`Hey there <@${message.user}>!`);

//   }
// });

// "hello" を含むメッセージをリッスンします
app.message('hello', async ({ message, say }) => {
    // イベントがトリガーされたチャンネルに say() でメッセージを送信します
    console.log("helloという文字列が送信されました");
    if ("user" in message ) {
        await say(`Hey there <@${message.user}>!`);
    }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
