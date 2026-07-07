import React from "react";
import { ArrowLeft, Clock } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  navigateTo: (path: string) => void;
}

export default function PlaceholderPage({ title, navigateTo }: PlaceholderPageProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-28 pb-16 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-[#00f5ff] flex items-center justify-center mx-auto border border-cyan-500/20">
          <Clock className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-gray-400 text-sm">
            This section is currently being updated to align with the latest regulations. Please check back shortly.
          </p>
        </div>

        <button
          onClick={() => navigateTo("/")}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#00f5ff] text-black text-xs font-bold uppercase rounded-lg hover:bg-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
}
