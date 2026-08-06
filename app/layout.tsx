import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Sometype_Mono } from "next/font/google";
import "./globals.css";

/**
 * `viewport-fit=cover` is what makes `env(safe-area-inset-*)` resolve to real values.
 * Without it the floating header sits under the Dynamic Island on notched iPhones.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Reading, navigation and controls. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

/** Orientation: hero and section headings at 700, card headings at 600. */
const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

/** Small interface labels, timestamps and product-preview captions only. */
const sometypeMono = Sometype_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://negotrack.com"),
  title: "NegoTrack",
  description: "Understand what is holding your business back.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

const directionContract = `<!--
THESIS: NegoTrack turns scattered digital signals into a visible route forward; it refuses the generic centred SaaS hero and decorative AI branding.
OWN-WORLD: Daylight white, midnight navy type, mint and teal operative signals, blue and purple analytic accents, hairline dividers, and soft product canvases.
STORY: Understand the constraint, see signals become priorities, explore honest product previews, then join the private beta.
FIRST VIEWPORT: A split hero pairs decisive copy with a fully coded overview console; the waitlist action remains above the fold and the launch-status strip grounds the promise.
FORM: Reference-led product narrative, first of one approved composition, seed key reference-negotrack-feedhive.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} ${sometypeMono.variable}`}>
        <template data-design-contract dangerouslySetInnerHTML={{ __html: directionContract }} />
        {children}
      </body>
    </html>
  );
}
