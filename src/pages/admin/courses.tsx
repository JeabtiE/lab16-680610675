import { useMemo, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

import { RemovableBadge } from "@/components/instructor-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import type { Course } from "@/lib/types";

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

function InstructorCombobox({
  value,
  onChange,
  existingNames,
}: {
  value: string[];
  onChange: (names: string[]) => void;
  existingNames: string[];
}) {
  const anchor = useComboboxAnchor();
  const [query, setQuery] = useState("");
  const q = query.trim();

  const allNames = useMemo(() => {
    const result: string[] = [];
    for (const n of [...existingNames, ...value]) {
      if (!result.some((r) => same(r, n))) result.push(n);
    }
    return result;
  }, [existingNames, value]);

  const matched = allNames.filter((n) =>
    n.toLowerCase().includes(q.toLowerCase()),
  );
  const canAdd = q !== "" && !allNames.some((n) => same(n, q));
  const items = canAdd ? [...matched, q] : matched;

  return (
    <Combobox
      multiple
      items={items}
      filter={null}
      value={value}
      onValueChange={(v) => {
        onChange(v as string[]);
        setQuery("");
      }}
      inputValue={query}
      onInputValueChange={setQuery}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(selected: string[]) => (
            <>
              {selected.map((name) => (
                <ComboboxChip key={name}>{name}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                id="instructors"
                placeholder={
                  selected.length === 0 ? "เลือกหรือพิมพ์ชื่อผู้สอน" : ""
                }
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>ไม่พบผู้สอน</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {canAdd && item === q ? `+ เพิ่มผู้สอน "${item}"` : item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function AddCourseDialog() {
  const { courses, addCourse } = useEnrollmentStore();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [instructors, setInstructors] = useState<string[]>([]);

  const existingNames = useMemo(
    () => [...new Set(courses.flatMap((c) => c.instructors ?? []))],
    [courses],
  );

  const trimmedCode = code.trim();
  const duplicate =
    trimmedCode !== "" && courses.some((c) => same(c.courseCode, trimmedCode));
  const canSave = trimmedCode !== "" && title.trim() !== "" && !duplicate;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setCode("");
      setTitle("");
      setInstructors([]);
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    addCourse({
      courseCode: trimmedCode.toUpperCase(),
      courseTitle: title.trim(),
      instructors,
    });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
          <DialogDescription>
            วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="courseCode">รหัสวิชา</Label>
            <Input
              id="courseCode"
              value={code}
              aria-invalid={duplicate}
              onChange={(e) => setCode(e.target.value)}
            />
            {duplicate && (
              <p className="text-sm text-destructive">
                มีรหัสวิชา {trimmedCode.toUpperCase()} นี้แล้ว
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="courseTitle">ชื่อวิชา</Label>
            <Input
              id="courseTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="instructors">ผู้สอน</Label>
            <InstructorCombobox
              value={instructors}
              onChange={setInstructors}
              existingNames={existingNames}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!canSave} onClick={handleSave}>
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCoursesPage() {
  const { courses, removeCourse, removeInstructor } = useEnrollmentStore();
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} วิชา — เพิ่มวิชาใหม่ที่นี่
            วิชาจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาที่หน้า
            “จัดการการลงทะเบียน” ทันที
          </p>
        </div>
        <AddCourseDialog />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ยังไม่มีวิชา
                </TableCell>
              </TableRow>
            )}
            {courses.map((c) => (
              <TableRow key={c.courseCode}>
                <TableCell>{c.courseCode}</TableCell>
                <TableCell>{c.courseTitle}</TableCell>
                <TableCell>
                  {c.instructors && c.instructors.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {c.instructors.map((name) => (
                        <RemovableBadge
                          key={name}
                          label={name}
                          onRemove={() => removeInstructor(c.courseCode, name)}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      ยังไม่มีผู้สอน
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`ลบวิชา ${c.courseCode}`}
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(c)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ลบวิชา {deleteTarget?.courseCode}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              การลงทะเบียนของนักศึกษาในวิชานี้ทั้งหมดจะถูกลบไปด้วย
              และไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) removeCourse(deleteTarget.courseCode);
                setDeleteTarget(null);
              }}
            >
              ลบวิชา
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
