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
import {
  type CreateSourceDto,
  type Currency,
  type Color,
  type SourceType,
  colors,
} from "@/types/sources";
import type { SourceSchemaType } from "./source.schema";
import Step2Bank from "./steps/Step2Bank";
import Step2Cash from "./steps/Step2Cash";
import Step2Crypto from "./steps/Step2Crypto";

import { Step1Type } from "./steps/Step1Type";
import { Separator } from "@/components/ui/separator";
import { useCreateSource } from "@/hooks/useSources";
import { useConnectCrypto } from "@/hooks/useIntegrations";

const pickRandomColor = (): Color =>
  colors[Math.floor(Math.random() * colors.length)].value;

const makeFormDefaults = () => ({
  sourceType: undefined,
  cardConfig: { connectionType: "manual" as const },
  cryptoConfig: { connectionType: "manual" as const },
});

const colorPathByType: Record<SourceType, "color" | "cardConfig.color" | "cryptoConfig.color"> = {
  cash: "color",
  card: "cardConfig.color",
  crypto: "cryptoConfig.color",
  deposit: "color",
};

function buildCreateDto(data: SourceSchemaType): CreateSourceDto | null {
  switch (data.sourceType) {
    case "cash":
      return {
        name: data.name,
        balance: Number(data.balance),
        currency: data.currency,
        color: data.color,
        type: "cash",
      };
    case "card":
      if (data.cardConfig.connectionType === "manual") {
        const c = data.cardConfig;
        return { name: c.name, balance: Number(c.balance), currency: c.currency, color: c.color, type: "card" };
      }
      return {
        name: data.cardConfig.accountName || "Monobank",
        balance: Number(data.cardConfig.accountBalance ?? 0),
        currency: (data.cardConfig.accountCurrency as Currency) || "UAH",
        color: data.cardConfig.color,
        type: "card",
      };
    case "crypto":
      if (data.cryptoConfig.connectionType === "manual") {
        const c = data.cryptoConfig;
        return { name: c.name, balance: Number(c.balance), currency: c.currency, color: c.color, type: "crypto" };
      }
      return null; // crypto через API ще не підтримується
    default:
      return null;
  }
}


export function CreateSourceDialog({ trigger }: { trigger?: React.ReactNode } = {}) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync } = useCreateSource();
  const { currentStep, goNext, goBack, reset, isFirstStep } = useSourceWizard(2);

  const form = useForm<SourceSchemaType>({
    resolver: zodResolver(sourceSchema),
  });

  const {
    resetField,
    watch,
    formState: { isSubmitting },
  } = form;

  const selectedType = watch("sourceType");

  const activeColorValue = selectedType ? watch(colorPathByType[selectedType]) : undefined;
  const activeColorHex = colors.find((c) => c.value === activeColorValue)?.hex;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    setSubmitError(null);
    if (next) {
      form.reset(makeFormDefaults());
    } else {
      reset();
      form.reset();
    }
  };

  const handleTypeSelect = (type: SourceType) => {
    form.setValue(colorPathByType[type], pickRandomColor());
    goNext();
  };

  const renderStepContent = () => {
    if (currentStep === 1) return <Step1Type onTypeSelect={handleTypeSelect} />;

    switch (selectedType) {
      case "card":
        return <Step2Bank />;
      case "cash":
        return <Step2Cash />;
      case "crypto":
        return <Step2Crypto />;
      default:
        return <div>Інші типи ще не реалізовані</div>;
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      setOpen(false);
    } else {
      goBack();
      resetField("sourceType");
    }
  };

  const { mutateAsync: connectCrypto } = useConnectCrypto();
  const onSubmit = async (data: SourceSchemaType) => {
    setSubmitError(null);

    if (data.sourceType === 'crypto' && data.cryptoConfig.connectionType === 'api') {
      try {
        await connectCrypto({
          exchange: data.cryptoConfig.provider,
          apiKey: data.cryptoConfig.apiKey,
          apiSecret: data.cryptoConfig.apiSecret,
        })

        handleOpenChange(false);
      } catch (error) {
        console.log(error)
        setSubmitError("Не вдалося підключити біржу. Перевірте ключі.");
      }
      return;
    }

    const dto = buildCreateDto(data);
    if (!dto) {
      setSubmitError("Цей тип гаманця ще не підтримується.");
      return;
    }

    setSubmitError(null);
    try {
      await mutateAsync(dto);
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to create source", error);
      setSubmitError("Не вдалося створити гаманець. Спробуйте ще раз.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Додати
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="bg-modal overflow-hidden"
        style={
          {
            "--c": activeColorHex || "transparent",
          } as React.CSSProperties
        }
      >
        {/* Заливка, що піднімається знизу */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[72%]
                     transition-[background] duration-700 ease-[cubic-bezier(.4,0,.2,1)]
                     bg-[linear-gradient(to_top,_color-mix(in_srgb,var(--c)_25%,transparent)_0%,_color-mix(in_srgb,var(--c)_10%,transparent)_32%,_color-mix(in_srgb,var(--c)_2%,transparent)_64%,_transparent_100%)]"
        />

        {/* Розмитий glow знизу по центру */}
        <div
          className="pointer-events-none absolute bottom-[-120px] left-1/2 z-0 h-[280px] w-[380px]
                     -translate-x-1/2 blur-[40px]
                     transition-[background] duration-700 ease-[cubic-bezier(.4,0,.2,1)]
                     bg-[radial-gradient(ellipse_at_center,_color-mix(in_srgb,var(--c)_20%,transparent)_0%,_transparent_70%)]"
        />

        <div className="relative z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <DialogHeader>
                <DialogTitle className="font-bold text-[22px]">Новий гаманець</DialogTitle>
                <DialogDescription className="font-normal">
                  Оберіть тип рахунку
                </DialogDescription>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`${currentStep >= 1 ? "bg-wizard-accent" : "bg-border"} h-1 w-full rounded-full transition-colors`}
                  />
                  <span
                    className={`${currentStep === 2 ? "bg-wizard-accent" : "bg-border"} h-1 w-full rounded-full transition-colors`}
                  />
                </div>
              </DialogHeader>

              <div className="grid gap-4 py-1">
                <div className="-mx-6 my-1 ">
                  <Separator orientation="horizontal" className="w-full bg-border" />
                </div>
                {renderStepContent()}
              </div>
              <div className="-mx-6 mt-2 ">
                <Separator orientation="horizontal" className="w-full bg-border" />
              </div>
              {submitError && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {submitError}
                </p>
              )}
              <DialogFooter className="flex flex-row">
                {currentStep > 1 ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleBack}
                      className="flex-1  dark:text-main dark:bg-transparent"
                      variant="outline"
                    >
                      Назад
                    </Button>

                    <Button
                      type="submit"
                      className="flex-2 dark:text-black dark:bg-wizard-accent"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
