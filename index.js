import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const timestamp = new Date().toISOString();
    const newUser = await prisma.user.create({
        data: {
            email: `test+${timestamp}@example.com`,
            name: "John Doe",
        },
    });
    console.log("Inserted user:", newUser);

    const users = await prisma.user.findMany();
    console.log(users);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
