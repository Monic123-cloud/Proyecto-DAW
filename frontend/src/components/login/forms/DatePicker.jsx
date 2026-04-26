import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";

export default function MyDatePicker({ control, name, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          value={field.value || null}
          onChange={(newValue) => field.onChange(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      )}
    />
  );
}