import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

import { CreateTransactionDto, Source, TransactionType } from "@/types";
import { createTransaction } from "@/api/transactions";
import { getSources } from "@/api/sources"; // Нам треба список гаманців!

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// 1. СХЕМА ВАЛІДАЦІЇ (ZOD)
// Це правила, за якими форма перевіряє себе перед відправкою
const formSchema = z
  .object({
    amount: z.coerce.number().min(0.01, "Сума має бути більше 0"), // coerce перетворить рядок у число
    type: z.nativeEnum(TransactionType),
    category: z.string().min(1, "Оберіть категорію"),
    description: z.string().optional(),
    date: z.date(),
    sourceId: z.string().min(1, "Оберіть гаманець"),
    destinationSourceId: z.string().optional(),
  })
  .refine(
    (data) => {
      // Кастомна перевірка: Якщо це ПЕРЕКАЗ, то destinationSourceId обовязковий
      if (data.type === TransactionType.TRANSFER && !data.destinationSourceId) {
        return false;
      }
      return true;
    },
    {
      message: "Оберіть гаманець для зарахування",
      path: ["destinationSourceId"],
    },
  );

// Тип даних форми на основі схеми
type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSuccess: () => void; // Що робити після успіху (напр. оновити таблицю)
}

export function TestCreateTransactionDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Ініціалізація форми
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: TransactionType.EXPENSE,
      category: "Food", // Можна змінити на пустий рядок
      description: "",
      date: new Date(),
      sourceId: "",
      destinationSourceId: "",
    },
  });

  // Слідкуємо за типом транзакції, щоб показувати/ховати поля
  const transactionType = form.watch("type");

  // 3. Завантаження гаманців при відкритті
  useEffect(() => {
    if (open) {
      getSources().then(setSources).catch(console.error);
    }
  }, [open]);

  // 4. Обробка відправки
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Підготовка даних для API
      const payload: CreateTransactionDto = {
        amount: values.amount,
        type: values.type,
        category: values.category,
        description: values.description,
        date: values.date,
        sourceId: values.sourceId,
        destinationSourceId:
          values.type === TransactionType.TRANSFER
            ? values.destinationSourceId
            : undefined,
      };

      await createTransaction(payload);

      onSuccess(); // Оновлюємо список батька
      setOpen(false); // Закриваємо вікно
      form.reset(); // Чистимо форму
    } catch (error) {
      console.error("Failed to create transaction", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Додати запис
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Нова транзакція</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* РЯДОК 1: Тип та Дата */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TransactionType.EXPENSE}>
                          Витрата 🔴
                        </SelectItem>
                        <SelectItem value={TransactionType.INCOME}>Дохід 🟢</SelectItem>
                        <SelectItem value={TransactionType.TRANSFER}>
                          Переказ 🔵
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Оберіть дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* РЯДОК 2: Гаманці */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="sourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {transactionType === TransactionType.INCOME
                        ? "Куди зарахувати"
                        : "Звідки списати"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть гаманець" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source._id} value={source._id}>
                            {source.name} ({source.balance} ₴)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Показуємо це поле ТІЛЬКИ для переказів */}
              {transactionType === TransactionType.TRANSFER && (
                <FormField
                  control={form.control}
                  name="destinationSourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Куди переказати</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть цільовий гаманець" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sources
                            // Не можна переказати на той самий гаманець
                            .filter((s) => s._id !== form.getValues("sourceId"))
                            .map((source) => (
                              <SelectItem key={source._id} value={source._id}>
                                {source.name} ({source.balance} ₴)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* РЯДОК 3: Сума та Категорія */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сума</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категорія</FormLabel>
                    {/* Тут в ідеалі теж Select, але поки Input для простоти */}
                    <FormControl>
                      <Input placeholder="Їжа, Таксі..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* РЯДОК 4: Опис */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опис (необов'язково)</FormLabel>
                  <FormControl>
                    <Input placeholder="Коментар..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Збереження..." : "Створити запис"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
