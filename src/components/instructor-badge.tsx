import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function RemovableBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge className="gap-1 bg-blue-500/10 pr-1 text-blue-600 dark:text-blue-400">
      {label}
      <button
        type="button"
        aria-label={`ลบ ${label}`}
        onClick={onRemove}
        className="inline-flex size-3.5 items-center justify-center rounded-full opacity-70 hover:bg-blue-500/20 hover:opacity-100"
      >
        <XIcon />
      </button>
    </Badge>
  );
}
