import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

// Reusable confirmation dialog for destructive actions (delete, clear data).
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'error',
  onConfirm,
  onClose,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {cancelLabel}
        </Button>
        <Button
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
          variant="contained"
          color={confirmColor}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
