import { ViewsOpenArguments } from "@slack/web-api/dist";
import { getExpenseByEmail } from "./utils/db/crud";
import { transportationOptionsMap } from "./utils/db/transpotationOptionsMap";
import { getHistory } from "./utils/db/getHistory";

/**
 * viewのopenに必要な情報を取得する関数
 * @param triggerId コマンドのトリガーID
 * @returns 情報を格納した構造体
 */

export type dataType = {
    id: number;
    email: string;
    usageDate: Date;
    createdAt: Date;
    departureLocation: string | null;
    targetLocation: string | null;
    type: number;
    note: string | null;
    expense: number;
};

export const getViewsOpenArguments = async (email: string, data: dataType | null) => {
    const history: dataType[] = getHistory();
    const historyOptions =
        history?.map((entry) => ({
            text: {
                type: "plain_text",
                text: `${entry.usageDate.toISOString().slice(0, 10)} - ${entry.departureLocation} → ${entry.targetLocation}`,
            },
            value: String(entry.id),
        })) ?? [];

    let blocks: any[] = [];
    const transportationOption = data?.type.toString() ?? "1";

    // 履歴選択セクション（履歴がある場合のみ追加）
    if (historyOptions.length > 0) {
        blocks.push({
            type: "input",
            block_id: "history_block",
            label: { type: "plain_text", text: "履歴を参照" },
            element: {
                // 修正箇所：input ブロック内では element が必要
                type: "static_select",
                action_id: "history_select",
                placeholder: { type: "plain_text", text: "過去の履歴を選択" },
                options: historyOptions,
            },
        });

        // ここでは actions ブロックを使って「更新」ボタンを追加
        blocks.push({
            type: "actions",
            elements: [
                {
                    type: "button",
                    text: { type: "plain_text", text: "更新" },
                    action_id: "update_button", // ボタンのアクションID
                },
            ],
        });
    }

    // 他のフォーム要素を追加
    blocks = blocks.concat([
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
                    { text: { type: "plain_text", text: "バス/路面電車" }, value: "2" },
                    { text: { type: "plain_text", text: "タクシー" }, value: "3" },
                    { text: { type: "plain_text", text: "新幹線/特急" }, value: "4" },
                    { text: { type: "plain_text", text: "飛行機" }, value: "5" },
                    { text: { type: "plain_text", text: "車" }, value: "6" },
                    { text: { type: "plain_text", text: "船/フェリー" }, value: "7" },
                    { text: { type: "plain_text", text: "その他" }, value: "8" },
                    { text: { type: "plain_text", text: "物販" }, value: "0" },
                ],
                initial_option: {
                    text: { type: "plain_text", text: transportationOptionsMap[transportationOption] },
                    value: transportationOption,
                },
            },
        },
        {
            type: "input",
            block_id: "in_station",
            label: { type: "plain_text", text: "入場駅" },
            element: {
                type: "plain_text_input",
                action_id: "in_station",
                initial_value: data?.departureLocation ?? "",
                placeholder: { type: "plain_text", text: "入場駅" },
            },
        },
        {
            type: "input",
            block_id: "out_station",
            label: { type: "plain_text", text: "出場駅" },
            element: {
                type: "plain_text_input",
                action_id: "out_station",
                initial_value: data?.targetLocation ?? "",
                placeholder: { type: "plain_text", text: "出場駅" },
            },
        },
        {
            type: "input",
            block_id: "remarks",
            label: { type: "plain_text", text: "訪問先/備考" },
            element: {
                type: "plain_text_input",
                action_id: "remarks",
                initial_value: data?.note ?? "",
                placeholder: { type: "plain_text", text: "訪問先/備考" },
            },
        },
        {
            type: "input",
            block_id: "expense",
            label: { type: "plain_text", text: "交通費（半角で入力してください）" },
            element: {
                type: "plain_text_input",
                action_id: "expense",
                initial_value: String(data?.expense ?? ""),
                placeholder: { type: "plain_text", text: "交通費" },
            },
        },
    ]);

    return {
        view: {
            type: "modal",
            callback_id: "kincone_form",
            title: {
                type: "plain_text",
                text: "Kincone Form",
            },
            blocks: blocks,
            submit: {
                type: "plain_text",
                text: "Submit",
            },
        },
    } as ViewsOpenArguments;
};
