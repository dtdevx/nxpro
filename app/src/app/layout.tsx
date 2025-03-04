"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProjectList from "@/components/Project/ProjectSidebar";
import Link from "next/link";
import { ProjectProvider } from "@/context/ProjectContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-950 px-5 py-4 text-gray-50 antialiased`}
      >
        <div className="mx-auto md:w-3xl">
          <div className="mb-6">
            <Link href="/">NxPro</Link>
          </div>
          <ProjectProvider>
            <div className="gap-8 sm:grid sm:grid-cols-4">
              <div className="">
                <Link
                  href="/"
                  className={`transition-color flex items-center text-xl transition hover:text-emerald-500 ${
                    pathname === "/" ? "text-emerald-500" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mr-2 size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  Dashboard
                </Link>
                <hr className="mt-5 mb-4 text-gray-800" />
                <ProjectList />
              </div>
              <div className="sm:col-span-3">{children}</div>
            </div>
          </ProjectProvider>
        </div>
      </body>
    </html>
  );
}
