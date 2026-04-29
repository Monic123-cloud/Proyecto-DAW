import {
  Controller,
  Control,
  FieldValues,
  Path,
} from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type MyDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
};

export default function MyDatePicker<T extends FieldValues>({
  control,
  name,
  label,
}: MyDatePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={field.value || null}
          onChange={(newValue) => field.onChange(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message || "",
            },
          }}
        />
      )}
    />
  );
}