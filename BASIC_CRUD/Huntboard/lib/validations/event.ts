import { z } from "zod";

import { EVENT_TYPES } from "@/lib/constants/event";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const eventSchema = z.object({
  type: z.enum(EVENT_TYPES),
  notes: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  scheduledAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
});

export type EventInput = z.infer<typeof eventSchema>;
