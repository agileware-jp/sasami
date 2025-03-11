import prisma from "./prisma";

export async function create_expense(email: string, inStation: string, outStation: string, type: number, note: string, expense: number) {
    try {
        const newExpense = await prisma.kinconeExpense.create({
            data: {
                email: email,
                date: new Date(),
                in: inStation,
                out: outStation,
                type: type,
                note: note,
                expense: expense,
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
export async function get_expense_by_email(email: string) {
    try {
        const latestKinconeExpense = await prisma.kinconeExpense.findFirst({
            where: {
              email: email,
            },
            orderBy: {
              timeStamp: 'desc',
            },
        });
    } catch (error) {
        console.error(error);
        // process.exit(1);
    }
}