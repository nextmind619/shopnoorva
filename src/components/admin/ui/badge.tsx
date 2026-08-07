import { cn } from "@/lib/utils";

const variants = {
  default: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  error: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  gold: "bg-gold/10 text-gold-dark dark:bg-gold/20 dark:text-gold-light",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
