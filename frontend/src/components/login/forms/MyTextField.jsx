import * as React from "react";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

export default function MyTextField(props) {
  const { label, name, control, rules, defaultValue = "", ...rest } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <TextField
          inputRef={ref}
          id={`field-${name}`}
          label={label}
          value={value ?? ""}
          onChange={onChange}
          variant="outlined"
          className={"myForm"}
          error={!!error}
          helperText={error?.message ?? ""}
          fullWidth
          {...rest}
        />
      )}
    />
  );
}