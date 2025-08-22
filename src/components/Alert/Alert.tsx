import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert as MuiAlert,
  Typography,
} from '@mui/material';
import useAlertStore from '../../stores/alertStore';

export default function Alert() {
  const { alert, closeAlert } = useAlertStore();

  return (
    <Dialog
      open={alert != null}
      onClose={closeAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="alert-dialog-title">
        <MuiAlert severity={alert?.type}>{alert?.title}</MuiAlert>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {alert?.message}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAlert} autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
