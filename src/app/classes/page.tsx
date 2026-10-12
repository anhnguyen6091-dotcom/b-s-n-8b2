"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SiteNav } from "@/components/core/site-nav";
import { SCHOOL_CLASSES, SCHOOL_INFO, SchoolClass } from "@/data/school-data";
import { useTheme, DIRECTION_META } from "@/lib/theme";

export default function ClassesPage() {
  const { direction } = useTheme();
  const meta = DIRECTION_META[direction];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<number | "all">("all");
  const [selectedTrack, setSelectedTrack] = useState<string | "all">("all");

  const filteredClasses = useMemo(() => {
    return SCHOOL_CLASSES.filter((c) => {
      // Lọc theo khối
      if (selectedGrade !== "all" && c.grade !== selectedGrade) {
        return false;
      }
      // Lọc theo ban
      if (selectedTrack !== "all" && c.academicTrack !== selectedTrack) {
        return false;
      }
      // Lọc theo từ khóa tìm kiếm (tên lớp, tên GVCN, môn học GVCN, phòng học)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(query);
        const matchTeacher = c.teacher.name.toLowerCase().includes(query);
        const matchSubject = c.teacher.subject.toLowerCase().includes(query);
        const matchRoom = c.room.toLowerCase().includes(query);
        return matchName || matchTeacher || matchSubject || matchRoom;
      }
      return true;
    });
  }, [searchQuery, selectedGrade, selectedTrack]);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <SiteNav />

      {/* Hero Header Section */}
      <section className="relative px-4 pt-12 pb-8 md:px-6 md:pt-16 max-w-6xl mx-auto">
        <div className="flex flex-col items-start gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.accent }} />
            <span>Niên khóa {SCHOOL_INFO.academicYear} • {SCHOOL_INFO.semester}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-heading font-extrabold tracking-tight md:text-5xl"
          >
            Danh Sách Lớp Học
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed"
          >
            Tra cứu nhanh thông tin giáo viên chủ nhiệm và thời khóa biểu từ thứ Hai đến thứ Bảy cho tất cả các khối lớp 10, 11 và 12.
          </motion.p>
        </div>

        {/* Thanh tìm kiếm & bộ lọc */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-2xl border border-border/60 bg-surface/40 p-4 backdrop-blur-xl shadow-lg md:p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground select-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Tìm lớp (10A1, 11...), giáo viên chủ nhiệm, phòng học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background/80 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs bg-muted px-1.5 py-0.5 rounded"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter buttons Khối */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Khối:</span>
              {(["all", 10, 11, 12] as const).map((grade) => {
                const isActive = selectedGrade === grade;
                return (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-foreground text-background shadow-md"
                        : "border border-border/70 bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {grade === "all" ? "Tất cả khối" : `Khối ${grade}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ban đào tạo filter tags */}
          <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Định hướng ban:</span>
            {[
              { id: "all", label: "Tất cả ban" },
              { id: "Khoa học Tự nhiên", label: "Tự nhiên" },
              { id: "Khoa học Xã hội", label: "Xã hội" },
              { id: "Song ngữ - Quốc tế", label: "Song ngữ / QT" },
            ].map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`rounded-lg px-2.5 py-1 transition-colors ${
                  selectedTrack === track.id
                    ? "bg-primary/20 text-foreground border border-primary/40"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {track.label}
              </button>
            ))}

            <div className="ml-auto text-xs text-muted-foreground">
              Tìm thấy <strong className="text-foreground">{filteredClasses.length}</strong> lớp học
            </div>
          </div>
        </motion.div>
      </section>

      {/* Grid danh sách lớp học */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredClasses.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredClasses.map((cls, index) => (
                <ClassCard key={cls.id} item={cls} index={index} accent={meta.accent} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-surface/20 p-12 text-center"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold">Không tìm thấy lớp học phù hợp</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút đặt lại bộ lọc bên dưới.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGrade("all");
                  setSelectedTrack("all");
                }}
                className="mt-4 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors"
              >
                Đặt lại bộ lọc tìm kiếm
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Ghi chú chân trang */}
      <section className="px-4 md:px-6 max-w-6xl mx-auto mt-12">
        <div className="rounded-xl border border-border/40 bg-surface/20 p-4 text-center text-xs text-muted-foreground">
          ℹ️ {SCHOOL_INFO.disclaimer}
        </div>
      </section>
    </main>
  );
}

function ClassCard({ item, index, accent }: { item: SchoolClass; index: number; accent: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-surface/40 p-5 backdrop-blur-xl shadow-md transition-shadow hover:shadow-xl hover:border-primary/40 overflow-hidden"
    >
      {/* Decorative top glow border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div>
        {/* Header card: Tên lớp + Khối + Badge ban */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black font-heading tracking-tight text-foreground group-hover:text-primary transition-colors">
                Lớp {item.name}
              </span>
              <span className="rounded-md border border-border/80 bg-background/60 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                Khối {item.grade}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.academicTrack} • {item.room}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1 rounded-full bg-surface border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground font-medium">
            <span>👥</span>
            <span>{item.studentCount} HS</span>
          </div>
        </div>

        {/* Thông tin Giáo viên chủ nhiệm */}
        <div className="mt-5 rounded-xl border border-border/50 bg-background/40 p-3.5 backdrop-blur-md">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2 flex items-center justify-between">
            <span>Giáo viên chủ nhiệm</span>
            <span className="text-[10px] text-primary/80 lowercase">GVCN</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr ${item.teacher.avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-sm`}
            >
              {item.teacher.name.split(" ").slice(-1)[0][0]}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-foreground truncate">
                {item.teacher.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                Môn: <span className="text-foreground/90 font-medium">{item.teacher.subject}</span>
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] italic text-muted-foreground line-clamp-1 border-t border-border/30 pt-2">
            &ldquo;{item.teacher.message}&rdquo;
          </p>
        </div>

        {/* Thông tin tóm tắt lịch học */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Học Thứ Hai → Thứ Bảy</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/80">
            5 tiết / buổi
          </span>
        </div>
      </div>

      {/* Button xem chi tiết thời khóa biểu */}
      <div className="mt-5 pt-3 border-t border-border/40">
        <Link
          href={`/classes/${item.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-foreground text-background py-2.5 text-xs font-bold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <span>Xem Thời Khóa Biểu & Chi Tiết</span>
          <span>→</span>
        </Link>
      </div>
    </motion.div>
  );
}
