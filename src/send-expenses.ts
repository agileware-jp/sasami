import axios from "axios";

interface sendExpensesProps {
  email: string;
  date: string;
  expense: string;
  inStation: string;
  outStation: string;
  isReturn: boolean;
}

const sendExpenses = ({
  email,
  date,
  expense,
  inStation,
  outStation,
  isReturn,
}: sendExpensesProps) => {
  const data = {
    email: "kondo.daisuke@agileware.jp",
    date: "2025-03-05",
    expense: 3000,
    type: 1,
    in: "天王寺",
    out: "天満橋",
  };

  // APIエンドポイントとヘッダー情報
  const url = "https://api.kincone.com/v1/expense";
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer BZa5Zmyz4iPhFNSFn6i6GQb7VxHCjkoK",
    "Content-Type": "application/json",
  };

  // `POST` リクエストを送信
  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("✅ 成功:", response.data);
    })
    .catch((error) => {
      console.error(
        "❌ エラー:",
        error.response ? error.response.data : error.message
      );
    });
};

export default sendExpenses;
