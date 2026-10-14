export interface TimetableLesson {
  period: number; // 1 to 5
  time: string;
  subject: string;
  teacher: string;
  room?: string;
  type: "stem" | "humanities" | "language" | "pe" | "activity" | "unassigned";
}

export type DayOfWeekId = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export interface DayTimetable {
  dayId: DayOfWeekId;
  dayName: string;
  shortName: string;
  buoi: string; // "Sáng"
  lessons: TimetableLesson[];
}

export interface ClassTimetable {
  classId: string; // e.g. "6b1"
  className: string; // e.g. "6B1"
  grade: 6 | 7 | 8 | 9;
  schedule: DayTimetable[];
}

export const PERIOD_TIMES_MAP: Record<number, string> = {
  1: "07:00 - 07:45",
  2: "07:50 - 08:35",
  3: "08:50 - 09:35",
  4: "09:40 - 10:25",
  5: "10:30 - 11:15",
};

const DAYS_CONFIG: { id: DayOfWeekId; name: string; short: string }[] = [
  { id: "monday", name: "Thứ Hai", short: "T2" },
  { id: "tuesday", name: "Thứ Ba", short: "T3" },
  { id: "wednesday", name: "Thứ Tư", short: "T4" },
  { id: "thursday", name: "Thứ Năm", short: "T5" },
  { id: "friday", name: "Thứ Sáu", short: "T6" },
  { id: "saturday", name: "Thứ Bảy", short: "T7" },
];

// Helper to generate schedule matching thoi-khoa-bieu.md (defaulting to "CHƯA CẬP NHẬT" as per official guideline)
const generateDefaultSchedule = (className: string): DayTimetable[] => {
  return DAYS_CONFIG.map((day) => ({
    dayId: day.id,
    dayName: day.name,
    shortName: day.short,
    buoi: "Sáng",
    lessons: Array.from({ length: 5 }, (_, i) => ({
      period: i + 1,
      time: PERIOD_TIMES_MAP[i + 1],
      subject: day.id === "monday" && i === 0 ? "Chào cờ" : "CHƯA CẬP NHẬT",
      teacher: day.id === "monday" && i === 0 ? "BGH / Đội TNTP" : "Chưa cập nhật",
      room: `Phòng ${className}`,
      type: day.id === "monday" && i === 0 ? ("activity" as const) : ("unassigned" as const),
    })),
  }));
};

const CLASS_LIST_DEF: { name: string; grade: 6 | 7 | 8 | 9 }[] = [
  // Khối 6 (5 lớp)
  { name: "6B1", grade: 6 },
  { name: "6B2", grade: 6 },
  { name: "6B3", grade: 6 },
  { name: "6B4", grade: 6 },
  { name: "6B5", grade: 6 },
  // Khối 7 (4 lớp)
  { name: "7B1", grade: 7 },
  { name: "7B2", grade: 7 },
  { name: "7B3", grade: 7 },
  { name: "7B4", grade: 7 },
  // Khối 8 (6 lớp)
  { name: "8B1", grade: 8 },
  { name: "8B2", grade: 8 },
  { name: "8B3", grade: 8 },
  { name: "8B4", grade: 8 },
  { name: "8B5", grade: 8 },
  { name: "8B6", grade: 8 },
  // Khối 9 (5 lớp)
  { name: "9B1", grade: 9 },
  { name: "9B2", grade: 9 },
  { name: "9B3", grade: 9 },
  { name: "9B4", grade: 9 },
  { name: "9B5", grade: 9 },
];

export const OFFICIAL_TIMETABLES: ClassTimetable[] = CLASS_LIST_DEF.map((cls) => ({
  classId: cls.name.toLowerCase(),
  className: cls.name,
  grade: cls.grade,
  schedule: generateDefaultSchedule(cls.name),
}));

export const getTimetableByClassId = (id: string): ClassTimetable | undefined => {
  return OFFICIAL_TIMETABLES.find((t) => t.classId === id.toLowerCase());
};
