"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SiteNav } from "@/components/core/site-nav";
import { getClassById, SCHOOL_INFO, SUBJECT_TYPE_COLORS, DayOfWeek } from "@/data/school-data";
import { notFound } from "next/navigation";
import { useTheme, DIRECTION_META } from "@/lib/theme";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClassDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const classData = getClassById(id);
  const { direction } = useTheme();
  const meta = DIRECTION_META[direction];

  const [activeTab, setActiveTab] = useState<"schedule" | "students">("schedule");
  const [scheduleViewMode, setScheduleViewMode] = useState<"day" | "week">("day");
  const [activeDay, setActiveDay] = useState<DayOfWeek>("monday");
  const [studentSearch, setStudentSearch] = useState("");

  if (!classData) {
    notFound();
  }

  const currentDaySchedule = useMemo(() => {
    return classData.schedule.find((s) => s.dayId === activeDay);
  }, [classData, activeDay]);

  const filteredStudents = useMemo(() => {
    return classData.students.filter((s) => 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase())
    );
  }, [classData, studentSearch]);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <SiteNav />

      {/* Hero Section - Class Header */}
      <section className="relative px-4 pt-12 pb-10 md:px-6 md:pt-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/classes"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Quay lại danh sách lớp học</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <span
                className="rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${meta.accent}20`, color: meta.accent, border: `1px solid ${meta.accent}40` }}
              >
                Khối {classData.grade}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">{classData.academicTrack}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-heading font-black tracking-tight md:text-6xl mb-4"
            >
              Lớp {classData.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-6 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span className="text-sm">{classData.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span className="text-sm">{classData.studentCount} Học sinh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span className="text-sm">Sĩ số ổn định</span>
              </div>
            </motion.div>
          </div>

          {/* Tab Selection */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
            <div className="flex p-1 bg-surface/40 border border-border/60 rounded-xl backdrop-blur-xl">
               <button
                 onClick={() => setActiveTab("schedule")}
                 className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "schedule" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}
               >
                 📅 Thời khóa biểu
               </button>
               <button
                 onClick={() => setActiveTab("students")}
                 className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "students" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}
               >
                 👥 Danh sách học sinh
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Teacher Info */}
        <aside className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl border border-border/60 bg-surface/30 p-6 backdrop-blur-2xl shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: meta.accent }} />

            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>👨‍🏫</span>
              <span>Giáo Viên Chủ Nhiệm</span>
            </h2>

            <div className="flex flex-col items-center text-center mb-6">
              <div
                className={`h-24 w-24 rounded-full bg-gradient-to-tr ${classData.teacher.avatarColor} flex items-center justify-center text-3xl font-bold text-white shadow-2xl mb-4 border-4 border-background`}
              >
                {classData.teacher.name.split(" ").slice(-1)[0][0]}
              </div>
              <h3 className="text-xl font-bold">{classData.teacher.name}</h3>
              <p className="text-primary font-medium text-sm">{classData.teacher.subject}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-background/50 p-3 border border-border/40">
                <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Thông điệp lớp</div>
                <p className="italic text-foreground/90">&ldquo;{classData.teacher.message}&rdquo;</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center border border-border/60 text-xs">📧</div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase leading-none mb-1">Email</p>
                    <p className="text-xs truncate font-medium">{classData.teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center border border-border/60 text-xs">📞</div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase leading-none mb-1">Điện thoại</p>
                    <p className="text-xs font-medium">{classData.teacher.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl border border-border/60 bg-surface/30 p-4 md:p-6 backdrop-blur-2xl shadow-xl min-h-[550px]"
          >
            <AnimatePresence mode="wait">
              {activeTab === "schedule" ? (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* View Mode Toggle (Day vs Full Week) */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border/40">
                    <div>
                      <h3 className="text-lg font-bold font-heading">Thời Khóa Biểu Tuần</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Buổi học: Sáng (Tiết 1 đến Tiết 5)</p>
                    </div>

                    <div className="flex items-center gap-2 bg-background/60 p-1 rounded-xl border border-border/60 self-start">
                      <button
                        onClick={() => setScheduleViewMode("day")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${scheduleViewMode === "day" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Xem theo ngày
                      </button>
                      <button
                        onClick={() => setScheduleViewMode("week")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${scheduleViewMode === "week" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Xem cả tuần (Bảng)
                      </button>
                    </div>
                  </div>

                  {scheduleViewMode === "day" ? (
                    <div>
                      {/* Day Selection Tabs */}
                      <div className="flex flex-wrap items-center gap-2 mb-6">
                        {SCHOOL_INFO.schoolWeek.map((day) => {
                          const isActive = activeDay === day.id;
                          return (
                            <button
                              key={day.id}
                              onClick={() => setActiveDay(day.id)}
                              className={`relative rounded-xl px-4 py-2 text-xs md:text-sm font-bold transition-all ${
                                isActive
                                  ? "text-background shadow-lg"
                                  : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
                              }`}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeDayBg"
                                  className="absolute inset-0 rounded-xl z-0"
                                  style={{ backgroundColor: meta.accent }}
                                />
                              )}
                              <span className="relative z-10">{day.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Schedule List for Selected Day */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold border-b border-border/20">
                          <div className="col-span-2">Tiết</div>
                          <div className="col-span-5">Môn học</div>
                          <div className="col-span-5">Giáo viên / Phòng</div>
                        </div>

                        {currentDaySchedule?.lessons.map((lesson, idx) => {
                          const colors = SUBJECT_TYPE_COLORS[lesson.type];
                          const isUnassigned = lesson.subject === "CHƯA CẬP NHẬT";
                          return (
                            <motion.div
                              key={`${activeDay}-${lesson.period}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group grid grid-cols-12 gap-4 items-center rounded-2xl border border-border/40 bg-background/40 p-4 transition-all hover:bg-surface/60 hover:border-border/80"
                            >
                              <div className="col-span-2 flex flex-col">
                                <span className="text-base font-black font-heading text-foreground/80 group-hover:text-foreground">
                                  T{lesson.period}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {lesson.time.split(" - ")[0]}
                                </span>
                              </div>

                              <div className="col-span-5 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-bold ${isUnassigned ? "text-muted-foreground italic" : "text-foreground"}`}>
                                    {lesson.subject}
                                  </span>
                                  {!isUnassigned && (
                                    <span className={`hidden sm:inline-block rounded-md ${colors.bg} ${colors.text} ${colors.border} border px-1.5 py-0.5 text-[9px] font-bold uppercase`}>
                                      {colors.label}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="col-span-5 flex flex-col text-xs">
                                <span className={`font-medium truncate ${isUnassigned ? "text-muted-foreground/70 italic" : "text-foreground/90"}`}>
                                  {lesson.teacher}
                                </span>
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <span className="text-[10px]">📍</span>
                                  {lesson.room || classData.room}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Full Week Table View for Desktop / Overview */
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-b border-border/40 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/50">
                            <th className="p-3">Tiết</th>
                            {SCHOOL_INFO.schoolWeek.map((d) => (
                              <th key={d.id} className="p-3 border-l border-border/30">{d.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                          {[1, 2, 3, 4, 5].map((periodNum) => (
                            <tr key={periodNum} className="hover:bg-surface/30 transition-colors">
                              <td className="p-3 font-mono font-bold text-foreground bg-background/40">
                                <div className="text-sm">Tiết {periodNum}</div>
                                <div className="text-[10px] text-muted-foreground font-normal">
                                  {SCHOOL_INFO.schoolWeek[0].id && classData.schedule[0]?.lessons[periodNum - 1]?.time}
                                </div>
                              </td>
                              {SCHOOL_INFO.schoolWeek.map((day) => {
                                const daySched = classData.schedule.find((s) => s.dayId === day.id);
                                const lesson = daySched?.lessons.find((l) => l.period === periodNum);
                                const isUnassigned = !lesson || lesson.subject === "CHƯA CẬP NHẬT";
                                return (
                                  <td key={day.id} className="p-2 border-l border-border/30 align-top">
                                    <div className={`rounded-xl p-2.5 h-full border ${isUnassigned ? "border-dashed border-border/40 bg-background/20" : "border-border/60 bg-background/60"}`}>
                                      <p className={`font-bold text-xs ${isUnassigned ? "text-muted-foreground/70 italic" : "text-foreground"}`}>
                                        {lesson?.subject || "Chưa cập nhật"}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground mt-1 truncate">
                                        {lesson?.teacher || "Chưa cập nhật"}
                                      </p>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="students"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold font-heading">Danh Sách Học Sinh</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Sĩ số: {classData.studentCount} học sinh</p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">🔍</span>
                      <input
                        type="text"
                        placeholder="Tìm học sinh..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full bg-background/60 border border-border/60 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold border-b border-border/20">
                          <th className="px-4 py-3">STT</th>
                          <th className="px-4 py-3">Mã HS</th>
                          <th className="px-4 py-3">Họ và Tên</th>
                          <th className="px-4 py-3">Giới tính</th>
                          <th className="px-4 py-3">Ngày sinh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student, idx) => (
                            <tr key={student.id} className="hover:bg-surface/40 transition-colors">
                              <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                              <td className="px-4 py-3 font-mono text-xs">{student.id}</td>
                              <td className="px-4 py-3 font-bold">{student.name}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${student.gender === "Nam" ? "bg-blue-500/10 text-blue-400" : "bg-pink-500/10 text-pink-400"}`}>
                                  {student.gender}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{student.birthDate}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground italic">
                              Không tìm thấy học sinh nào phù hợp.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="px-4 md:px-6 max-w-7xl mx-auto mt-12">
        <div className="rounded-xl border border-border/40 bg-surface/20 p-4 text-center text-xs text-muted-foreground">
          ℹ️ {SCHOOL_INFO.disclaimer}
        </div>
      </section>
    </main>
  );
}
