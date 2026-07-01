import { z } from "zod";

import { APPLICATION_STATUSES } from "@/lib/constants/application";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

export const applicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(200),
  role: z.string().trim().min(1, "Role is required").max(200),
  status: z.enum(APPLICATION_STATUSES).default("WISHLIST"),
  jobUrl: z.preprocess(emptyToUndefined, z.url("Enter a valid URL").optional()),
  location: optionalText(200),
  salaryRange: optionalText(100),
  source: optionalText(100),
  appliedAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
