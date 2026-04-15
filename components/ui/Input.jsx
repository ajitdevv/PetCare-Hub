import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(function Input({ className, label, error, ...props }, ref) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? <label className="text-sm font-medium text-gray-700">{label}</label> : null}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900",
          "outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error ? <span className="text-sm text-red-500">{error}</span> : null}
    </div>
  );
});
