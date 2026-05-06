import * as React from "react";
import TextField from "@mui/material/TextField";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

type MyTextFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

export default function MyTextField<T extends FieldValues>({
  label,
  name,
  control,
  rules,
}: MyTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}