import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type StatusMessageProps = {
  type: "error" | "success" | "info";
  children: string;
};

export function StatusMessage({ type, children }: StatusMessageProps) {
  const Icon = type === "error" ? AlertCircle : type === "success" ? CheckCircle2 : Info;

  return (
    <div className={`status ${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon size={18} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
