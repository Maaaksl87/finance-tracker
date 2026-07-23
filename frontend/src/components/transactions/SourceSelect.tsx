import { useMemo } from "react";
import type { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Source } from "@/types";
import type { FormValues } from "./transaction.schema";

interface SourceSelectProps {
    control: Control<FormValues>;
    name: "sourceId" | "destinationSourceId";
    label: string;
    sources: Source[];
    excludeId?: string;
}

export default function SourceSelect({ control, name, sources, label, excludeId }: SourceSelectProps) {
    const visibleSources = useMemo(() => {
        return sources.filter((s) => s._id !== excludeId);
    }, [sources, excludeId])

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const selected = sources.find((s) => s._id === field.value)?.name;
                return (
                    <FormItem className="flex flex-col space-y-1.5">
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">{label}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full bg-input dark:bg-input dark:hover:bg-input-hover border-border rounded-xl px-4 text-foreground focus-visible:ring-0 data-[size=default]:h-12">
                                    <SelectValue placeholder="Оберіть гаманець...">
                                        {field.value && (
                                            <div className="flex items-center gap-2">
                                                <span className="">{selected}</span>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover border-border">
                                {visibleSources.map((source) => (
                                    <SelectItem key={source._id} value={source._id} className="focus:bg-input-active focus:text-foreground">
                                        {source.name} ({source.balance}) {source.currency}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}