import { HeroSection } from "./_sections/hero";
import { StatementSection } from "./_sections/statement";
import { SiteNav } from "@/components/core/site-nav";

export default function HomePage() {
  return (
    <main className="relative bg-background overflow-hidden min-h-screen">
      <SiteNav />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Access Buttons */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-wrap justify-center gap-6">
        <a 
          href="/school-info" 
          className="group relative px-8 py-4 bg-foreground text-background rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Thông tin trường</span>
        </a>
        <a 
          href="/classes" 
          className="group relative px-8 py-4 border border-border bg-surface/40 backdrop-blur-xl rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 hover:border-primary/50"
        >
          <span className="relative z-10">Thông tin lớp học</span>
        </a>
      </div>
      
      {/* Introduction Statement */}
      <StatementSection />

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-surface/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-lg shadow-lg shadow-primary/20">🎓</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">THCS Thường Thạnh</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Kỷ cương - Tình thương - Trách nhiệm</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center md:text-right max-w-sm">
            © 2026 Trường THCS Thường Thạnh. Hệ thống thông tin học đường hiện đại. 
            <br />
            <span className="italic opacity-70">Dữ liệu mẫu phục vụ mục đích kiểm thử.</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
