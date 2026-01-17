export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: "https://seedbase.example.com/sitemap.xml"
  };
}
