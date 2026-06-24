"use client";
import { useEffect, useState } from "react";

let _cache = null; // module-level cache so only one fetch per page-load

export function useDocumentTypes() {
  const [types, setTypes] = useState(_cache ?? []);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) return;
    fetch("/api/document-types")
      .then((r) => r.json())
      .then((data) => {
        _cache = data.document_types ?? [];
        setTypes(_cache);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { types, loading };
}
