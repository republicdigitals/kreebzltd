import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kreebz — Property, Management & Private Aviation",
    short_name: "Kreebz",
    description:
      "Vetted homes, property management, concierge, and private jet charter in Lagos.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0c0b09",
    theme_color: "#0c0b09",
    icons: [
      {
        src: "/kreebz-logo.png",
        sizes: "506x493",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
