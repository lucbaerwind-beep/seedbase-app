import { prisma } from "@/lib/db";

export default async function sitemap() {
  const [suppliers, varieties] = await Promise.all([
    prisma.supplierCompany.findMany({ where: { approved: true }, select: { slug: true, updatedAt: true } }),
    prisma.variety.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } })
  ]);

  const baseUrl = "https://seedbase.example.com";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/suppliers`, lastModified: new Date() },
    { url: `${baseUrl}/varieties`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/imprint`, lastModified: new Date() },
    ...suppliers.map((supplier) => ({
      url: `${baseUrl}/suppliers/${supplier.slug}`,
      lastModified: supplier.updatedAt
    })),
    ...varieties.map((variety) => ({
      url: `${baseUrl}/varieties/${variety.slug}`,
      lastModified: variety.updatedAt
    }))
  ];
}
