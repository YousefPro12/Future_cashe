import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle, AlertTriangle, InfoIcon, CheckCircle } from "lucide-react";

const Alert = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  icon,
  ...props 
}, ref) => {
  const variantClasses = {
    default: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200",
    destructive: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:border-red-900 dark:text-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200",
    success: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:border-green-900 dark:text-green-200"
  };

  const defaultIcons = {
    default: <InfoIcon className="h-4 w-4" />,
    destructive: <AlertCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />
  };

  const IconComponent = icon || defaultIcons[variant];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative flex w-full items-center gap-3 rounded-md border p-4 text-sm",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {IconComponent && (
        <div className="flex-shrink-0">
          {IconComponent}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
});

Alert.displayName = "Alert";

export { Alert };
