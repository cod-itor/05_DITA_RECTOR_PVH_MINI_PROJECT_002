import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "sileo/styles.css";
import { Toaster } from "sileo";
import Provider from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PurelyStore",
  description:
    "Curated skincare, makeup, and fragrance — a student demo storefront.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-gray-900">
          <Toaster
            position="top-right"
            theme="dark"
            options={{
              fill: "#101014",
              roundness: 999,
              styles: {
                title: "text-white font-semibold",
                description: "text-white/80",
              },
            }}
          />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
