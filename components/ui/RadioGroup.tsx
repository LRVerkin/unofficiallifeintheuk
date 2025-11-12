import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const RadioGroup = RadioGroupPrimitive.Root;

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { label: string }
>(({ className, label, ...props }, ref) => (
  <label className="flex items-center gap-3 text-sm">
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-border,#cbd5f5)] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary data-[state=checked]:border-brand-primary",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
    </RadioGroupPrimitive.Item>
    <span>{label}</span>
  </label>
));
RadioGroupItem.displayName = "RadioGroupItem";
