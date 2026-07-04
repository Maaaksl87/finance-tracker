import type { CurrencyRate } from "@/types";
import { number } from "currency-codes-ts";
import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

const getCurrencyCode = (code: number | string | undefined): string => {
    if (!code) return "";
    return number(code)?.code ?? String(code);
};

export const CurrencyRow = ({ curr }: { curr: CurrencyRate }) => {
    const codeA = getCurrencyCode(curr.currencyCodeA);
    const codeB = getCurrencyCode(curr.currencyCodeB);

    return (
        <TableRow className="hover:bg-muted/5">
            <TableCell className="font-medium text-sm text-foreground">
                {codeA} / {codeB}
            </TableCell>
            <TableCell className="text-right font-medium text-sm text-foreground">
                {curr.rateCross ? curr.rateCross : `${curr.rateBuy} / ${curr.rateSell}`}
            </TableCell>
        </TableRow>
    );
};