import React, { useState } from "react";
import { MenuItem, Menu } from "@/components/ui/navbar-menu";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function Home() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      {/* Navigation Menu */}
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home" />
        <MenuItem setActive={setActive} active={active} item="About" />
        <MenuItem setActive={setActive} active={active} item="Services" />
        <MenuItem setActive={setActive} active={active} item="Contact" />
      </Menu>

      <WavyBackground
        waveWidth={50}
        backgroundFill="black"
        blur={20}
        speed="fast"
        waveOpacity={0.5}
      >
        {/* Main Heading */}
        <div className="flex flex-col items-center justify-center h-1/3">
          <h1 className="text-white text-9xl font-serif font-bold mb-2 z-10">
            spendSmart
          </h1>
          <h2 className="text-gray-300 text-2xl mb-4 z-10">
            make your wallet more happier than ever!
          </h2>

          {/* Buttons Section */}
          <div className="flex space-x-4 gap-5 mt-6 z-10">
            <button className="inline-flex h-12 shadow-black animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              Monthly Expense
            </button>
            <button className="inline-flex h-12 animate-shimmer shadow-black items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              Daily Expense
            </button>
          </div>
        </div>
      </WavyBackground>
    </>
  );
}

