#!/bin/bash
# Blue Kailash International - Database Seed Script
# This script seeds the database with sample data

set -e

echo "=================================="
echo "Blue Kailash - Database Seeding"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}DATABASE_URL not set. Loading from .env...${NC}"
    if [ -f ".env" ]; then
        export $(cat .env | xargs)
    fi
fi

# Create seed script
cat > /tmp/seed.ts << 'EOF'
import { db } from "./server/db";
import { products, adminSettings, users } from "./shared/schema";

async function seed() {
  console.log("Starting database seed...");

  // Seed products
  const sampleProducts = [
    {
      name: "Himalayan Pink Salt",
      hsCode: "2501.00",
      description: "Premium grade Himalayan pink salt for culinary and wellness use",
      category: "Food & Spices",
      origin: "Nepal",
      imageUrl: "/images/products/himalayan-salt.jpg",
      isActive: true,
    },
    {
      name: "Handmade Pashmina Shawl",
      hsCode: "6214.20",
      description: "100% authentic Pashmina wool shawl, handwoven in Nepal",
      category: "Textiles",
      origin: "Nepal",
      imageUrl: "/images/products/pashmina.jpg",
      isActive: true,
    },
    {
      name: "Nepali Organic Tea",
      hsCode: "0902.10",
      description: "Premium organic tea leaves from the highlands of Nepal",
      category: "Food & Beverages",
      origin: "Nepal",
      imageUrl: "/images/products/tea.jpg",
      isActive: true,
    },
    {
      name: "Handcrafted Singing Bowl",
      hsCode: "9208.90",
      description: "Traditional Tibetan singing bowl for meditation and healing",
      category: "Handicrafts",
      origin: "Nepal",
      imageUrl: "/images/products/singing-bowl.jpg",
      isActive: true,
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product).onConflictDoNothing();
  }
  console.log(`Seeded ${sampleProducts.length} products`);

  // Seed admin settings
  const defaultSettings = [
    { key: "company_name", value: "Blue Kailash International", label: "Company Name", description: "Company display name" },
    { key: "company_email", value: "info@bluekailash.com", label: "Contact Email", description: "Main contact email" },
    { key: "company_phone", value: "+977-1-4XXXXXX", label: "Phone Number", description: "Main contact phone" },
    { key: "company_address", value: "Kathmandu, Nepal", label: "Address", description: "Company address" },
    { key: "currency", value: "USD", label: "Currency", description: "Default currency for quotes" },
    { key: "tax_rate", value: "13", label: "Tax Rate (%)", description: "Default tax rate percentage" },
  ];

  for (const setting of defaultSettings) {
    await db.insert(adminSettings).values(setting).onConflictDoNothing();
  }
  console.log(`Seeded ${defaultSettings.length} admin settings`);

  console.log("Database seeding completed!");
}

seed()
  .catch(console.error)
  .finally(() => process.exit());
EOF

echo -e "${YELLOW}Running seed script...${NC}"
npx tsx /tmp/seed.ts

echo -e "${GREEN}Database seeding completed!${NC}"
rm -f /tmp/seed.ts
