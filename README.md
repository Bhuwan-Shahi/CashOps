# CashOps - Personal Budget Manager

A modern budget management web application built with Next.js 14+, TypeScript, PostgreSQL, and Prisma.

## Features

- ✅ **Transaction Management**: Record income and expenses with categories
- ✅ **Wishlist/Debt Tracking**: Track savings goals, debts owed, and debts owing
- ✅ **Analytics Dashboard**: Visual insights with charts and summaries
- ✅ **Category Management**: Create custom categories for income and expenses
- ✅ **Filtering**: Filter transactions by date range, type, and category
- ✅ **Export**: Export transactions to CSV
- ✅ **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Database

```bash
docker-compose up -d
```

Wait a few seconds for the database to be ready.

### 3. Run Database Migrations

```bash
npx prisma migrate dev
```

### 4. Seed the Database (Optional)

Create a default user and sample categories:

```bash
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
cashops/
├── app/                    # Next.js app router pages
│   ├── (dashboard)/       # Dashboard layout group
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── [features]/       # Feature-specific components
├── lib/                   # Utilities and server code
│   ├── actions/          # Server actions
│   │   ├── transactions.ts
│   │   ├── categories.ts
│   │   ├── wishlist.ts
│   │   └── analytics.ts
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── types/
│   └── index.ts           # TypeScript types
└── public/                # Static assets
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cashops?schema=public"
DEFAULT_USER_ID="user_default_001"
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create and run migrations
npx prisma generate  # Generate Prisma Client
```

## Database Management

### View Database with Prisma Studio

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma migrate reset
```

### Stop PostgreSQL

```bash
docker-compose down
```

### Remove Database Volume

```bash
docker-compose down -v
```

## Key Features Implementation

### Transaction Management
- Create, read, update, delete transactions
- Categorize as income or expense
- Add descriptions and custom dates
- Server actions in `lib/actions/transactions.ts`

### Categories
- Create custom categories for both income and expenses
- Color-coded for easy identification
- Server actions in `lib/actions/categories.ts`

### Wishlist & Debts
- Track savings goals
- Monitor money you owe others
- Track money others owe you
- Set due dates and add notes
- Server actions in `lib/actions/wishlist.ts`

### Analytics
- Income vs Expense line charts
- Category breakdown pie charts
- Summary cards with totals
- Monthly comparisons
- Server actions in `lib/actions/analytics.ts`

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Authentication (Future Enhancement)

The app is currently set up for single-user use with a hard-coded user ID. To add authentication:

1. Install NextAuth.js: `npm install next-auth`
2. Create `app/api/auth/[...nextauth]/route.ts`
3. Update server actions to use session user ID instead of `DEFAULT_USER_ID`
4. Add login/signup pages

## Troubleshooting

### Database Connection Error

Make sure PostgreSQL is running:
```bash
docker-compose ps
```

### Migration Errors

Reset and recreate database:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Type Errors

Regenerate Prisma Client:
```bash
npx prisma generate
```

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT

---

Built with ❤️ using Next.js and modern web technologies
