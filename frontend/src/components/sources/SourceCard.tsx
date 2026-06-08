import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrashIcon, Wallet, PencilIcon } from "lucide-react";
import type { Source } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface SourceCardProps {
  sourceData: Source;
  onUpdate: (source: Source) => void;
  onDelete: (sourceId: string) => void;
}

export default function SourceCard({ sourceData, onUpdate, onDelete }: SourceCardProps) {
  return (
    <Card className="flex flex-row items-stretch overflow-hidden p-0 shadow-sm border-0 bg-[#e9f0e7]">
      <div className="flex items-center justify-center w-24 shrink-0 bg-[#1e3a32]">
        <div className="flex flex-col items-center gap-1 text-[#7fd66b]">
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Privat</span>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <CardHeader className="flex flex-row items-start justify-between pb-0 pt-4">
          <div className="space-y-1">
            <CardTitle className="text-[12px] font-normal text-[#5a6b58]">
              {sourceData?.name}
            </CardTitle>
            <div className="text-[20px] text-[#1e3a32] font-bold">
              {sourceData?.balance} <span className="text-xl">₴</span>
            </div>
          </div>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  ···
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onUpdate(sourceData)}>
                    <PencilIcon />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => onDelete(sourceData._id)}
                    variant="destructive"
                  >
                    <TrashIcon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        {/* <CardContent className="pb-2">
          <div className="flex items-center gap-2 text-[11px] text-[#7a8a78] font-mono">
            <span>4127 8723 0045 9967</span>
          </div>
        </CardContent> */}
      </div>
    </Card>
  );
}
