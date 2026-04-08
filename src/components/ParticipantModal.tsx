import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PlanMember } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  participants: PlanMember[];
}

export function ParticipantModal({ open, onOpenChange, title, participants }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs mx-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto pt-1">
          {participants.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`${p.color} text-xs font-semibold`}>{p.avatar}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{p.name}</span>
            </div>
          ))}
          {participants.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No participants yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
