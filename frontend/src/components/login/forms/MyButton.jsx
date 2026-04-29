import * as React from "react";
import Button from "@mui/material/Button";

export default function MyButton(props) {
  const { label, ...rest } = props;

  return (
    <Button {...rest}>
      {label}
    </Button>
  );
}