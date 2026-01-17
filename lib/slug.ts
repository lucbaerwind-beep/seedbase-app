export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function ensureUniqueSlug(base: string, existing: Set<string>) {
  let slug = slugify(base);
  if (!slug) {
    slug = "item";
  }
  let counter = 1;
  while (existing.has(slug)) {
    counter += 1;
    slug = `${slugify(base)}-${counter}`;
  }
  return slug;
}
