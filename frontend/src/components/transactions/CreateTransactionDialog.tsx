import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { CalendarIcon, Plus, ArrowDownLeft, ArrowUpRight, ArrowRightLeft, XIcon } from "lucide-react";

import { type CreateTransactionDto, type Source, TransactionType } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { Button, SubmitButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getSources } from "@/api/sources";
import { formSchema, type FormValues, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./transaction.schema";
import SourceSelect from "./SourceSelect";
import { useCreateTransaction } from "@/hooks/useTransactions";

interface CreateTransactionDialogProps {
  trigger?: React.ReactNode;
  defaultType?: TransactionType;
}

const TRANSACTION_TYPE_OPTIONS = [
  {
    type: TransactionType.INCOME, icon: ArrowDownLeft, label: "Дохід", activeClass: "border-type-income bg-type-income/5 text-type-income"
  },
  {
    type: TransactionType.EXPENSE, icon: ArrowUpRight, label: "Витрата", activeClass: "border-type-expense bg-type-expense/5 text-type-expense"
  },
  {
    type: TransactionType.TRANSFER, icon: ArrowRightLeft, label: "Переказ", activeClass: "border-type-transfer bg-type-transfer/5 text-type-transfer"
  }
]

export function CreateTransactionDialog({
  trigger,
  defaultType = TransactionType.EXPENSE
}: CreateTransactionDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const getDefaultValues = (type: TransactionType): FormValues => ({
    amount: 0,
    type,
    category: type === TransactionType.INCOME ? INCOME_CATEGORIES[0].name : EXPENSE_CATEGORIES[0].name,
    description: "",
    date: new Date(),
    sourceId: "",
    destinationSourceId: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(defaultType),
    mode: "onChange",
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      reset(getDefaultValues(defaultType));
      getSources().then(setSources).catch(console.error);
    }
  };

  const { watch, formState, control, handleSubmit, reset, getValues, setValue, setError } = form;
  const { errors } = formState;

  // Слідкуємо за типом транзакції, щоб показувати/ховати поля
  const transactionType = watch("type");
  const sourceId = useWatch({ control, name: "sourceId" })
  const categories = transactionType === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    const category =
      newType === TransactionType.TRANSFER
        ? "Переказ"
        : (() => {
          const currentCategory = getValues("category");
          const currentList = newType === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
          return currentList.some((c) => c.name === currentCategory)
            ? currentCategory
            : currentList[0].name;
        })();

    setValue("type", newType, { shouldValidate: true });
    setValue("category", category, { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: CreateTransactionDto = {
        amount: values.amount,
        type: values.type,
        category: values.category || "",
        description: values.description,
        date: values.date,
        sourceId: values.sourceId,
        destinationSourceId:
          values.type === TransactionType.TRANSFER
            ? values.destinationSourceId
            : undefined,
      };

      await createTransaction(payload);

      setOpen(false);
      reset();
    } catch (error) {
      setError('root', { type: "error", message: "Не вдалося додати транзакцію." })
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={"outline"}>
            <Plus className="mr-2 h-4 w-4" /> Додати запис
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-modal border-border rounded-3xl p-6 gap-0" showCloseButton={false}>
        <DialogClose className="absolute top-6 right-6 w-9 h-9 rounded-full bg-input border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10">
          <XIcon className="w-4 h-4" />
        </DialogClose>

        <DialogHeader className="mb-6 flex flex-col gap-1">
          <DialogTitle className="text-2xl font-bold text-foreground">Нова транзакція</DialogTitle>
          <p className="text-xs text-muted-foreground font-light">Запишіть операцію в історію</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Тип транзакції */}
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">
                    Тип транзакції
                  </FormLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {TRANSACTION_TYPE_OPTIONS.map(({ type, icon, label, activeClass }) => {
                      const Icon = icon;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleTypeChange(type)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer h-16",
                            field.value === type
                              ? activeClass
                              : "border-border bg-input text-muted-foreground hover:bg-input-hover hover:text-foreground"
                          )}
                        >
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-xs font-semibold">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />

            {/* Дата та Звідки списати */}
            <div className="grid grid-cols-2 gap-4">
              {/* Дата */}
              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">
                      Дата
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"active"}
                            className={cn(
                              "w-full h-12 bg-input border-border rounded-xl px-4 text-left font-normal text-foreground hover:bg-input-hover hover:text-foreground flex items-center justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Оберіть дату</span>
                            )}
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-modal border-border" align="start">
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

              {/* Звідки списати / Куди зарахувати */}
              <SourceSelect
                control={control}
                name="sourceId"
                label={transactionType === TransactionType.INCOME ? "Куди зарахувати" : "Звідки списати"}
                sources={sources}
              />
            </div>

            {/* Сума та Категорія / Переказ */}
            <div className="grid grid-cols-2 gap-4">
              {/* Сума */}
              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">
                      Сума
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.00"
                          className="h-12 bg-input border-border rounded-xl pl-4 pr-10 text-foreground focus-visible:ring-0 focus-visible:border-border w-full"
                          {...field}
                          value={Number.isNaN(field.value) ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          onFocus={() => {
                            if (field.value === 0) {
                              field.onChange(NaN);
                            }
                          }}
                          onBlur={() => {
                            if (Number.isNaN(field.value)) {
                              field.onChange(0);
                            }
                          }}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 font-medium">₴</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {transactionType === TransactionType.TRANSFER ? (
                <>
                  {/* Куди переказати */}
                  <SourceSelect
                    control={control}
                    name="destinationSourceId"
                    label="Куди переказати"
                    sources={sources}
                    excludeId={sourceId}
                  />

                </>
              ) : (
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">
                        Категорія
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border rounded-xl px-4 text-foreground focus-visible:ring-0">
                            <SelectValue placeholder="Оберіть категорію">
                              {field.value && (
                                <div className="flex items-center gap-2">
                                  <span className={cn("w-2 h-2 rounded-full", transactionType === TransactionType.INCOME ? "bg-type-income" : "bg-type-expense")} />
                                  <span>{field.value}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border">
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category.name} className="focus:bg-input-active focus:text-foreground">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", transactionType === TransactionType.INCOME ? "bg-type-income" : "bg-type-expense")} />
                                <span>{category.name}</span>
                              </div>
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

            {/* Опис */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold">
                      Опис
                    </FormLabel>
                    <span className="text-[10px] text-muted-foreground/40 font-light">необов'язково</span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Коментар до транзакції..."
                      className="h-12 bg-input border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.root && (
              <p className="text-red-500">{errors.root.message}</p>
            )}

            {/* Кнопки Дій */}
            <div className="grid grid-cols-[1fr_1.8fr] gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-11 rounded-xl border-border bg-transparent text-foreground font-semibold hover:bg-input hover:text-foreground transition-colors cursor-pointer"
              >
                Скасувати
              </Button>

              <SubmitButton
                control={control}
                pendingText="Додається..."
                className={cn(
                  "h-11 rounded-xl font-semibold transition-all duration-200 cursor-pointer",
                  !isPending
                    ? "bg-primary hover:bg-[#b4d46b] text-primary-foreground"
                    : "bg-input-hover border border-border text-foreground-subtle cursor-not-allowed"
                )}
              >
                Додати запис
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
