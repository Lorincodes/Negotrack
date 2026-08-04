import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
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
      <body className={`${inter.variable} ${jakarta.variable}`}>
        <template data-design-contract dangerouslySetInnerHTML={{ __html: directionContract }} />
        {children}
      </body>
    </html>
  );
}
