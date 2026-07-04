import {
  Card,
  CardAction,
} from "@/components/ui/card";
import { TrashIcon, Wallet, PencilIcon, MoreHorizontal } from "lucide-react";
import { sourceTypes, type Source } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { type SourceListItemProps, formatBalance, getActiveColor, getCurrencySymbol } from "./SourceListItem";

interface SourceCardProps extends SourceListItemProps {
  onUpdate: (source: Source) => void;
  onDelete: (sourceId: string) => void;
}

export default function SourceCard({ source, onUpdate, onDelete }: SourceCardProps) {
  const activeColor = getActiveColor(source.color);
  const currencySymbol = getCurrencySymbol(source.currency);
  const label = sourceTypes.find((t) => t.value === source.type)?.label

  return (
    <Card
      className="flex flex-row items-stretch overflow-hidden p-0 border border-border shadow-card hover:shadow-card-hover transition-shadow"
      style={{
        "--c": activeColor.hex,
        backgroundColor: "color-mix(in srgb, var(--c) 8%, var(--card))",
      } as React.CSSProperties}
    >
      <div
        className="flex items-center justify-center w-20 shrink-0"
        style={{ backgroundColor: "var(--c)" }}
      >
        <div className="flex flex-col items-center gap-1.5 text-white">
          <Wallet className="w-5 h-5" />
          <span className="text-[0.56rem] font-bold tracking-widest uppercase">
            {label}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0 px-4 py-2">
        <div className="flex items-start justify-between gap-2">
          <span className="font-dm font-medium text-[0.8125rem] text-muted-foreground leading-snug truncate">
            {source.name}
          </span>
          <CardAction className="-mt-1 -mr-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Дії з гаманцем">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onUpdate(source)}>
                    <PencilIcon />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => onDelete(source._id)}
                    variant="destructive"
                  >
                    <TrashIcon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </div>

        <div className="font-dm font-extrabold text-[1.6rem] text-foreground leading-tight">
          {formatBalance(source.balance)}
          <span className="text-[1.25rem] font-bold">{currencySymbol}</span>
        </div>
      </div>
    </Card>
  );
}
