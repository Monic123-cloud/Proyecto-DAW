import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";

type SelectOption = {
  label: string;
  value: string | number;
};

type MySelectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
};

export default function MySelect<T extends FieldValues>({
  label,
  name,
  control,
  options,
}: MySelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          label={label}
          error={!!error}
          helperText={error?.message || ""}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
