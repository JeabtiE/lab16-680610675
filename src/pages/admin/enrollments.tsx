import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { RemovableBadge } from "@/components/instructor-badge";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentStore } from "@/lib/enrollment-store";

type Option = { value: string; label: string };
type StudentOption = Option & { name: string };

function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StudentCombobox({
  options,
  selectedIds,
  onChange,
  disabled,
}: {
  options: StudentOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled: boolean;
}) {
  const anchor = useComboboxAnchor();
  const value = options.filter((o) => selectedIds.includes(o.value));

  return (
    <Combobox
      multiple
      items={options}
      disabled={disabled}
      value={value}
      onValueChange={(v) => onChange((v as StudentOption[]).map((o) => o.value))}
      isItemEqualToValue={(a, b) => a.value === b.value}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(selected: StudentOption[]) => (
            <>
              {selected.map((s) => (
                <ComboboxChip key={s.value}>{s.name}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                id="formStudents"
                placeholder={
                  disabled
                    ? "เลือกวิชาก่อน"
                    : selected.length === 0
                      ? "เลือกนักศึกษา"
                      : ""
                }
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>ไม่พบนักศึกษาที่ลงทะเบียนได้</ComboboxEmpty>
        <ComboboxList>
          {(item: StudentOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default function AdminEnrollmentsPage() {
  const { students, courses, enrollStudents, unenrollStudent } =
    useEnrollmentStore();

  const [formCourse, setFormCourse] = useState<string | null>(null);
  const [formStudentIds, setFormStudentIds] = useState<string[]>([]);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [mode, setMode] = useState<"course" | "student">("course");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");

  const nameOf = (s: { firstName: string; lastName: string }) =>
    `${s.firstName} ${s.lastName}`;

  const studentOptions: Option[] = students.map((s) => ({
    value: s.studentId,
    label: `${s.studentId} — ${nameOf(s)}`,
  }));
  const courseOptions: Option[] = courses.map((c) => ({
    value: c.courseCode,
    label: `${c.courseCode} — ${c.courseTitle}`,
  }));

  const availableStudentOptions: StudentOption[] = formCourse
    ? students
        .filter((s) => !s.enrolledCourses.includes(formCourse))
        .map((s) => ({
          value: s.studentId,
          label: `${s.studentId} — ${nameOf(s)}`,
          name: nameOf(s),
        }))
    : [];

  const handleEnroll = () => {
    if (!formCourse || formStudentIds.length === 0) return;
    enrollStudents(formCourse, formStudentIds);
    handleEnrollDialogOpenChange(false);
  };

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleEnrollDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setFormCourse(null);
      setFormStudentIds([]);
    }
  };

  const rows = courses
    .map((c) => ({
      course: c,
      enrolled: students.filter((s) => s.enrolledCourses.includes(c.courseCode)),
    }))
    .filter(({ course, enrolled }) =>
      mode === "course"
        ? filterCourse === "all" || course.courseCode === filterCourse
        : filterStudent === "all" ||
          enrolled.some((s) => s.studentId === filterStudent),
    );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">จัดการการลงทะเบียน</h1>
        <p className="text-sm text-muted-foreground">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={handleEnrollDialogOpenChange}>
        <DialogTrigger render={<Button />}>
          <PlusCircle className="h-4 w-4" />
          ลงทะเบียนให้นักศึกษา
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
            <DialogDescription>
              เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น
              (เลือกได้หลายคน)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="formCourse">วิชา</Label>
              <OptionSelect
                id="formCourse"
                options={courseOptions}
                value={formCourse}
                placeholder="เลือกวิชา"
                onChange={(v) => {
                  setFormCourse(v);
                  setFormStudentIds([]);
                }}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="formStudents">นักศึกษา</Label>
              <StudentCombobox
                key={formCourse ?? "none"}
                options={availableStudentOptions}
                selectedIds={formStudentIds}
                onChange={setFormStudentIds}
                disabled={!formCourse}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!formCourse || formStudentIds.length === 0}
              onClick={handleEnroll}
            >
              <PlusCircle className="h-4 w-4" />
              ลงทะเบียน ({formStudentIds.length} คน)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "course" | "student")}
      >
        <TabsList>
          <TabsTrigger value="course">ค้นหาตามวิชา</TabsTrigger>
          <TabsTrigger value="student">ค้นหาตามนักศึกษา</TabsTrigger>
        </TabsList>
        <TabsContent value="course" className="pt-2">
          <OptionSelect
            id="filterCourse"
            options={[{ value: "all", label: "ทุกวิชา" }, ...courseOptions]}
            value={filterCourse}
            onChange={setFilterCourse}
          />
        </TabsContent>
        <TabsContent value="student" className="pt-2">
          <OptionSelect
            id="filterStudent"
            options={[{ value: "all", label: "ทุกคน" }, ...studentOptions]}
            value={filterStudent}
            onChange={setFilterStudent}
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>จำนวน นศ.</TableHead>
              <TableHead>นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}
            {rows.map(({ course, enrolled }) => (
              <TableRow key={course.courseCode}>
                <TableCell>{course.courseCode}</TableCell>
                <TableCell>{course.courseTitle}</TableCell>
                <TableCell>{enrolled.length}</TableCell>
                <TableCell>
                  {enrolled.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {enrolled.map((s) => (
                        <RemovableBadge
                          key={s.studentId}
                          label={nameOf(s)}
                          onRemove={() =>
                            unenrollStudent(s.studentId, course.courseCode)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      ยังไม่มีนักศึกษา
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
