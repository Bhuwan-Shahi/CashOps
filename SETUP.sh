#!/bin/bash

echo "🚀 CashOps Setup Script"
echo "======================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL
echo "📦 Starting PostgreSQL container..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run Prisma migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init --skip-seed

# Generate Prisma Client
echo "⚙️  Generating Prisma Client..."
npx prisma generate

# Create default user
echo "👤 Creating default user..."
npx prisma db execute --stdin << SQL
INSERT INTO users (id, email, name) VALUES ('user_default_001', 'user@cashops.local', 'Default User')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, "userId", name, type, color) VALUES
  ('cat_salary', 'user_default_001', 'Salary', 'INCOME', '#10b981'),
  ('cat_freelance', 'user_default_001', 'Freelance', 'INCOME', '#3b82f6'),
  ('cat_groceries', 'user_default_001', 'Groceries', 'EXPENSE', '#ef4444'),
  ('cat_utilities', 'user_default_001', 'Utilities', 'EXPENSE', '#f59e0b'),
  ('cat_transport', 'user_default_001', 'Transport', 'EXPENSE', '#8b5cf6'),
  ('cat_entertainment', 'user_default_001', 'Entertainment', 'EXPENSE', '#ec4899')
ON CONFLICT ("userId", name) DO NOTHING;
SQL

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Start adding transactions!"
echo ""
echo "Useful commands:"
echo "- npm run dev        : Start development server"
echo "- npx prisma studio  : Open database GUI"
echo "- docker-compose down: Stop PostgreSQL"
