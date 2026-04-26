import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Controller } from "react-hook-form";

export default function MyPassField({ label, name, control, rules, defaultValue = "" }) {
  const [show, setShow] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <TextField
          inputRef={ref}
          type={show ? "text" : "password"}
          label={label}
          value={value ?? ""}
          onChange={onChange}
          fullWidth
          className={"myForm"}
          error={!!error}
          helperText={error?.message ?? ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow((s) => !s)} edge="end">
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}