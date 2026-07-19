import * as z from "zod";
import { colors, TransactionType } from "@/types";

export const EXPENSE_CATEGORIES = [
    { _id: "groceries", name: "Продукти" },
    { _id: "transport", name: "Транспорт" },
    { _id: "utilities", name: "Житло та комунальні" },
    { _id: "entertainment", name: "Розваги та відпочинок" },
    { _id: "health", name: "Здоров'я та медицина" },
    { _id: "shopping", name: "Шопінг та одяг" },
    { _id: "cafe", name: "Кафе та ресторани" },
    { _id: "other_expense", name: "Інше" },
] as const;

export const INCOME_CATEGORIES = [
    { _id: "salary", name: "Зарплата" },
    { _id: "freelance", name: "Фріланс та бізнес" },
    { _id: "investments", name: "Інвестиції" },
    { _id: "gifts", name: "Подарунки" },
    { _id: "sales", name: "Продаж речей" },
    { _id: "cashback", name: "Кешбек" },
    { _id: "social", name: "Соціальні виплати" },
    { _id: "other_income", name: "Інше" },
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

