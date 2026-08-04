import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NegoTrack",
    short_name: "NegoTrack",
    description: "Understand. Improve. Grow.",
    start_url: "/en-GB",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#13c98a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
