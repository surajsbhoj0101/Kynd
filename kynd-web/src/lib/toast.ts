import { toast } from "sonner";

/**
 * Modern notification utility wrapping Sonner toasts.
 */
export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  promise: <T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
  ) => {
    return toast.promise(promise, msgs);
  },
};

export { notify as toast };
