import { AlertColor } from "@mui/material";

export interface PropsModal {
  open: boolean;
  type: string;
  taskId?: string;
  title?: string;
  description?: string;
  handleClose: () => void;
  handleOpenAlert: (
    title: string,
    description: string,
    type: AlertColor
  ) => void;
  handlerRefresh: () => void;
}
