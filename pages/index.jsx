import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-black to-black opacity-70" />

      <div className="absolute inset-0 bg-[url('/chatgpt-selfie.jpg')] bg-cover bg-center opacity-40 z-0" />

      {/* Glowing Animated Eyes */}
      <div className="absolute left-[45%] top-[32%] w-[20px] h-[20px] bg-cyan-300 rounded-full shadow-lg shadow-cyan-300 animate-ping z-10" />
      <div className="absolute left-[53%] top-[32%] w-[20px] h-[20px] bg-cyan-300 rounded-full shadow-lg shadow-cyan-300 animate-ping z-10" />

      <div className="relative z-10 flex flex-col items-center justify-center p-6 min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 text-cyan-300 drop-shadow-neon"
        >
          Welcome to the SOVR Ecosystems
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl text-center text-lg text-cyan-100 mb-10"
        >
          Redefining freedom through code, trust, and real-world value. This is your sovereign operating system. Live, transact, and thrive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-indigo-800/80 to-black/80 p-6 rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 backdrop-blur-lg">
            <CardContent className="flex flex-col gap-4 items-center">
              <a href="/wallet" className="w-full">
                <Button className="w-full bg-cyan-400 text-black hover:bg-cyan-300 text-lg font-semibold rounded-xl shadow-md shadow-cyan-400">
                  Launch Wallet
                </Button>
              </a>
              <a href="/about" className="text-cyan-300 underline hover:text-cyan-100 mt-2">
                Learn More
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <style jsx>{`
        .drop-shadow-neon {
          text-shadow: 0 0 6px #0ff, 0 0 10px #0ff, 0 0 20px #0ff;
        }
      `}</style>
    </div>
  );
}
