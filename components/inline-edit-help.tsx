import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface InlineEditHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InlineEditHelp({ open, onOpenChange }: InlineEditHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Inline Editing Guide
          </DialogTitle>
          <DialogDescription className="text-left space-y-2">
            <p>You can edit employee data directly in the table:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Click any editable cell</strong> to start editing
              </li>
              <li>
                <strong>Name, Email, Phone:</strong> Click to type new values
              </li>
              <li>
                <strong>Position, Status:</strong> Click to select from dropdown
              </li>
              <li>
                <strong>Save:</strong> Click ✓ or press Enter
              </li>
              <li>
                <strong>Cancel:</strong> Click ✗ or press Escape
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Editable cells will highlight when you hover over them.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
