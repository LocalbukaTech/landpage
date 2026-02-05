import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/secure-admin/", "/api/"],
    },
    sitemap: "https://localbuka.com/sitemap.xml",
  };
}
