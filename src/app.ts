import { App } from "@slack/bolt";
import dotenv from "dotenv";
import sendExpenses from "./send-expenses";

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
                    // 利用日
                    {
                        type: "input",
                        block_id: "date_block",
                        label: {
                            type: "plain_text",
                            text: "利用日",
                        },
                        element: {
                            type: "datepicker",
                            action_id: "use-date",
                            initial_date: new Date().toISOString().split("T")[0], // 今日の日付を設定
                        },
                    },
                    // 交通手段
                    {
                        type: "input",
                        block_id: "translation",
                        label: {
                            type: "plain_text",
                            text: "交通手段",
                        },
                        element: {
                            type: "static_select",
                            action_id: "transportation_select",
                            placeholder: {
                                type: "plain_text",
                                text: "交通手段を選択",
                            },
                            options: [
                                { text: { type: "plain_text", text: "電車" }, value: "1" },
                                {
                                    text: { type: "plain_text", text: "バス/路面電車" },
                                    value: "2",
                                },
                                { text: { type: "plain_text", text: "タクシー" }, value: "3" },
                                {
                                    text: { type: "plain_text", text: "新幹線/特急" },
                                    value: "4",
                                },
                                { text: { type: "plain_text", text: "飛行機" }, value: "5" },
                                { text: { type: "plain_text", text: "車" }, value: "6" },
                                {
                                    text: { type: "plain_text", text: "船/フェリー" },
                                    value: "7",
                                },
                                { text: { type: "plain_text", text: "その他" }, value: "8" },
                                { text: { type: "plain_text", text: "物販" }, value: "0" },
                            ],
                        },
                    },
                    // 入場駅
                    {
                        type: "input",
                        block_id: "in_station",
                        label: {
                            type: "plain_text",
                            text: "入場駅",
                        },
                        element: {
                            type: "plain_text_input",
                            action_id: "in_station",
                            placeholder: {
                                type: "plain_text",
                                text: "入場駅",
                            },
                        },
                    },
                    // 出場駅
                    {
                        type: "input",
                        block_id: "out_station",
                        label: {
                            type: "plain_text",
                            text: "出場駅",
                        },
                        element: {
                            type: "plain_text_input",
                            action_id: "out_station",
                            placeholder: {
                                type: "plain_text",
                                text: "出場駅",
                            },
                        },
                    },
                    // 訪問先/備考
                    {
                        type: "input",
                        block_id: "remarks",
                        label: {
                            type: "plain_text",
                            text: "訪問先/備考",
                        },
                        element: {
                            type: "plain_text_input",
                            action_id: "remarks",
                            placeholder: {
                                type: "plain_text",
                                text: "訪問先/備考",
                            },
                        },
                    },
                    // 交通費
                    {
                        type: "input",
                        block_id: "expenses",
                        label: {
                            type: "plain_text",
                            text: "交通費（半角で入力してください）",
                        },
                        element: {
                            type: "plain_text_input",
                            action_id: "expenses",
                            placeholder: {
                                type: "plain_text",
                                text: "交通費",
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
    const date = view.state.values.date_block?.["use-date"]?.selected_date;
    const translation = view.state.values.translation?.transportation_select?.selected_option.value;
    const inStation = view.state.values.in_station?.in_station?.value;
    const outStation = view.state.values.out_station?.out_station?.value;
    const remarks = view.state.values.remarks?.remarks?.value;
    const expenses = view.state.values.expenses?.expenses?.value;

  const translationLabel = view.state.values.translation?.transportation_select?.selected_option.text.text;
  
  const userInfo = await client.users.profile.get({ user: body.user.id });
  const email = userInfo.profile?.email;

  const url_fare = "https://kincone.com/fare";

    await sendExpenses({
        email,
        date,
        expenses,
        inStation,
        outStation,
        translation_type: translation,
        description: remarks,
    });

  console.log("Kincone Form Submitted:", {
    date,
    translation,
    translationLabel,
    inStation,
    outStation,
    remarks,
    expenses,
    email,
  });

  // sasami botに内容を返信
  try {
    await client.chat.postMessage({
      channel: body.user.id,
      text: `Your Kincone request:
        - Date: ${date}
        - Translation: ${translationLabel}
        - In Station: ${inStation}
        - Out Station: ${outStation}
        - Remarks: ${remarks}
        - Expenses: ${expenses}
        - URL: ${url_fare}`,
      });
      console.log("メッセージを返信しました");
    } catch (error) {
      console.error(error);
      console.log("エラーが発生しました");
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();
