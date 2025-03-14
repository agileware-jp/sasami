/**
 * キンコンへ登録する情報を構造化した型
 */
export type KinconeExpense = {
    email: string; // メールアドレス
    inStation: string; // 入場駅
    outStation: string; // 出場駅
    type: number; // 交通手段
    note: string; // 備考
    expense: number; // 支出（金額）
}