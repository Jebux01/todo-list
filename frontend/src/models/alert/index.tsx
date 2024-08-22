import { AlertColor } from "@mui/material";


export interface PropsAlert {
  open: boolean;
  type: AlertColor;
  title?: string;
  description?: string;
  handleClose: () => void;
}