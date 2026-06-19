import { PRESETS, type PeriodKey } from "@/lib/period";
import { useSearchParams } from "react-router";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const PERIOD_PRESETS: { key: PeriodKey; label: string }[] = [
    { key: "month", label: PRESETS.month },
    { key: "3m", label: PRESETS["3m"] },
    { key: "year", label: PRESETS.year },
    { key: "all", label: PRESETS.all },
];

export function PeriodFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPeriod = (searchParams.get("period") ?? "month") as PeriodKey;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const selectedDates: DateRange = {
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
    };

    const handlePreset = (key: PeriodKey) => {
        setSearchParams((prev) => {
            prev.set("period", key);
            prev.delete("from");
            prev.delete("to");
            return prev;
        });
    };

    const handleRange = (range?: DateRange) => {
        setSearchParams((prev) => {
            prev.set("period", "custom");
            if (range?.from) prev.set("from", format(range.from, "yyyy-MM-dd"));
            else prev.delete("from");
            if (range?.to) prev.set("to", format(range.to, "yyyy-MM-dd"));
            else prev.delete("to");
            return prev;
        });
    };

    const currentLabel =
        currentPeriod === "custom"
            ? from && to
                ? `${from} — ${to}`
                : PRESETS.custom
            : PRESETS[currentPeriod];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="filter" className="flex items-center gap-1">
                    {currentLabel}
                    <ChevronDown className="size-3.5 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {PERIOD_PRESETS.map(({ key, label }) => (
                    <DropdownMenuItem
                        key={key}
                        onSelect={() => handlePreset(key)}
                        className={currentPeriod === key ? "font-medium text-foreground" : ""}
                    >
                        {label}
                    </DropdownMenuItem>
                ))}
                <Popover>
                    <PopoverTrigger asChild>
                        <DropdownMenuItem
                            className={currentPeriod === "custom" ? "font-medium text-foreground" : ""}
                            onSelect={(e) => e.preventDefault()}
                        >
                            {PRESETS.custom}
                        </DropdownMenuItem>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start">
                        <Calendar
                            mode="range"
                            selected={selectedDates}
                            onSelect={handleRange}
                        />
                    </PopoverContent>
                </Popover>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
