/**
 * 半角数字のみかチェックする関数
 * @param input チェック対象の文字列
 * @returns 半角数字ならtrue、そうでなければエラーを投げる
 */
export function validateHalfWidthNumbers(input: string): void {
    const num = Number(input);

    if (isNaN(num)) {
        throw new Error(`"${input}" は数値に変換できません`);
    }

    if (!Number.isInteger(num)) {
        throw new Error(`"${input}" は整数ではありません`);
    }
}

// // 使用例
// try {
//     validateHalfWidthNumbers("12345"); // ✅ 問題なし
//     validateHalfWidthNumbers("１２３４５"); // ❌ 全角数字 → エラー
//     validateHalfWidthNumbers("123a5"); // ❌ 英字を含む → エラー
//     validateHalfWidthNumbers("123 45"); // ❌ 空白を含む → エラー
// } catch (error) {
//     console.error(error.message);
// }
