import api from "@/services/api";
import { useEffect, useState } from "react";

export type CardFlag = { id: number; name: string };

export const useCardFlags = () => {
  const [flags, setFlags] = useState<CardFlag[]>([]);

  useEffect(() => {
    let mounted = true;
    api
      .get("card-flags")
      .then((res) => {
        if (mounted) setFlags(res.data || []);
      })
      .catch(() => {
        if (mounted) setFlags([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return flags;
};
