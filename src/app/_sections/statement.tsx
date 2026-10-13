"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "@/lib/theme";
import { getMotionVariants } from "@/lib/motion";
import { SectionReveal } from "@/components/scroll/section-reveal";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function StatementSection() {
  const { direction } = useTheme();
  const variants = getMotionVariants(direction);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const stats = [
    { value: 20, suffix: "", label: "Lớp học" },
    { value: 800, suffix: "+", label: "Học sinh" },
    { value: 50, suffix: "+", label: "Giáo viên" },
    { value: 100, suffix: "%", label: "Tận tâm" },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 px-6">
      <SectionReveal type="clip">
      <div className="max-w-5xl mx-auto">
        {/* Statement */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-display-sm font-heading text-center leading-tight mb-20"
        >
          Trường THCS Thường Thạnh - Nơi nuôi dưỡng{" "}
          <span className="text-primary">nhân cách và tri thức</span> cho tương lai.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={variants.container}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={variants.item}
              className="text-center"
            >
              <div className="text-heading-1 font-heading text-primary mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-body-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Direction-aware CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex justify-center"
        >
          <StatementButton direction={direction} />
        </motion.div>
      </div>
      </SectionReveal>
    </section>
  );
}

function StatementButton({ direction }: { direction: string }) {
  switch (direction) {
    case "luxury":
      return (
        <a href="/classes" className="group relative text-sm font-light tracking-[0.25em] uppercase text-foreground/40 hover:text-foreground/80 transition-all duration-1000">
          Xem danh sách lớp
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-px group-hover:w-full transition-all duration-1000 bg-[#C9A84C]" />
        </a>
      );
    case "cyberpunk":
      return (
        <a
          href="/classes"
          className="inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs tracking-wider border border-[#00FFD1]/40 hover:bg-[#00FFD1]/10 transition-colors duration-150"
          style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
        >
          <span className="w-1.5 h-1.5 bg-[#00FFD1]" />
          <span className="text-[#00FFD1]">VIEW_CLASSES</span>
        </a>
      );
    case "kinetic":
      return (
        <motion.a
          href="/classes"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg inline-block"
          style={{ background: "linear-gradient(135deg, #7C3AED, #7C3AEDCC)", boxShadow: "0 8px 25px #7C3AED40" }}
        >
          Xem danh sách lớp
        </motion.a>
      );
    case "freestyle":
      return (
        <a
          href="/classes"
          className="px-8 py-3 text-sm font-black uppercase border-3 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-black transition-all duration-200 inline-flex items-center gap-2"
          style={{ borderWidth: "3px" }}
        >
          XEM DANH SÁCH LỚP →
        </a>
      );
    default:
      return null;
  }
}
