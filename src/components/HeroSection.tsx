import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-slate-50 py-24 px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center animate-fade-in">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Understand Your Medical Lab Results in Seconds
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your diagnostic reports and get instant, clinically-grounded insights. We break down complex biomarkers into clear, actionable information.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/interpreter" 
            className="bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            Upload Lab Report
          </Link>
          <Link 
            href="/about" 
            className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
