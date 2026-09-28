type FooterProps = {
  firstName: string;
  lastName: string;
  studentId: string;
};

export function Footer({ firstName, lastName, studentId }: FooterProps) {
  return (
    <footer className="border-t p-4 text-center text-xs text-muted-foreground">
      จัดทำโดย {firstName} {lastName} รหัสนักศึกษา {studentId}
    </footer>
  );
}
