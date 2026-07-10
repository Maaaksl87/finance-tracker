import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoneyWithCurrency } from "@/components/ui/MoneyWithCurrency";
import { TypeCell } from "@/components/ui/table-cells";
import { useTransactions } from "@/hooks/useTransactions";

function dayRangeISO(date: Date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return {
        startDate: new Date(y, m, d, 0, 0, 0, 0).toISOString(),
        endDate: new Date(y, m, d, 23, 59, 59, 999).toISOString(),
    };
}

type Props = {
    day: Date | undefined;
    onClose: () => void;
};

export function DayTransactionsDialog({ day, onClose }: Props) {
    return (
        <Dialog open={!!day} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {day?.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
                    </DialogTitle>
                </DialogHeader>
                {day && <DayTransactionsList day={day} />}
            </DialogContent>
        </Dialog>
    );
}

function DayTransactionsList({ day }: { day: Date }) {
    const { startDate, endDate } = dayRangeISO(day);
    const { transactions, isLoading } = useTransactions(startDate, endDate);

    if (isLoading) {
        return <p className="py-6 text-center text-sm text-muted-foreground">Завантаження...</p>;
    }

    if (transactions.length === 0) {
        return <p className="py-6 text-center text-sm text-muted-foreground">Немає транзакцій за цей день</p>;
    }

    return (
        <ul className="flex flex-col">
            {transactions.map((tx) => (
                <li
                    key={tx._id}
                    className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0"
                >
                    <div className="flex flex-col gap-0.5">
                        <TypeCell type={tx.type} />
                        <span className="text-xs text-muted-foreground">
                            {tx.category} · {tx.sourceId.name}
                        </span>
                    </div>
                    <MoneyWithCurrency amount={tx.amount} />
                </li>
            ))}
        </ul>
    );
}
