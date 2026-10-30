"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function LabologicsHome() {
  const [dragActive, setDragActive] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#FCFCF9] text-zinc-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">L</div>
          Labologics
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-full text-sm">EN | اردو</button>
          <button className="px-5 py-2 bg-black text-white rounded-full text-sm">Upload Report</button>
        </div>
      </header>

      {/* Hero - Interactive like bioinfoxlab */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-xs mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Trained for IDC • Chughtai • Agha Khan
          </div>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
            Pakistan ka apna <br/>
            <span className="text-zinc-400">Lab Report</span> <br/>
            Interpreter
          </h1>
          <p className="mt-4 text-zinc-600 text-lg">
            Upload your IDC report, get Urdu explanation, track family health. 
            Better than ChatGPT — because we understand Pakistani labs.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-black text-white rounded-full">Try Demo Report →</button>
            <button className="px-6 py-3 border rounded-full">How it works</button>
          </div>
        </motion.div>

        {/* Drag Drop Card - Interactive */}
        <motion.div 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
          className={`relative border-2 border-dashed rounded-[24px] p-8 bg-white shadow-xl transition-all duration-300 ${dragActive ? 'border-black scale-105' : 'border-zinc-200'}`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4">📄</div>
            <h3 className="font-semibold">Drop your lab report here</h3>
            <p className="text-sm text-zinc-500 mt-1">PDF, JPG, PNG — IDC, Chughtai supported</p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-50 p-3 rounded-xl"><b>WBC 8.37</b><br/><span className="text-green-600">Normal</span></div>
              <div className="bg-red-50 p-3 rounded-xl"><b>Hb 11.8</b><br/><span className="text-red-600">Low</span></div>
              <div className="bg-zinc-50 p-3 rounded-xl"><b>Plt 250k</b><br/>Normal</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features vs LabSense */}
      <section className="bg-black text-white rounded-[32px] max-w-7xl mx-auto m-6 p-10">
        <h2 className="text-3xl font-bold mb-8">Why Labologics, not ChatGPT or LabSense?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-6 rounded-2xl">
            <h3 className="font-semibold mb-2">🇵🇰 Pakistani Labs</h3>
            <p className="text-sm text-zinc-400">We read IDC gray tables, Chughtai format — LabSense uses WHO generic ranges.</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl">
            <h3 className="font-semibold mb-2">👨‍👩‍👧 Family Vault</h3>
            <p className="text-sm text-zinc-400">Save Ammi, Abba, kids reports. See trends over time. ChatGPT forgets.</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl">
            <h3 className="font-semibold mb-2">🗣️ Urdu Voice</h3>
            <p className="text-sm text-zinc-400">Press play, get result in Urdu voice — for elders who can&apos;t read English.</p>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-zinc-500">
        Educational only • Not medical advice • Built in Lahore
      </footer>
    </div>
  );
}
