import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "header" | "footer" | "main" | "article" | "nav" | "aside";
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

const sizeMap: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export function Container({
  as: Tag = "div",
  size = "lg",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-10", sizeMap[size], className)} {...rest}>
      {children}
    </Tag>
  );
}
