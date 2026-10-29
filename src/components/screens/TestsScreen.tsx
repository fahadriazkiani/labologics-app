"use client";
import React from "react";

export default function TestsScreen() {
  return (
    <div className="h-full overflow-y-auto pb-24 bg-[#f8fafc]">
      <div className="mb-6 px-4 pt-6">
        <h2 className="text-2xl font-bold text-slate-800">Test Recommendations</h2>
        <p className="text-slate-500 text-sm mt-1">Personalized lab testing schedules to monitor and maintain your health.</p>
      </div>

      {/* Routine Screening Section */}
      <div className="px-4 mb-2">
        <h3 className="text-lg font-bold text-teal-700 mb-3 border-b border-teal-100 pb-2">Routine Screening</h3>
      </div>
      
      <div className="grid gap-4 px-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800">Annual Wellness</h4>
            <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">Once a year</span>
          </div>
          <p className="text-slate-500 text-sm mb-4">General health baseline for adults of all ages.</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">CBC</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Lipid Profile</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">CMP (Metabolic Panel)</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">TSH</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800">Bi-Annual Check</h4>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Every 6 months</span>
          </div>
          <p className="text-slate-500 text-sm mb-4">Track volatile vitamins and borderline markers.</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Vitamin D3</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Vitamin B12</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">HbA1c (if borderline)</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800">Quarterly Monitoring</h4>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Every 3 months</span>
          </div>
          <p className="text-slate-500 text-sm mb-4">For actively managing existing chronic conditions.</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">HbA1c (Active Diabetics)</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">LFTs (Medication Monitoring)</span>
          </div>
        </div>
      </div>

      {/* Condition Specific Section */}
      <div className="px-4 mb-2">
        <h3 className="text-lg font-bold text-teal-700 mb-3 border-b border-teal-100 pb-2">Condition-Specific Profiles</h3>
      </div>
      
      <div className="grid gap-4 px-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
          <h4 className="font-bold text-slate-800 mb-1">Diabetic Care Profile</h4>
          <p className="text-slate-500 text-sm mb-4">Crucial for managing blood sugar and preventing organ complications.</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Fasting Blood Sugar</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">HbA1c</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Microalbuminuria</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Serum Creatinine</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
          <h4 className="font-bold text-slate-800 mb-1">Metabolic & Weight Profile</h4>
          <p className="text-slate-500 text-sm mb-4">Evaluates metabolic risks associated with weight gain.</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Fasting Insulin</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Lipid Panel</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">hs-CRP</span>
            <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">Uric Acid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
