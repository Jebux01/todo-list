import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import { PropsAlert } from "../../models/alert";
import { useEffect } from "react";
import { Slide } from "@mui/material";

export default function AlertComponent({
  open,
  type,
  title,
  description,
  handleClose,
}: Readonly<PropsAlert>) {
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  });

  return (
    <div
      style={{
        position: "fixed",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Alert onClose={handleClose} severity={type}>
          <AlertTitle>{title}</AlertTitle>
          {description}
        </Alert>
      </Slide>
    </div>
  );
}
