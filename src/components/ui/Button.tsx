type Props = React.ComponentProps<"a"> & { variant?: "primary" | "secondary" };

export function Button({ variant = "primary", className = "", ...rest }: Props) {
  const style =
    variant === "primary"
      ? "bg-teal text-abyss border-teal"
      : "border-teal/50 text-teal hover:border-teal";
  return <a className={`inline-block border-[1.5px] px-4 py-2.5 font-medium ${style} ${className}`} {...rest} />;
}
