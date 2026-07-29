import { z } from "zod";
import {
  isValidSolanaAddress,
  normalizeSolanaAddress,
} from "@/lib/levi/wallet";

function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function hasAllowedHost(value: string, hosts: string[]): boolean {
  if (!isSafeHttpsUrl(value)) return false;
  const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  return hosts.includes(hostname);
}

const MintSchema = z
  .string()
  .trim()
  .refine(isValidSolanaAddress, "Enter a valid Solana token mint.")
  .transform(normalizeSolanaAddress);

const OptionalHttpsUrlSchema = z
  .string()
  .trim()
  .max(500)
  .nullable()
  .refine((value) => value === null || isSafeHttpsUrl(value), {
    message: "Links must use a valid HTTPS URL.",
  });

const OptionalXUrlSchema = z
  .string()
  .trim()
  .max(500)
  .nullable()
  .refine(
    (value) =>
      value === null || hasAllowedHost(value, ["x.com", "twitter.com"]),
    { message: "Enter a valid X profile or post URL." }
  );

const OptionalTelegramUrlSchema = z
  .string()
  .trim()
  .max(500)
  .nullable()
  .refine(
    (value) =>
      value === null || hasAllowedHost(value, ["t.me", "telegram.me"]),
    { message: "Enter a valid Telegram URL." }
  );

const OptionalLaunchAtSchema = z.string().datetime().nullable();

export const CreateFairLaunchSchema = z.object({
  mint: MintSchema,
  name: z.string().trim().min(2).max(80),
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .regex(/^[A-Za-z0-9$._-]+$/, "Use a simple token symbol."),
  summary: z.string().trim().min(24).max(600),
  status: z.enum(["announced", "open", "closed"]),
  launchAt: OptionalLaunchAtSchema,
  officialUrl: OptionalHttpsUrlSchema,
  xUrl: OptionalXUrlSchema,
  telegramUrl: OptionalTelegramUrlSchema,
  isPublished: z.boolean(),
});

export const UpdateFairLaunchSchema = z
  .object({
    mint: MintSchema,
    name: z.string().trim().min(2).max(80).optional(),
    symbol: z
      .string()
      .trim()
      .min(1)
      .max(16)
      .regex(/^[A-Za-z0-9$._-]+$/, "Use a simple token symbol.")
      .optional(),
    summary: z.string().trim().min(24).max(600).optional(),
    status: z.enum(["announced", "open", "closed"]).optional(),
    launchAt: OptionalLaunchAtSchema.optional(),
    officialUrl: OptionalHttpsUrlSchema.optional(),
    xUrl: OptionalXUrlSchema.optional(),
    telegramUrl: OptionalTelegramUrlSchema.optional(),
    isPublished: z.boolean().optional(),
  })
  .refine(
    (value) => Object.keys(value).some((key) => key !== "mint"),
    "Include at least one launch field to update."
  );

export const DeleteFairLaunchSchema = z.object({
  mint: MintSchema,
});
