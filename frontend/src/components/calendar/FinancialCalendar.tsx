import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { useTransactionCalendar } from "@/hooks/useTransactions"
import { useMemo, useState } from "react"
import { type CalendarDay } from "@/types/transaction"
import { DayTransactionsDialog } from "./DayTransactionsDialog"


function toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function dayTooltip(day: CalendarDay) {
    const parts: string[] = [];

    if (day.income > 0) parts.push(`Дохід +${day.income}`);
    if (day.expense > 0) parts.push(`Витрати -${day.expense}`);
    if (day.transfer > 0) parts.push(`Трансфери ${day.transfer}`);

    return parts.join(" · ");
}

function TypeDot({ type }: { type: 'income' | 'expense' | 'transfer' }) {
    const colorClass = {
        income: "bg-type-income",
        expense: "bg-type-expense",
        transfer: "bg-type-transfer",
    }[type];
    return <span className={`size-1.5 rounded-full ${colorClass} ring-1 ring-card border-none`} />;

}

export function FinancialCalendar() {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>();
    const [month, setMonth] = useState(new Date());
    const { days, error } = useTransactionCalendar(month);

    const daysByDate = useMemo(() => {
        const map = new Map<string, CalendarDay>();

        for (const day of days) map.set(day.date, day);
        return map;
    }, [days]);

    if (error) return <p className="p-8 text-center text-muted-foreground">Помилка завантаження аналітики</p>;

    return (
        <Card className="mx-auto w-fit p-0">
            <CardContent className="p-0">
                <Calendar
                    mode="single"
                    month={month}
                    selected={selectedDay}
                    onSelect={setSelectedDay}
                    onMonthChange={setMonth}
                    numberOfMonths={1}
                    captionLayout="dropdown"
                    className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                    formatters={{
                        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "long" })
                    }}
                    components={{
                        DayButton: ({ children, modifiers, day, ...props }) => {
                            const dayData = daysByDate.get(toDateKey(day.date));
                            const hasIncome = (dayData?.income ?? 0) > 0;
                            const hasExpense = (dayData?.expense ?? 0) > 0;
                            const hasTransfer = (dayData?.transfer ?? 0) > 0;
                            const hasActivity = hasIncome || hasExpense || hasTransfer;

                            return (
                                <CalendarDayButton day={day} modifiers={modifiers} {...props} title={dayData && hasActivity ? dayTooltip(dayData) : undefined}>
                                    {children}
                                    {!modifiers.outside && hasActivity ? (
                                        <span className="flex gap-0.5">
                                            {hasIncome && <TypeDot type="income" />}
                                            {hasExpense && <TypeDot type="expense" />}
                                            {hasTransfer && <TypeDot type="transfer" />}
                                        </span>
                                    ) : null}
                                </CalendarDayButton>
                            )
                        },
                    }}
                />
            </CardContent>
            <DayTransactionsDialog day={selectedDay} onClose={() => setSelectedDay(undefined)} />
        </Card>
    )
}
