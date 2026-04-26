"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

function createEmotionCache() {
  return createCache({ key: "mui", prepend: true });
}

export default function ThemeRegistry({ children }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createEmotionCache();
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted = [];

    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  const { extractCriticalToChunks } = createEmotionServer(cache);

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    const chunks = extractCriticalToChunks(
      `<div data-emotion="${cache.key} ${names.join(" ")}"></div>`
    );

    return chunks.styles.map((style) => (
      <style
        key={style.key}
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}