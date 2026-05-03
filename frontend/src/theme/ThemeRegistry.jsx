"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

export default function ThemeRegistry({ children }) {
  const [cache] = React.useState(() =>
    createCache({ key: "mui", prepend: true })
  );

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}