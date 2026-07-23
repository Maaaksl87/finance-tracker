import * as z from "zod";
import { colors, TransactionType } from "@/types";

export const EXPENSE_CATEGORIES = [
    { _id: "groceries", name: "Продукти", color: "teal" },
    { _id: "transport", name: "Транспорт", color: "green" },
    { _id: "utilities", name: "Житло та комунальні", color: "yellow" },
    { _id: "entertainment", name: "Розваги та відпочинок", color: "red" },
    { _id: "health", name: "Здоров'я та медицина", color: "blue" },
    { _id: "shopping", name: "Шопінг та одяг", color: "purple" },
    { _id: "cafe", name: "Кафе та ресторани", color: "gray" },
    { _id: "other_expense", name: "Інше", color: "teal" },
] as const;

export const INCOME_CATEGORIES = [
    { _id: "salary", name: "Зарплата", color: "teal" },
    { _id: "freelance", name: "Фріланс та бізнес", color: "green" },
    { _id: "investments", name: "Інвестиції", color: "yellow" },
    { _id: "gifts", name: "Подарунки", color: "red" },
    { _id: "sales", name: "Продаж речей", color: "blue" },
    { _id: "cashback", name: "Кешбек", color: "purple" },
    { _id: "social", name: "Соціальні виплати", color: "gray" },
    { _id: "other_income", name: "Інше", color: "teal" },
] as const;

export const formSchema = z
    .object({
        amount: z.number().min(0.01, "Сума має бути більше 0"),
        type: z.nativeEnum(TransactionType),
        category: z.string().optional(),
        description: z.string().optional(),
        date: z.date({
            message: "Оберіть дату",
        }),
        sourceId: z.string().min(1, "Оберіть гаманець"),
        destinationSourceId: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.type === TransactionType.TRANSFER && !data.destinationSourceId) {
                return false;
            }
            return true;
        },
        {
            message: "Оберіть гаманець для зарахування",
            path: ["destinationSourceId"],
        },
    )
    .refine(
        (data) => {
            if (data.type !== TransactionType.TRANSFER && (!data.category || data.category.trim() === "")) {
                return false;
            }
            return true;
        },
        {
            message: "Оберіть категорію",
            path: ["category"],
        },
    );

export type FormValues = z.infer<typeof formSchema>;

