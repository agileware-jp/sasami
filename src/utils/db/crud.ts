import { KinconeExpense } from "kinconeExpense";
import prisma from "./prisma";

/**
 * 引数の情報にしたがって交通費情報をキンコンへポストする関数
 * @param kinkoneExpense 登録する交通費情報
 */
export async function createExpense(kinkoneExpense: KinconeExpense) {
    try {
        const newExpense = await prisma.kinconeExpense.create({
            data: {
                email: kinkoneExpense.email,
                usageDate: new Date(),
                departureLocation: kinkoneExpense.inStation,
                targetLocation: kinkoneExpense.outStation,
                type: kinkoneExpense.type,
                note: kinkoneExpense.note,
                expense: kinkoneExpense.expense,
            },
        });
    } catch (error) {
        console.error(error);
        // process.exit(1);
    }
}

/**
 * 引数のメールアドレスと一致する支出のうち、最新のものを返す
 * @param email 検索対象のメールアドレス
 */
export async function getExpenseByEmail(email: string) {
    try {
        const latestKinconeExpense = await prisma.kinconeExpense.findFirst({
            where: {
                email: email,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return latestKinconeExpense;
    } catch (error) {
        console.error(error);
        return null;
        // process.exit(1);
    }
}

export async function getExpenseById(id: number) {
    try {
        const kinconeExpense = await prisma.kinconeExpense.findUnique({
            where: {
                id: id,
            },
        });
        return kinconeExpense;
    } catch (error) {
        console.error(error);
        return null;
        // process.exit(1);
    }
}
