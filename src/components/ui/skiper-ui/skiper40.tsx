import * as React from "react";
import { cn } from "@/src/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
}

// Link000 — no animation
export function Link000({ children, className, ...props }: LinkProps) {
  return (
    <a className={cn("inline-flex", className)} {...props}>
      {children}
    </a>
  );
}

// Link001 — underline expands left to right on hover
export function Link001({ children, className, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "relative inline-flex after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// Link002 — underline contracts right to left on hover
export function Link002({ children, className, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "relative inline-flex after:absolute after:bottom-0 after:right-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// Link003 — underline expands from center outward on hover
export function Link003({ children, className, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "relative inline-flex after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-current after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// Link004 — icon slides in from left on hover, text shifts right
export function Link004({ children, className, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "group relative inline-flex items-center gap-0 overflow-hidden",
        className
      )}
      {...props}
    >
      <span className="inline-block -translate-x-full opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
      <span className="inline-block transition-transform duration-300 ease-in-out group-hover:translate-x-1">
        {children}
      </span>
    </a>
  );
}

// Link005 — blend mode invert effect on hover
export function Link005({ children, className, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "group relative inline-flex cursor-pointer select-none items-center",
        className
      )}
      {...props}
    >
      <span className="relative z-10 mix-blend-difference">{children}</span>
      <span
        className="absolute inset-0 scale-x-0 bg-current transition-transform duration-300 ease-in-out origin-left group-hover:scale-x-100"
        aria-hidden
      />
    </a>
  );
}
