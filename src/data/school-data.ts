import { OFFICIAL_TIMETABLES, ClassTimetable, DayOfWeekId, TimetableLesson } from "./timetable";

export interface Student {
  id: string;
  name: string;
  gender: "Nam" | "Nữ";
  birthDate: string;
}

export type PeriodLesson = TimetableLesson;
export type DayOfWeek = DayOfWeekId;
export type DaySchedule = {
  dayId: DayOfWeek;
  dayName: string;
  shortName: string;
  lessons: PeriodLesson[];
};

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

export const PERIOD_TIMES = {
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
  unassigned: {
    bg: "bg-surface text-muted-foreground",
    text: "text-muted-foreground",
    border: "border-border/60",
    label: "Chưa cập nhật",
  },
};

export const SCHOOL_INFO = {
  name: "Trường THCS Thường Thạnh",
  academicYear: "2025 - 2026",
  semester: "Học kỳ I",
  disclaimer: "Dữ liệu thời khóa biểu được đồng bộ từ nguồn chính thức của nhà trường. Các tiết chưa có thông tin hiển thị trạng thái Chưa cập nhật.",
  address: "Phường Thường Thạnh, Quận Cái Răng, TP. Cần Thơ",
  email: "thcsthuongthanh@cantho.edu.vn",
  phone: "0292.xxx.xxxx",
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
    name: `Học sinh ${className} - ${i + 1}`,
    gender: i % 2 === 0 ? "Nam" : "Nữ",
    birthDate: `15/05/201${12 - parseInt(className[0])}`,
  }));
};

export const SCHOOL_CLASSES: SchoolClass[] = OFFICIAL_TIMETABLES.map((t) => {
  const grade = t.grade;
  const name = t.className;
  return {
    id: t.classId,
    name: name,
    grade: grade,
    academicTrack: "Chương trình GDPT 2018",
    room: `Phòng học ${name}`,
    studentCount: 40,
    classPresident: `Ban cán sự lớp ${name}`,
    secretary: `Chi đoàn lớp ${name}`,
    teacher: {
      name: `GVCN Lớp ${name}`,
      subject: "Chủ nhiệm lớp",
      email: `${name.toLowerCase()}@thuongthanh.edu.vn`,
      phone: "Đang cập nhật",
      officeHours: "Thứ Hai - Thứ Sáu (Giờ hành chính)",
      message: "Chúc các em học sinh một tuần học tập hiệu quả và tràn đầy năng lượng!",
      avatarColor: "from-blue-500 to-indigo-600",
    },
    schedule: t.schedule.map((d) => ({
      dayId: d.dayId,
      dayName: d.dayName,
      shortName: d.shortName,
      lessons: d.lessons,
    })),
    students: generateMockStudents(40, name),
  };
});

export const getClassById = (id: string) => SCHOOL_CLASSES.find(c => c.id === id);
