import { App } from "@slack/bolt";
import dotenv from "dotenv";
import sendExpenses from "./send-expenses";
import { getViewsOpenArguments } from "./views-open-args";
import { createExpense } from "./utils/db/crud";
import { validateHalfWidthNumbers } from "./utils/validationNumber";

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
        // ユーザー情報を取得
        const userInfo = await client.users.profile.get({ user: command.user_id });
        const email = userInfo.profile?.email;
        await client.views.open(await getViewsOpenArguments(command.trigger_id, email));
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

    try {
        validateHalfWidthNumbers(expense);
    } catch (error) {
        await client.chat.postMessage({
            channel: body.user.id,
            text: "交通費は *半角数字* で入力してください",
        });
        return;
    }

    const res = await sendExpenses({
        email,
        date,
        expense,
        inStation,
        outStation,
        translation_type: translation,
        description: remarks,
    });

    /*
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
    */

    if (res.success) {
        await createExpense(email, inStation, outStation, Number(translation), remarks, Number(expense));
        // sasami botに内容を返信
        try {
            await client.chat.postMessage({
                channel: body.user.id,
                text: `✅ *Kincone申請が完了しました！*\n
            - 📅 *利用日:* ${date}
            - 🚋 *交通手段:* ${translationLabel}
            - 🏢 *入場駅:* ${inStation}
            - 🏢 *出場駅:* ${outStation}
            - 📝 *備考:* ${remarks}
            - 💰 *交通費:* ${expense}円
            - 🌐 [運賃確認](${urlFare})`,
            });
        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            await client.chat.postMessage({
                channel: body.user.id,
                text: `Failed to send Kincone request: ${res.error}`,
            });
        } catch (error) {
            console.error(error);
        }
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();
