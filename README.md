## lab16-2569 : Enrollment Card List

ป้อนข้อมูลนักศึกษา
รหัส นศ.: 680610675

ชื่อ-สกุล : ณัฐภัทร ศรีหรั่ง

หลังจากการ Fork และ Clone repository แล้ว, ให้เปิดโฟลเดอร์ด้วย VSCode และรันคำสั่งใน terminal:

```tsx
pnpm install
pnpm run dev
```

---
### ปรับ Types : `src\lib\types.ts`
```ts
interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  status: "Active" | "Inactive";
  enrolledCourses: string[]; // รายชื่อวิชา เช่น ["CS101", "CS201"]
}
export type { Student };

// วิชาที่เปิดสอน — เพิ่มใหม่ได้จากหน้า "จัดการวิชาเรียน" (/admin/courses)
interface Course {
  courseCode: string; // เช่น "CPE301" — ค่านี้คือค่าเดียวกับที่ไปอยู่ใน Student.enrolledCourses
  courseTitle: string;
  instructors?: string[];
}
export type { Course };
```
---
### ปรับ mock-data : `src\lib\mock-data.ts`
```ts
export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    courses: ["261207", "261497"],
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    courses: ["269101", "261497"],
  },
];

export const courses: Course[] = [
  {
    courseId: "261207",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanadda"],
  },
  {
    courseId: "261497",
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanadda"],
  },
  {
    courseId: "269101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COSH"],
  },
];

export const enrollments: Enrollment[] = [
  { studentId: "650610002", courseId: "261207" },
  { studentId: "650610002", courseId: "261497" },
  { studentId: "650610003", courseId: "269101" },
  { studentId: "650610003", courseId: "261497" },
];

```
---

# shadcn/ui — เอกสารอ้างอิง

## 1. เอกสารหลักของ shadcn/ui

| หัวข้อ                                            | ลิงก์                                 |
| ------------------------------------------------- | ------------------------------------- |
| เอกสารหลัก                                        | https://ui.shadcn.com/docs            |
| รายการ Component                                  | https://ui.shadcn.com/docs/components |
| Theming                                           | https://ui.shadcn.com/docs/theming    |
| Dark Mode                                         | https://ui.shadcn.com/docs/dark-mode  |
| ตัวสร้าง Preset (ตัวที่ README หลักใช้ตอน `init`) | https://ui.shadcn.com/create          |

## 2. Base UI (ที่โปรเจกต์นี้เลือกตอน `shadcn init`)

| หัวข้อ                                  | ลิงก์                                                               |
| --------------------------------------- | ------------------------------------------------------------------- |
| หน้าแรก                                 | https://base-ui.com                                                 |
| เริ่มต้นใช้งาน                          | https://base-ui.com/react/overview/quick-start                      |
| แนวคิด `render` prop (ใช้แทน `asChild`) | https://base-ui.com/react/handbook/composition (หัวข้อ Composition) |

## 3. อื่น ๆ

| หัวข้อ                                                            | ลิงก์                                                                                                |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Tailwind CSS v4                                                   | https://tailwindcss.com/docs                                                                         |
| Icon (`Trash2`, `UserPlus`)                                       | https://lucide.dev/icons                                                                             |
| React Router v7                                                   | https://reactrouter.com                                                                              |
| `Date` (MDN)                                                      | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date                |
| `toLocaleString` และ `Intl.DateTimeFormat` (ใช้แสดงวันที่ปี พ.ศ.) | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat |
