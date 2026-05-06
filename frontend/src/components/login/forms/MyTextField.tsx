"use client";

import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

type MyTextFieldProps = {
  name: string;
  control: any;
  label: string;
  type?: string;
  rules?: any;
};

export default function MyTextField({
  name,
  control,
  label,
  type = "text",
  rules,
}: MyTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          label={label}
          type={type}
          variant="outlined"
          fullWidth
          error={!!error}
          helperText={error?.message || ""}
        />
      )}
    />
  );
}