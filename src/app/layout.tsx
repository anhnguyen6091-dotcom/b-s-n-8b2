import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme";
import { PerformanceProvider } from "@/lib/performance";
import { SmoothScroll } from "@/components/core/smooth-scroll";
import { DirectionPreloader } from "@/components/core/direction-preloader";
import { ExperienceControls } from "@/components/core/experience-controls";

// =============================================================================
// Site Configuration
// =============================================================================

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motion-primitives.dev";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EduMotion - Cổng Tra Cứu Lớp Học & Thời Khóa Biểu",
    template: "%s | EduMotion School Portal",
  },
  description:
    "Cổng thông tin trường học trực quan: tra cứu danh sách lớp học, giáo viên chủ nhiệm và thời khóa biểu chi tiết từ thứ Hai đến thứ Bảy với trải nghiệm hiệu ứng mượt mà và giao diện kính mờ hiện đại.",
  keywords: [
    "thoi-khoa-bieu",
    "giao-vien-chu-nhiem",
    "truong-hoc",
    "tra-cuu-lop",
    "lop-hoc",
    "education-portal",
    "nextjs",
    "framer-motion",
    "glassmorphism",
  ],
  authors: [{ name: "itsjwill" }],
  creator: "itsjwill",
  publisher: "Motion Primitives",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Motion Primitives - Premium Animation Components for React",
    description:
      "95+ animation components. 4 design directions. Zero compromise. Build award-winning websites.",
    siteName: "Motion Primitives",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Motion Primitives - 4 Design Directions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motion Primitives - Premium Animation Components",
    description:
      "95+ animation components. 4 design directions. Build award-winning websites.",
    images: ["/og-image.png"],
    creator: "@itsjwill",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

// =============================================================================
// Viewport
// =============================================================================

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${fontVariables}`}
      data-direction="freestyle"
      suppressHydrationWarning
    >
      <head>
        {/* Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <ThemeProvider defaultDirection="freestyle" defaultMode="dark">
          <PerformanceProvider>
            <div className="mp-aurora" aria-hidden />
            <DirectionPreloader>
              {children}
            </DirectionPreloader>
            <ExperienceControls />
            <SmoothScroll />
          </PerformanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
