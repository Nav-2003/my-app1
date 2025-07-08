import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {SocketProvider} from "./lib/SocketContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gradient-to-br h-screen from-gray-900 via-indigo-900 to-purple-900">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-white text-3xl font-semibold text-center border border-white/10 hover:shadow-indigo-500/20 transition-shadow duration-300">
            <span className="bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to Chat Server
            </span>
          </div>
          
            <SocketProvider>
              {children}
            </SocketProvider>
        </div>
      </body>
    </html>
  );
}
