import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            dob: new Date('02-25-1995'),
            email: "user@gmail.com",
            name: "shahul",
        }
    })
    console.log(user)
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    })