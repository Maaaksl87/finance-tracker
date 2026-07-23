import { colors, type Category } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/components/transactions/transaction.schema";

const FALLBACK_HEX = colors[colors.length - 1].hex;

export function getCategoryHex(
    categoryName: string,
    type: "income" | "expense",
    customCategories: Category[],
): string {
    const custom = customCategories.find((c) => c.name === categoryName && c.type === type);
    if (custom) {
        return colors.find((c) => c.value === custom.color)?.hex ?? FALLBACK_HEX;
    }

    const staticList = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const staticMatch = staticList.find((c) => c.name === categoryName);
    if (staticMatch) {
        return colors.find((c) => c.value === staticMatch.color)?.hex ?? FALLBACK_HEX;
    }

    return FALLBACK_HEX;
}
