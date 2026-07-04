import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useFormState, type Control, type FieldValues, } from "react-hook-form";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-[#283029] dark:border-[#283029] light:border-[#e2ebdd] border-dashed bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        filter:
          "border border-border rounded-[1.25rem] bg-input text-muted hover:bg-input-hover hover:text-foreground transition-all",
        active:
          "border border-foreground bg-foreground text-background rounded-[1.25rem] transition-all",
        wallet:
          "flex flex-col gap-2 h-24 w-28 rounded-2xl bg-input text-muted-foreground border border-transparent hover:bg-input-hover hover:text-foreground transition-all data-[state=on]:border-wizard-accent data-[state=on]:bg-input-active",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function SubmitButton<TFieldValues extends FieldValues = FieldValues>({ control, children, pendingText, className, }: { control: Control<TFieldValues>, children?: React.ReactNode, className?: string, pendingText?: string }) {
  const { isValid, isSubmitting } = useFormState({ control })
  return (
    <Button type="submit" disabled={!isValid || isSubmitting} className={className}>
      {isSubmitting ? pendingText : children}
    </Button>
  )
}

export { Button, buttonVariants, SubmitButton };
