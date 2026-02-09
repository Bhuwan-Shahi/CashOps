import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || 'user_default_001'

  // Create or update default user
  const user = await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: {
      id: DEFAULT_USER_ID,
      email: 'user@cashops.local',
      name: 'Default User',
    },
  })

  console.log('✅ Default user created:', user.email)

  // Create default categories
  const incomeCategories = [
    { name: 'Salary', type: 'INCOME', color: '#10b981' },
    { name: 'Freelance', type: 'INCOME', color: '#3b82f6' },
    { name: 'Investment', type: 'INCOME', color: '#8b5cf6' },
    { name: 'Gift', type: 'INCOME', color: '#ec4899' },
  ]

  const expenseCategories = [
    { name: 'Food', type: 'EXPENSE', color: '#ef4444' },
    { name: 'Transport', type: 'EXPENSE', color: '#f59e0b' },
    { name: 'Shopping', type: 'EXPENSE', color: '#06b6d4' },
    { name: 'Entertainment', type: 'EXPENSE', color: '#8b5cf6' },
    { name: 'Bills', type: 'EXPENSE', color: '#6366f1' },
    { name: 'Healthcare', type: 'EXPENSE', color: '#ec4899' },
    { name: 'Education', type: 'EXPENSE', color: '#84cc16' },
  ]

  const allCategories = [...incomeCategories, ...expenseCategories]

  for (const category of allCategories) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: DEFAULT_USER_ID,
          name: category.name,
        },
      },
      update: {},
      create: {
        userId: DEFAULT_USER_ID,
        name: category.name,
        type: category.type as any,
        color: category.color,
      },
    })
  }

  console.log('✅ Default categories created')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
