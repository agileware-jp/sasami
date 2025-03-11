import prisma from "./prisma";


async function main() {
    const newExpense = await prisma.kinconeExpense.create({
        data: {
            email: 'test@example.com',
            date: new Date(),
            in: '天満橋駅',
            out: '東梅田駅',
            type: 1,
            note: 'test',
            expense: 300,
        },
    });
    const latestKinconeExpense = await prisma.kinconeExpense.findFirst({
        where: {
          email: 'test@example.com',
        },
        orderBy: {
          timeStamp: 'desc',
        },
    });
    console.log(latestKinconeExpense);
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


async function create_expense(email: string, inStation: string, outStation: string, type: number, note: string, expense: number) {
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
async function get_expense_by_email(email: string) {
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