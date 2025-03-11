import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const wrapperSendExpenses = (email: string, inputText: string) => {
    const [
        date,
        translation_type,
        inStation,
        outStation,
        expense,
        description = undefined, // descriptionがない場合はundefined
    ] = separateText(inputText);

    sendExpenses({
        email,
        date,
        translation_type,
        expense,
        inStation,
        outStation,
        description,
    });
};

interface sendExpensesProps {
    email: string;
    date: string;
    expense: string;
    inStation: string;
    outStation: string;
    translation_type: string;
    description?: string;
    //   isReturn: boolean; // 出社したときに帰りの分も登録する
}

const sendExpenses = async ({
    email,
    date,
    expense,
    inStation,
    outStation,
    translation_type,
    description,
    //   isReturn,
}: sendExpensesProps) => {
    const data = {
        email,
        date,
        expense: Number(expense),
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

    try {
        const response = await axios.post(url, data, { headers });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("❌ APIエラー:", error.response ? error.response.data : error.message);
        return {
            success: false,
            error: error.response ? error.response.data : error.message,
        };
    };
}

const separateText = (inputText: string) => {
    const separatedText = inputText.split("_");
    // 訪問先/備考がない場合
    if (separatedText.length === 5) {
        return [...separatedText, ""];
    } else if (separatedText.length === 6) {
        // 訪問先/備考がある場合
        return separatedText;
    }
};

export default sendExpenses;
