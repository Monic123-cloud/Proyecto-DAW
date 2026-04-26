"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(customParseFormat);

export default function MyDatePicker({ control, name, label, rules }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          // Soportamos Date, dayjs, string
          const current =
            field.value == null || field.value === ""
              ? null
              : dayjs(field.value, ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"], true).isValid()
                ? dayjs(field.value, ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"], true)
                : dayjs(field.value);

          return (
            <DatePicker
              label={label}
              value={current}
              onChange={(newValue) => {
                // Guardamos un Date (o null) en RHF para evitar líos
                field.onChange(newValue ? newValue.toDate() : null);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message || "",
                },
              }}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
}