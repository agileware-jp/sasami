import { ViewsOpenArguments } from "@slack/web-api/dist";
import { getExpenseByEmail } from "./utils/db/crud";
import { transportationOptionsMap } from "./utils/db/transpotationOptionsMap";

/**
 * viewのopenに必要な情報を取得する関数
 * @param triggerId コマンドのトリガーID
 * @returns 情報を格納した構造体
 */
export const getViewsOpenArguments = async (triggerId: string, email: string) => {
    const data = await getExpenseByEmail(email);
    const transportationOption = data?.type.toString() ?? "1";
    return {
        trigger_id: triggerId,
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
                        initial_option: {
                            text: { type: "plain_text", text: transportationOptionsMap[transportationOption] },
                            value: transportationOption,
                        },
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
                        initial_value: data?.departureLocation,
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
                        initial_value: data?.targetLocation,
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
                        initial_value: data?.note,
                        placeholder: {
                            type: "plain_text",
                            text: "訪問先/備考",
                        },
                    },
                },
                // 交通費
                {
                    type: "input",
                    block_id: "expense",
                    label: {
                        type: "plain_text",
                        text: "交通費（半角で入力してください）",
                    },
                    element: {
                        type: "plain_text_input",
                        action_id: "expense",
                        initial_value: String(data?.expense ?? ""),
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
    } as ViewsOpenArguments;
};
