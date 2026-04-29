import { Controller } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";

export default function MySelect(props){
const { label, name, control, options } = props
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          label={label}
          error={!!error}
          helperText={error ? error.message : ""}
        >
          {options.map((opt, index) => (
            <MenuItem key={index} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );

}
