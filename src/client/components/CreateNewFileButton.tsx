import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CreateNewFileForm } from "./forms/CreateNewFileForm";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";

type Props = { type: "file" | "folder" } & BoxProps;

export default function CreateNewFileButton({ type, ...boxProps }: Props) {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box {...boxProps}>
      <Button variant="outlined" sx={{ mr: 2 }} onClick={handleClickOpen}>
        Create new {type}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6">New {type}</DialogTitle>
        <DialogContent>
          <CreateNewFileForm
            type={type}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
