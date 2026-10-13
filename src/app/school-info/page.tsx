"use client";

import { motion } from "framer-motion";
import { SiteNav } from "@/components/core/site-nav";
import { SCHOOL_INFO, SCHOOL_CLASSES } from "@/data/school-data";
import { useTheme, DIRECTION_META } from "@/lib/theme";

export default function SchoolInfoPage() {
  const { direction } = useTheme();
  const meta = DIRECTION_META[direction];

  const stats = [
    { label: "Tổng số lớp", value: SCHOOL_CLASSES.length, icon: "🏫" },
    { label: "Tổng số học sinh", value: SCHOOL_CLASSES.reduce((acc, curr) => acc + curr.studentCount, 0), icon: "👥" },
    { label: "Năm học", value: SCHOOL_INFO.academicYear, icon: "📅" },
    { label: "Học kỳ", value: SCHOOL_INFO.semester, icon: "📖" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-8 md:px-6 md:pt-16 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.accent }} />
            <span>Chào mừng đến với {SCHOOL_INFO.name}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-heading font-black tracking-tight md:text-6xl max-w-3xl"
          >
            Nơi Khởi Đầu Cho Những Ước Mơ Bay Xa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed"
          >
            Trường THCS Thường Thạnh cam kết mang đến môi trường giáo dục chất lượng, thân thiện và sáng tạo cho mọi học sinh.
          </motion.p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-2xl border border-border/60 bg-surface/40 p-6 backdrop-blur-xl text-center"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-2xl font-bold font-heading">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact & Info Section */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Tầm nhìn & Sứ mệnh</h2>
              <p className="text-muted-foreground leading-relaxed">
                Trường THCS Thường Thạnh không ngừng đổi mới phương pháp giảng dạy, ứng dụng công nghệ vào giáo dục để chuẩn bị cho học sinh những hành trang tốt nhất bước vào tương lai. Chúng tôi tin rằng mỗi học sinh đều có những tiềm năng riêng biệt cần được khơi dậy và phát triển.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Thông tin liên hệ</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-surface border border-border flex items-center justify-center">📍</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Địa chỉ</p>
                    <p className="text-sm">{SCHOOL_INFO.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-surface border border-border flex items-center justify-center">📧</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Email</p>
                    <p className="text-sm">{SCHOOL_INFO.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-surface border border-border flex items-center justify-center">📞</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Điện thoại</p>
                    <p className="text-sm">{SCHOOL_INFO.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-3xl border border-border/60 bg-surface/30 p-8 backdrop-blur-2xl shadow-xl aspect-square flex items-center justify-center relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
             <div className="text-center z-10">
               <div className="text-8xl mb-6">🏫</div>
               <h3 className="text-2xl font-bold mb-2">Thường Thạnh</h3>
               <p className="text-muted-foreground">Kỷ cương - Tình thương - Trách nhiệm</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mt-24">
        <div className="rounded-xl border border-border/40 bg-surface/20 p-4 text-center text-xs text-muted-foreground">
          ℹ️ {SCHOOL_INFO.disclaimer}
        </div>
      </section>
    </main>
  );
}
