import { PrismaClient } from "@prisma/client";
import { ensureUniqueSlug, slugify } from "../lib/slug";

const prisma = new PrismaClient();

async function main() {
  await prisma.inquiry.deleteMany();
  await prisma.variety.deleteMany();
  await prisma.supplierCompany.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.certification.deleteMany();

  const certifications = ["Organic", "GAP", "ISO 22000", "Seed Health", "GSPP"].map((name) => ({
    name,
    slug: slugify(name)
  }));

  await prisma.certification.createMany({ data: certifications });

  const certificationRecords = await prisma.certification.findMany();

  const admin = await prisma.user.create({
    data: {
      email: "admin@seedbase.example.com",
      passwordHash: "$2a$10$q.ToLTlnrPdG2xt1gNaxku6I5MRzeZk5o6/ZxaJDph9Rud6sN81FC",
      role: "ADMIN"
    }
  });

  const suppliersData = [
    {
      name: "GreenSprout Genetics",
      country: "Netherlands",
      description: "Specialists in greenhouse tomatoes and sweet peppers for high-tech systems.",
      cropsFocus: ["Tomato", "Pepper", "Eggplant"],
      certifications: ["GAP", "Seed Health"]
    },
    {
      name: "Nordic Seed Alliance",
      country: "Sweden",
      description: "Cold-tolerant varieties bred for Northern Europe and short growing seasons.",
      cropsFocus: ["Cabbage", "Onion", "Carrot"],
      certifications: ["ISO 22000"]
    },
    {
      name: "Mediterraneo Seeds",
      country: "Italy",
      description: "Mediterranean-adapted varieties with strong flavor profiles and shelf life.",
      cropsFocus: ["Tomato", "Zucchini", "Lettuce"],
      certifications: ["Organic"]
    },
    {
      name: "AgriNova Seed Co.",
      country: "USA",
      description: "Large-scale open field varieties for processors and fresh markets.",
      cropsFocus: ["Corn", "Pepper", "Tomato"],
      certifications: ["GSPP"]
    },
    {
      name: "TropiGrow Seeds",
      country: "Kenya",
      description: "Heat-tolerant hybrids for tropical and subtropical regions.",
      cropsFocus: ["Cucumber", "Okra", "Tomato"],
      certifications: ["GAP"]
    },
    {
      name: "Andes Seed Innovations",
      country: "Peru",
      description: "Resilient varieties for high-altitude cultivation and export growers.",
      cropsFocus: ["Cabbage", "Carrot", "Lettuce"],
      certifications: ["Seed Health"]
    },
    {
      name: "Sunrise Hybrid Labs",
      country: "India",
      description: "Hybrid vegetable seeds for diversified smallholders and commercial farms.",
      cropsFocus: ["Okra", "Onion", "Pepper"],
      certifications: ["ISO 22000"]
    },
    {
      name: "Prairie Seed Partners",
      country: "Canada",
      description: "Reliable varieties with strong disease resistance for temperate climates.",
      cropsFocus: ["Carrot", "Onion", "Cabbage"],
      certifications: ["GAP"]
    },
    {
      name: "Aurora Seed Collective",
      country: "Germany",
      description: "Premium organic seed varieties with robust germination performance.",
      cropsFocus: ["Lettuce", "Spinach", "Tomato"],
      certifications: ["Organic", "GAP"]
    },
    {
      name: "Pacific Harvest Seeds",
      country: "Japan",
      description: "High-performing varieties for precision agriculture and smart farming.",
      cropsFocus: ["Cucumber", "Tomato", "Pepper"],
      certifications: ["ISO 22000", "Seed Health"]
    },
    {
      name: "Atlas Seed Group",
      country: "Morocco",
      description: "Drought-tolerant varieties for North African and Middle Eastern markets.",
      cropsFocus: ["Tomato", "Onion", "Pepper"],
      certifications: ["GAP"]
    },
    {
      name: "Coastal Seedworks",
      country: "Spain",
      description: "Varieties optimized for coastal climates and extended shelf life.",
      cropsFocus: ["Lettuce", "Cucumber", "Tomato"],
      certifications: ["GSPP"]
    }
  ];

  const supplierSlugs = new Set<string>();
  const suppliers = [];

  for (const supplier of suppliersData) {
    const slug = ensureUniqueSlug(supplier.name, supplierSlugs);
    supplierSlugs.add(slug);
    const user = await prisma.user.create({
      data: {
        email: `${slug}@seedbase.example.com`,
        passwordHash: admin.passwordHash,
        role: "SUPPLIER"
      }
    });

    const certificationLinks = certificationRecords.filter((cert) =>
      supplier.certifications.includes(cert.name)
    );

    const createdSupplier = await prisma.supplierCompany.create({
      data: {
        slug,
        name: supplier.name,
        country: supplier.country,
        description: supplier.description,
        cropsFocus: supplier.cropsFocus,
        certifications: {
          connect: certificationLinks.map((cert) => ({ id: cert.id }))
        },
        featured: suppliers.length < 3,
        approved: true,
        ownerId: user.id
      }
    });
    suppliers.push(createdSupplier);
  }

  const tags = [
    "F1 Hybrid",
    "High Yield",
    "Disease Resistant",
    "Heat Tolerant",
    "Organic Suitable"
  ];

  for (const tag of tags) {
    await prisma.tag.create({ data: { name: tag, slug: slugify(tag) } });
  }

  const tagRecords = await prisma.tag.findMany();

  const varieties = [
    { name: "Ruby Crest", crop: "Tomato", category: "Salad", type: "HYBRID" },
    { name: "Crimson Star", crop: "Tomato", category: "Roma", type: "HYBRID" },
    { name: "Solar Gem", crop: "Tomato", category: "Beefsteak", type: "OPEN_POLLINATED" },
    { name: "Emerald Crunch", crop: "Cucumber", category: "Slicer", type: "HYBRID" },
    { name: "Field Shield", crop: "Cucumber", category: "Pickling", type: "OPEN_POLLINATED" },
    { name: "Sunrise Pepper", crop: "Pepper", category: "Bell", type: "HYBRID" },
    { name: "Aurora Sweet", crop: "Pepper", category: "Snack", type: "OPEN_POLLINATED" },
    { name: "Polar Crisp", crop: "Lettuce", category: "Butterhead", type: "HYBRID" },
    { name: "Green Silk", crop: "Lettuce", category: "Romaine", type: "OPEN_POLLINATED" },
    { name: "Atlas Shield", crop: "Cabbage", category: "Green", type: "HYBRID" },
    { name: "Nordic Compact", crop: "Cabbage", category: "Savoy", type: "OPEN_POLLINATED" },
    { name: "Golden Root", crop: "Carrot", category: "Nantes", type: "HYBRID" },
    { name: "Amber Tap", crop: "Carrot", category: "Imperator", type: "OPEN_POLLINATED" },
    { name: "Silver Bulb", crop: "Onion", category: "Storage", type: "HYBRID" },
    { name: "Harvest Pearl", crop: "Onion", category: "Sweet", type: "OPEN_POLLINATED" },
    { name: "Tropic Shield", crop: "Okra", category: "Green", type: "HYBRID" },
    { name: "Summit Spin", crop: "Spinach", category: "Baby Leaf", type: "OPEN_POLLINATED" },
    { name: "Coastal Crisp", crop: "Lettuce", category: "Iceberg", type: "HYBRID" },
    { name: "Boreal Snap", crop: "Cucumber", category: "Mini", type: "HYBRID" },
    { name: "Sunset Glow", crop: "Pepper", category: "Hot", type: "OPEN_POLLINATED" },
    { name: "Verdant Prime", crop: "Tomato", category: "Cluster", type: "HYBRID" },
    { name: "Marina Leaf", crop: "Lettuce", category: "Leaf", type: "OPEN_POLLINATED" },
    { name: "Desert King", crop: "Tomato", category: "Plum", type: "HYBRID" },
    { name: "Jade Hill", crop: "Cabbage", category: "Red", type: "OPEN_POLLINATED" },
    { name: "Sunrise Gold", crop: "Pepper", category: "Bell", type: "HYBRID" },
    { name: "Highland Row", crop: "Carrot", category: "Chantenay", type: "HYBRID" },
    { name: "Frost Guardian", crop: "Onion", category: "Storage", type: "HYBRID" },
    { name: "Pacific Wave", crop: "Cucumber", category: "Slicer", type: "OPEN_POLLINATED" },
    { name: "Orion Crisp", crop: "Lettuce", category: "Romaine", type: "HYBRID" },
    { name: "Nova Ruby", crop: "Tomato", category: "Cherry", type: "HYBRID" },
    { name: "Solaris", crop: "Tomato", category: "Salad", type: "OPEN_POLLINATED" },
    { name: "Emerald Flame", crop: "Pepper", category: "Hot", type: "HYBRID" },
    { name: "Atlas Top", crop: "Cabbage", category: "Green", type: "OPEN_POLLINATED" },
    { name: "Silver Mist", crop: "Onion", category: "Sweet", type: "HYBRID" },
    { name: "Ocean Pearl", crop: "Cucumber", category: "Pickling", type: "HYBRID" },
    { name: "Prairie Gold", crop: "Carrot", category: "Nantes", type: "OPEN_POLLINATED" },
    { name: "Velvet Leaf", crop: "Spinach", category: "Baby Leaf", type: "HYBRID" },
    { name: "Amber Crest", crop: "Tomato", category: "Beefsteak", type: "HYBRID" },
    { name: "Crimson Vale", crop: "Pepper", category: "Bell", type: "OPEN_POLLINATED" },
    { name: "Greenway", crop: "Lettuce", category: "Butterhead", type: "HYBRID" }
  ];

  const traitSets = [
    ["F1 Hybrid", "High Yield", "Disease Resistant"],
    ["Heat Tolerant", "High Yield"],
    ["Organic Suitable", "Disease Resistant"],
    ["F1 Hybrid", "Heat Tolerant"],
    ["High Yield", "Disease Resistant"]
  ];

  const varietySlugSet = new Set<string>();
  for (let index = 0; index < varieties.length; index += 1) {
    const variety = varieties[index];
    const supplier = suppliers[index % suppliers.length];
    const slug = ensureUniqueSlug(variety.name, varietySlugSet);
    varietySlugSet.add(slug);
    const traits = traitSets[index % traitSets.length];
    const tagsToConnect = tagRecords.filter((tag) => traits.includes(tag.name));

    await prisma.variety.create({
      data: {
        name: variety.name,
        slug,
        crop: variety.crop,
        category: variety.category,
        type: variety.type as "HYBRID" | "OPEN_POLLINATED",
        growingCycle: "90-120 days",
        traits,
        description: `${variety.name} delivers strong performance with consistent yields and adaptable field results.`,
        markets: ["EU", "North America", "MEA"],
        availability: "Year-round",
        minOrderNote: "Minimum order 5,000 seeds",
        imageUrls: [],
        status: "PUBLISHED",
        supplierId: supplier.id,
        tags: {
          connect: tagsToConnect.map((tag) => ({ id: tag.id }))
        }
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
