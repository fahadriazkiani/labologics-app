"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function LabologicsHome() {
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setIsAnalyzing(true);
      setResult(null);

      const formData = new FormData();
      formData.append("report", file);

      try {
        const response = await fetch("/api/interpret", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setResult(data.interpretation || data.error);
      } catch (error) {
        setResult("Error connecting to the analysis server.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-zinc-900">
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
            Upload your IDC report, get an explanation, and track family health.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-[24px] p-8 bg-white shadow-xl transition-all duration-300 ${dragActive ? 'border-black scale-105' : 'border-zinc-200'}`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4">
                {isAnalyzing ? "⏳" : "📄"}
              </div>
              <h3 className="font-semibold">
                {isAnalyzing ? "Analyzing Biomarkers..." : "Drop your lab report here"}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">PDF, JPG, PNG — Max 5MB</p>
            </div>
          </motion.div>

          {result && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-3">Interpretation</h3>
              <div className="text-sm whitespace-pre-wrap leading-relaxed text-zinc-700">{result}</div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
