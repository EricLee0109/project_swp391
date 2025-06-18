import { toast } from "sonner"

type ToastType = "success" | "error" 

export const notify = (type: ToastType, message: string) => {
  const baseStyle = {
    border: "1px solid",
    borderRadius: "0.75rem",
    padding: "1rem",
    fontWeight: 500,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  }

  switch (type) {
    case "success":
      toast.success(message, {
        style: {
          ...baseStyle,
          background: "var(--toast-success-bg)",
          color: "var(--toast-success-text)",
          borderColor: "var(--toast-success-text)",
        },
   
      })
      break

    case "error":
      toast.error(message, {
        style: {
          ...baseStyle,
          background: "var(--toast-error-bg)",
          color: "var(--toast-error-text)",
          borderColor: "var(--toast-error-text)",
        },
      
      })
      break

    
  }
}
