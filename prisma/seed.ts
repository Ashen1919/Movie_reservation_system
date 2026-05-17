import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD!, 10);

    await prisma.user.upsert({
        where: { email: process.env.ADMIN_SEED_EMAIL! },
        update: {},
        create: {
            name: 'Admin',
            email: process.env.ADMIN_SEED_EMAIL!,
            passwordHash,
            role: 'ADMIN',
            isEmailVerified: true,
        },
    });

    console.log('Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
