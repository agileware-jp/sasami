import { App } from "@slack/bolt";
import dotenv from "dotenv";
import sendExpenses from "./send-expenses";
import { getViewsOpenArguments } from "./views-open-args";

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
        await client.views.open(getViewsOpenArguments(command.trigger_id));
    } catch (error) {
        console.error(error);
    }
});

app.view("kincone_form", async ({ ack, body, view, client }) => {
    await ack();

    // formで送信した内容の取得
    const stateValues = view.state.values;
    const date = stateValues.date_block?.["use-date"]?.selected_date;
    const translation = stateValues.translation?.transportation_select?.selected_option.value;
    const inStation = stateValues.in_station?.in_station?.value;
    const outStation = stateValues.out_station?.out_station?.value;
    const remarks = stateValues.remarks?.remarks?.value;
    const expense = stateValues.expense?.expense?.value;
    const translationLabel = stateValues.translation?.transportation_select?.selected_option.text.text;

    const userInfo = await client.users.profile.get({ user: body.user.id });
    const email = userInfo.profile?.email;

    const urlFare = "https://kincone.com/fare";

    await sendExpenses({
        email,
        date,
        expense,
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
        expense,
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
        - Expenses: ${expense}
        - URL: ${urlFare}`,
        });
        console.log("メッセージを返信しました");
    } catch (error) {
        console.error(error);
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();
