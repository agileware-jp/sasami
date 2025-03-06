import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const wrapperSendExpenses = (email: string, inputText: string) => {
    const [
        date,
        translation_type,
        inStation,
        outStation,
        expenses,
        description = undefined, // descriptionがない場合はundefined
    ] = separateText(inputText);

    sendExpenses({
        email,
        date,
        translation_type,
        expenses,
        inStation,
        outStation,
        description,
    });
};

interface sendExpensesProps {
    email: string;
    date: string;
    expenses: string;
    inStation: string;
    outStation: string;
    translation_type: string;
    description?: string;
    //   isReturn: boolean; // 出社したときに帰りの分も登録する
}

const sendExpenses = async ({
    email,
    date,
    expenses,
    inStation,
    outStation,
    translation_type,
    description,
    //   isReturn,
}: sendExpensesProps) => {
    console.log("ここまで来ている");
    const data = {
        email,
        date,
        expense: Number(expenses),
        type: Number(translation_type),
        in: inStation,
        out: outStation,
        note: description,
    };

    // APIエンドポイントとヘッダー情報
    const url = "https://api.kincone.com/v1/expense";
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.KINCONE_TOKEN}`,
        "Content-Type": "application/json",
    };

    // `POST` リクエストを送信
    axios
        .post(url, data, { headers })
        .then((response) => {
            console.log("✅ 成功:", response.data);
        })
        .catch((error) => {
            console.error("❌ エラー:", error.response ? error.response.data : error.message);
        });
};

const separateText = (inputText: string) => {
    const separatedText = inputText.split("_");
    // 訪問先/備考がない場合
    if (separatedText.length === 5) {
        const [date, translation_type, inStation, outStation, expense] = separatedText;
        return [date, translation_type, inStation, outStation, expense];
    } else if (separatedText.length === 6) {
        // 訪問先/備考がある場合
        const [date, translation_type, inStation, outStation, expense, description] = separatedText;
        return [date, translation_type, inStation, outStation, expense, description];
    }
};

export default sendExpenses;
