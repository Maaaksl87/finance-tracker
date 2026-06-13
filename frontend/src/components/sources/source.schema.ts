import { z } from "zod";
import { bankSources, colors, currencies, cryptoSources, type Color } from "@/types/sources";

const colorValues = colors.map((color) => color.value) as [Color, ...Color[]];

const walletDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Назва обов'язкова")
    .max(15, "Назва не повинна перевищувати 15 символів"),
  balance: z.coerce.number().min(0, "Баланс не може бути від'ємним"),
  currency: z.enum(currencies),
  color: z.enum(colorValues),
});

const bankApiConfigSchema = z.object({
  connectionType: z.literal("api"),
  bank: z.enum(bankSources),
  apiToken: z.string().trim().min(1, "API токен обов'язковий"),
  accountId: z.string().trim().min(1, "Оберіть рахунок"),
  accountName: z.string().trim().optional(),
  accountBalance: z.coerce.number().optional(),
  accountCurrency: z.string().trim().optional(),
  color: z.enum(colorValues),
});

const bankManualConfigSchema = walletDetailsSchema.extend({
  connectionType: z.literal("manual"),
  bank: z.enum(bankSources).optional(),
});

export const cardConfigSchema = z.discriminatedUnion("connectionType", [
  bankApiConfigSchema,
  bankManualConfigSchema,
]);

const cryptoApiConfigSchema = z.object({
  connectionType: z.literal("api"),
  provider: z.enum(cryptoSources),
  apiKey: z.string().trim().min(1, "API Key обов'язковий"),
  apiSecret: z.string().trim().min(1, "API Secret обов'язковий"),
  passphrase: z.string().trim().optional(),
});

const cryptoManualConfigSchema = walletDetailsSchema.extend({
  connectionType: z.literal("manual"),
  provider: z.enum(cryptoSources).optional(),
});

export const cryptoConfigSchema = z.discriminatedUnion("connectionType", [
  cryptoApiConfigSchema,
  cryptoManualConfigSchema,
]);

const cashSourceSchema = walletDetailsSchema.extend({
  sourceType: z.literal("cash"),
});

const cryptoSourceSchema = z.object({
  sourceType: z.literal("crypto"),
  cryptoConfig: cryptoConfigSchema,
});

// const depositSourceSchema = walletDetailsSchema.extend({
//   sourceType: z.literal("deposit"),
// });

export const sourceSchema = z.discriminatedUnion("sourceType", [
  z.object({
    sourceType: z.literal("card"),
    cardConfig: cardConfigSchema,
  }),
  cashSourceSchema,
  cryptoSourceSchema,
  // depositSourceSchema,
]);

export type SourceSchemaType = z.input<typeof sourceSchema>;
export type CardConfigSchemaType = z.input<typeof cardConfigSchema>;
export type BankSourceSchemaType = CardConfigSchemaType;
