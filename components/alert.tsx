import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cancelDeleteChannel: () => void
  confirmDeleteChannel: () => void
}

export function Alert({
  open,
  onOpenChange,
  cancelDeleteChannel,
  confirmDeleteChannel,
} : AlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this channel and all its conditions.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDeleteChannel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDeleteChannel}
            className="bg-destructive text-destructive-foreground"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
