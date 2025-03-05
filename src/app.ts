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
  port: Number(process.env.PORT) || 3000,
});

app.command("/kincone", async ({ command, ack, client }) => {
  await ack();

  try {
    await client.views.open({
      trigger_id: command.trigger_id,
      view: {
        type: "modal",
        callback_id: "kincone_form",
        title: {
          type: "plain_text",
          text: "Kincone Form",
        },
        blocks: [
          {
            type: "input",
            block_id: "reason_block",
            label: {
              type: "plain_text",
              text: "Reason",
            },
            element: {
              type: "plain_text_input",
              action_id: "reason",
            },
          },
          {
            type: "input",
            block_id: "date_block",
            label: {
              type: "plain_text",
              text: "Date",
            },
            element: {
              type: "datepicker",
              action_id: "date_picker",
              initial_date: new Date().toISOString().split("T")[0],
              placeholder: {
                type: "plain_text",
                text: "Select a date",
              },
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.view("kincone_form", async ({ ack, body, view, client }) => {
  await ack();

  // formで送信した内容の取得
  const reason = view.state.values.reason_block.reason.value;
  const date = view.state.values.date_block.date_picker.selected_date;

  const channelId = view.private_metadata;
  if (!channelId) {
    console.log("undefined");
  } else {
    console.log(channelId);
  }

  const userInfo = await client.users.profile.get({ user: body.user.id });
  const email = userInfo.profile?.email || "Email not found";

  if (email === "Email not found") {
  }

  try {
    await client.chat.postMessage({
      channel: channelId,
      text: `<@${body.user.id}> has completed the Kincone form! ✅`,
    });
  } catch (error) {
    console.error(error);
  }
  console.log("Kincone Form Submitted:", { reason, date, email });

  // sasami botに内容を返信
  //   try {
  //     await client.chat.postMessage({
  //       channel: body.user.id,
  //       text: `Your Kincone request:
  //       - Reason: ${reason}
  //       - Date: ${date}`
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
