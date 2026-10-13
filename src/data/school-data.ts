export interface Student {
  id: string;
  name: string;
  gender: "Nam" | "Nữ";
  birthDate: string;
}

export interface PeriodLesson {
  period: number; // 1 -> 5
  time: string;   // Ví dụ: 07:15 - 08:00
  subject: string;
  teacher: string;
  room?: string;
  type: "stem" | "humanities" | "language" | "pe" | "activity";
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export interface DaySchedule {
  dayId: DayOfWeek;
  dayName: string; // "Thứ Hai", "Thứ Ba", ...
  shortName: string; // "T2", "T3", ...
  lessons: PeriodLesson[];
}

export interface HomeroomTeacher {
  name: string;
  subject: string;
  email: string;
  phone: string;
  officeHours: string;
  message: string;
  avatarColor: string;
}

export interface SchoolClass {
  id: string; // slug, e.g. "6b1"
  name: string; // "6B1"
  grade: 6 | 7 | 8 | 9;
  academicTrack: string;
  room: string;
  studentCount: number;
  classPresident: string;
  secretary: string;
  teacher: HomeroomTeacher;
  schedule: DaySchedule[];
  students: Student[];
}

export const PERIOD_TIMES: { [key: number]: string } = {
  1: "07:00 - 07:45",
  2: "07:50 - 08:35",
  3: "08:50 - 09:35",
  4: "09:40 - 10:25",
  5: "10:30 - 11:15",
};

export const SUBJECT_TYPE_COLORS: Record<PeriodLesson["type"], { bg: string; text: string; border: string; label: string }> = {
  stem: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    label: "Khoa học Tự nhiên",
  },
  humanities: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: "Khoa học Xã hội",
  },
  language: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    label: "Ngoại ngữ",
  },
  pe: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    label: "Thể chất",
  },
  activity: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    label: "Hoạt động GD",
  },
};

export const SCHOOL_INFO = {
  name: "Trường THCS Thường Thạnh",
  academicYear: "2025 - 2026",
  semester: "Học kỳ I",
  disclaimer: "Dữ liệu mẫu phục vụ mục đích kiểm thử và trình diễn chức năng.",
  address: "Phường Thường Thạnh, Quận Cái Răng, TP. Cần Thơ",
  email: "thcsthuongthanh@cantho.edu.vn",
  phone: "0292.xxx.xxxx (Dữ liệu mẫu)",
  schoolWeek: [
    { id: "monday" as DayOfWeek, name: "Thứ Hai", short: "T2" },
    { id: "tuesday" as DayOfWeek, name: "Thứ Ba", short: "T3" },
    { id: "wednesday" as DayOfWeek, name: "Thứ Tư", short: "T4" },
    { id: "thursday" as DayOfWeek, name: "Thứ Năm", short: "T5" },
    { id: "friday" as DayOfWeek, name: "Thứ Sáu", short: "T6" },
    { id: "saturday" as DayOfWeek, name: "Thứ Bảy", short: "T7" },
  ],
};

const generateMockStudents = (count: number, className: string): Student[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${className.toLowerCase()}-${i + 1}`,
    name: `Học sinh mẫu ${i + 1}`,
    gender: i % 2 === 0 ? "Nam" : "Nữ",
    birthDate: `01/01/201${12 - parseInt(className[0])}`,
  }));
};

const generateMockSchedule = (): DaySchedule[] => {
  const days: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const subjects = [
    { name: "Toán", type: "stem" as const },
    { name: "Ngữ văn", type: "humanities" as const },
    { name: "Tiếng Anh", type: "language" as const },
    { name: "Vật lí", type: "stem" as const },
    { name: "Hóa học", type: "stem" as const },
    { name: "Sinh học", type: "stem" as const },
    { name: "Lịch sử", type: "humanities" as const },
    { name: "Địa lí", type: "humanities" as const },
    { name: "GDCD", type: "humanities" as const },
    { name: "Tin học", type: "stem" as const },
    { name: "Công nghệ", type: "stem" as const },
    { name: "Thể dục", type: "pe" as const },
  ];

  return days.map((day) => ({
    dayId: day,
    dayName: day === "monday" ? "Thứ Hai" : day === "tuesday" ? "Thứ Ba" : day === "wednesday" ? "Thứ Tư" : day === "thursday" ? "Thứ Năm" : day === "friday" ? "Thứ Sáu" : "Thứ Bảy",
    shortName: day === "monday" ? "T2" : day === "tuesday" ? "T3" : day === "wednesday" ? "T4" : day === "thursday" ? "T5" : day === "friday" ? "T6" : "T7",
    lessons: day === "monday" 
      ? [
          { period: 1, time: PERIOD_TIMES[1], subject: "Chào cờ", teacher: "BGH", room: "Sân trường", type: "activity" as const },
          ...Array.from({ length: 4 }, (_, i) => {
            const sub = subjects[Math.floor(Math.random() * subjects.length)];
            return { period: i + 2, time: PERIOD_TIMES[i + 2], subject: sub.name, teacher: "Giáo viên mẫu", type: sub.type };
          })
        ]
      : Array.from({ length: 5 }, (_, i) => {
          const sub = subjects[Math.floor(Math.random() * subjects.length)];
          return { period: i + 1, time: PERIOD_TIMES[i + 1], subject: sub.name, teacher: "Giáo viên mẫu", type: sub.type };
        })
  }));
};

const createClass = (id: string, name: string, grade: 6 | 7 | 8 | 9): SchoolClass => ({
  id,
  name,
  grade,
  academicTrack: "Cơ bản",
  room: `Phòng ${grade}${name.slice(-1)}`,
  studentCount: 40,
  classPresident: "Học sinh mẫu A",
  secretary: "Học sinh mẫu B",
  teacher: {
    name: "Giáo viên mẫu",
    subject: "Chủ nhiệm",
    email: "gv@thuongthanh.edu.vn",
    phone: "0123.456.789",
    officeHours: "Thứ Hai (08:00 - 10:00)",
    message: "Học tập là hạt giống của hạnh phúc.",
    avatarColor: "from-blue-500 to-indigo-600",
  },
  schedule: generateMockSchedule(),
  students: generateMockStudents(40, name),
});

export const SCHOOL_CLASSES: SchoolClass[] = [
  // Khối 6
  ...["6B1", "6B2", "6B3", "6B4", "6B5"].map(n => createClass(n.toLowerCase(), n, 6)),
  // Khối 7
  ...["7B1", "7B2", "7B3", "7B4"].map(n => createClass(n.toLowerCase(), n, 7)),
  // Khối 8
  ...["8B1", "8B2", "8B3", "8B4", "8B5", "8B6"].map(n => createClass(n.toLowerCase(), n, 8)),
  // Khối 9
  ...["9B1", "9B2", "9B3", "9B4", "9B5"].map(n => createClass(n.toLowerCase(), n, 9)),
];

export const getClassById = (id: string) => SCHOOL_CLASSES.find(c => c.id === id);
