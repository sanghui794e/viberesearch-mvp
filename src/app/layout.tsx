import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "리웨이브온 (Rewaveon) - 소상공인 배달앱 수수료 0원 모바일 스마트오더 & 자사몰",
  description: "기기값 0원, 배달앱 수수료 0원! 손님 스마트폰 카메라 QR 하나로 주문/결제 완료. 60계치킨 영월점 실전 검증 완료. 입점 시 30만원 상당 AI 상권분석 리포트 100% 무료 증정!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
