import { startOfDay, endOfDay, subYears, subMonths } from "date-fns";

export type PeriodKey = "month" | "3m" | "year" | "all" | "custom";

export function resolvePeriod(params: URLSearchParams): { startDate?: string; endDate?: string } {
    const period = (params.get("period") ?? "month") as PeriodKey;
    if (period === "all") return {};

    if (period === "custom") {
        const from = params.get("from");
        const to = params.get("to");
        return {
            startDate: from ? startOfDay(new Date(from)).toISOString() : undefined,
            endDate: to ? endOfDay(new Date(to)).toISOString() : undefined,
        };
    }

    const end = endOfDay(new Date());
    let start: Date;
    switch (period) {
        case "year":
            start = startOfDay(subYears(end, 1));
            break;
        case "3m":
            start = startOfDay(subMonths(end, 3));
            break;
        case "month":
        default:
            start = startOfDay(subMonths(end, 1));
            break;
    }
    return { startDate: start.toISOString(), endDate: end.toISOString() };
}
export const PRESETS: Record<PeriodKey, string> = {
    month: "Місяць",
    "3m": "3 місяці",
    year: "Рік",
    all: "Усі дані",
    custom: "Свій період",
};