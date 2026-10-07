import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COPIES = Number(process.env.SEED_COPIES ?? 3);

interface SeedProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
}

const items: SeedProduct[] = [
  {
    id: 1,
    title: "Men's Cotton Slim Fit T-Shirt",
    price: 19.99,
    description:
      "Comfortable cotton slim fit t-shirt designed for everyday wear.",
    category: "men's clothing",
    rating: { rate: 4.2, count: 120 },
    image: "/images/mens-cotton-slim-fit-tshirt.jpg",
  },
  {
    id: 2,
    title: "Men's Casual Jacket",
    price: 59.99,
    description:
      "A lightweight casual jacket suitable for everyday outdoor use.",
    category: "men's clothing",
    rating: { rate: 4.5, count: 98 },
    image: "/images/mens-casual-jacket.jpg",
  },
  {
    id: 3,
    title: "Men's Premium Hoodie",
    price: 44.99,
    description:
      "Soft premium hoodie with a modern fit and comfortable fabric.",
    category: "men's clothing",
    rating: { rate: 4.3, count: 156 },
    image: "/images/mens-premium-hoodie.jpg",
  },
  {
    id: 4,
    title: "Men's Denim Jeans",
    price: 49.99,
    description:
      "Classic denim jeans with a comfortable regular fit.",
    category: "men's clothing",
    rating: { rate: 4.4, count: 187 },
    image: "/images/mens-denim-jeans.jpg",
  },
  {
    id: 5,
    title: "Women's Cotton Dress",
    price: 39.99,
    description:
      "Elegant cotton dress designed for casual and everyday occasions.",
    category: "women's clothing",
    rating: { rate: 4.6, count: 214 },
    image: "/images/womens-cotton-dress.jpg",
  },
  {
    id: 6,
    title: "Women's Casual Top",
    price: 24.99,
    description:
      "Comfortable casual top with a clean modern design.",
    category: "women's clothing",
    rating: { rate: 4.1, count: 89 },
    image: "/images/womens-casual-top.jpg",
  },
  {
    id: 7,
    title: "Women's Summer Jacket",
    price: 54.99,
    description:
      "Lightweight summer jacket suitable for casual styling.",
    category: "women's clothing",
    rating: { rate: 4.5, count: 132 },
    image: "/images/womens-summer-jacket.jpg",
  },
  {
    id: 8,
    title: "Women's Running Shoes",
    price: 69.99,
    description:
      "Lightweight running shoes designed for comfort and daily training.",
    category: "women's clothing",
    rating: { rate: 4.7, count: 245 },
    image: "/images/womens-running-shoes.jpg",
  },
  {
    id: 9,
    title: "Gold Plated Necklace",
    price: 89.99,
    description:
      "Elegant gold plated necklace suitable for everyday and special occasions.",
    category: "jewelery",
    rating: { rate: 4.4, count: 76 },
    image: "/images/gold-plated-necklace.jpg",
  },
  {
    id: 10,
    title: "Silver Bracelet",
    price: 39.99,
    description:
      "Minimal silver bracelet with a modern and elegant design.",
    category: "jewelery",
    rating: { rate: 4.3, count: 64 },
    image: "/images/silver-bracelet.jpg",
  },
  {
    id: 11,
    title: "Diamond Style Ring",
    price: 129.99,
    description:
      "Classic ring featuring an elegant diamond-style centerpiece.",
    category: "jewelery",
    rating: { rate: 4.8, count: 118 },
    image: "/images/diamond-style-ring.jpg",
  },
  {
    id: 12,
    title: "Pearl Earrings",
    price: 59.99,
    description:
      "Elegant pearl earrings with a timeless appearance.",
    category: "jewelery",
    rating: { rate: 4.6, count: 91 },
    image: "/images/pearl-earrings.jpg",
  },
  {
    id: 13,
    title: "Premium Smartphone",
    price: 699.99,
    description:
      "Modern smartphone with a high-resolution display and powerful processor.",
    category: "electronics",
    rating: { rate: 4.7, count: 325 },
    image: "/images/premium-smartphone.jpg",
  },
  {
    id: 14,
    title: "Wireless Bluetooth Headphones",
    price: 79.99,
    description:
      "Wireless headphones with clear audio and long battery life.",
    category: "electronics",
    rating: { rate: 4.5, count: 276 },
    image: "/images/wireless-bluetooth-headphones.jpg",
  },
  {
    id: 15,
    title: "Mechanical Gaming Keyboard",
    price: 99.99,
    description:
      "Mechanical keyboard designed for gaming and productive work.",
    category: "electronics",
    rating: { rate: 4.6, count: 198 },
    image: "/images/mechanical-gaming-keyboard.jpg",
  },
  {
    id: 16,
    title: "Wireless Computer Mouse",
    price: 29.99,
    description:
      "Ergonomic wireless mouse suitable for work and gaming.",
    category: "electronics",
    rating: { rate: 4.3, count: 167 },
    image: "/images/wireless-computer-mouse.jpg",
  },
  {
    id: 17,
    title: "Smart Watch",
    price: 149.99,
    description:
      "Smart watch with activity tracking and everyday notifications.",
    category: "electronics",
    rating: { rate: 4.4, count: 231 },
    image: "/images/smart-watch.jpg",
  },
  {
    id: 18,
    title: "Portable Bluetooth Speaker",
    price: 49.99,
    description:
      "Compact Bluetooth speaker with powerful portable sound.",
    category: "electronics",
    rating: { rate: 4.2, count: 145 },
    image: "/images/portable-bluetooth-speaker.jpg",
  },
  {
    id: 19,
    title: "USB-C Fast Charger",
    price: 24.99,
    description:
      "Fast USB-C charger suitable for phones, tablets and other devices.",
    category: "electronics",
    rating: { rate: 4.5, count: 188 },
    image: "/images/usb-c-fast-charger.jpg",
  },
  {
    id: 20,
    title: "Laptop Backpack",
    price: 64.99,
    description:
      "Durable laptop backpack with multiple storage compartments.",
    category: "electronics",
    rating: { rate: 4.6, count: 109 },
    image: "/images/laptop-backpack.jpg",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main() {
  const categoryNames = [
    ...new Set(items.map((item) => item.category)),
  ];

  const categories = new Map<string, number>();

  // --------------------------------------------------
  // 1. Create / update categories
  // --------------------------------------------------

  for (const name of categoryNames) {
    const displayName = name.replace(/\b\w/g, (c) => c.toUpperCase());

    const category = await prisma.category.upsert({
      where: {
        slug: slugify(name),
      },
      update: {
        name: displayName.replace("'S", "'s"),
      },
      create: {
        name: displayName.replace("'S", "'s"),
        slug: slugify(name),
      },
    });

    categories.set(name, category.id);
  }

  // --------------------------------------------------
  // 2. Create / update products
  // --------------------------------------------------

  let index = 0;

  for (let copy = 0; copy < COPIES; copy++) {
    for (const item of items) {
      const baseSlug = slugify(item.title);

      const slug =
        copy === 0
          ? baseSlug
          : `${baseSlug}-edition-${copy + 1}`;

      const title =
        copy === 0
          ? item.title
          : `${item.title} (Edition ${copy + 1})`;

      const price =
        Math.round(
          item.price * (1 + copy * 0.1) * 100,
        ) / 100;

      // IMPORTANT:
      // Use the real JPG image from public/images.
      const imageUrl = item.image;

      const data = {
        title,
        description: item.description,
        price,
        ratingRate: item.rating.rate,
        ratingCount: item.rating.count,
        inStock: index % 7 !== 6,
        isNew: index % 9 === 0,
        createdAt: new Date(
          Date.now() - index * 86_400_000,
        ),
        categoryId: categories.get(item.category)!,
      };

      const product = await prisma.product.upsert({
        where: {
          slug,
        },
        update: data,
        create: {
          slug,
          ...data,
        },
      });

      // ------------------------------------------------
      // Delete old image records
      // ------------------------------------------------

      await prisma.productImage.deleteMany({
        where: {
          productId: product.id,
        },
      });

      // ------------------------------------------------
      // Add new JPG image
      // ------------------------------------------------

      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          alt: `${title} - ${item.category}`,
          position: 0,
        },
      });

      index++;
    }
  }

  console.log(
    `Seeded ${index} products in ${categories.size} categories.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });