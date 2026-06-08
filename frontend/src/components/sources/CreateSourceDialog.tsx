import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSourceWizard } from "@/hooks/useSourceWizard";
import { sourceSchema } from "./source.schema";
import { type CreateSourceDto, type Source, type Currency } from "@/types/sources";
import type { SourceSchemaType } from "./source.schema";
import Step2Bank from "./steps/Step2Bank";
import Step2Cash from "./steps/Step2Cash";
import Step2Crypto from "./steps/Step2Crypto";

import { Step1Type } from "./steps/Step1Type";
import { Separator } from "@/components/ui/separator";
import { createSource } from "@/api/sources";

interface CreateSourceDialogProps {
  onSuccess: (newSource: Source) => void;
}

export function CreateSourceDialog({ onSuccess }: CreateSourceDialogProps) {
  const [open, setOpen] = useState(false);
  const { currentStep, goNext, goBack, reset, isFirstStep } = useSourceWizard(2);

  const form = useForm<SourceSchemaType>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      sourceType: undefined,
    },
  });
  const {
    resetField,
    watch,
    formState: { isSubmitting },
  } = form;

  const selectedType = watch("sourceType");

  const renderStepContent = () => {
    if (currentStep === 1) return <Step1Type onNextStep={goNext} />;

    switch (selectedType) {
      case "card":
        return <Step2Bank />;
      case "deposit":
        return <div>Step 2: Deposit</div>;
      case "cash":
        return <Step2Cash />;
      case "crypto":
        return <Step2Crypto />;
      default:
        return <div>Інші типи ще не реалізовані</div>;
    }
  };

  const handleClick = () => {
    if (isFirstStep) {
      setOpen(false);
    } else {
      goBack();
      resetField("sourceType");
    }
  };

  const onSubmit = async (data: SourceSchemaType) => {
    if (data.sourceType === "card") {
      let dto: CreateSourceDto | null = null;

      if (data.cardConfig.connectionType === "manual") {
        dto = {
          name: data.cardConfig.name,
          balance: data.cardConfig.balance,
          currency: data.cardConfig.currency,
          color: data.cardConfig.color,
          type: data.sourceType,
        };
      } else if (data.cardConfig.connectionType === "api") {
        dto = {
          name: data.cardConfig.accountName || "Monobank",
          balance: data.cardConfig.accountBalance ?? 0,
          currency: (data.cardConfig.accountCurrency as Currency) || "UAH",
          color: data.cardConfig.color,
          type: data.sourceType,
        };
      }

      if (dto) {
        try {
          const newSource = await createSource(dto);
          onSuccess(newSource);
          setOpen(false);
          form.reset();
          reset();
        } catch (error) {
          console.error("Failed to create source", error);
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Додати
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#15151a]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <DialogHeader>
              <DialogTitle className="font-bold text-[22px]">Новий гаманець</DialogTitle>
              <DialogDescription className="font-normal">
                Оберіть тип рахунку
              </DialogDescription>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`${currentStep >= 1 ? "bg-[#f0b90b]" : "bg-[#22222a]"} h-1 w-full rounded-full transition-colors`}
                />
                <span
                  className={`${currentStep === 2 ? "bg-[#f0b90b]" : "bg-[#22222a]"} h-1 w-full rounded-full transition-colors`}
                />
              </div>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              <div className="-mx-6 my-1 ">
                <Separator orientation="horizontal" className="w-full bg-[#22222a]" />
              </div>
              {renderStepContent()}
            </div>
            <div className="-mx-6 mt-2 ">
              <Separator orientation="horizontal" className="w-full bg-[#22222a]" />
            </div>
            <DialogFooter className="flex flex-row">
              {currentStep > 1 ? (
                <>
                  <Button
                    type="button"
                    onClick={handleClick}
                    className="flex-1  dark:text-main dark:bg-transparent"
                    variant="outline"
                  >
                    Назад
                  </Button>

                  <Button
                    type="submit"
                    className="flex-2 dark:text-black dark:bg-[#f0b90b] "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Створення..." : "Створити"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-4 dark:text-main dark:bg-transparent"
                  variant="outline"
                >
                  Скасувати
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
