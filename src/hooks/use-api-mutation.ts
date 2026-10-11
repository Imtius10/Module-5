"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";

/**
 * Wraps common mutations so every call site gets consistent
 * success/error toast feedback (mandatory UI error handling).
 */
export function useApiMutation<TInput, TOutput>(options: {
  mutationFn: (input: TInput) => Promise<TOutput>;
  successMessage?: string | ((result: TOutput) => string);
  errorMessage?: string | ((error: unknown) => string);
  invalidate?: string[][];
  onSuccess?: (result: TOutput, input: TInput) => void | Promise<void>;
  onError?: (error: unknown, input: TInput) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<TOutput, unknown, TInput>({
    mutationFn: options.mutationFn,
    onSuccess: async (result, input) => {
      if (options.invalidate) {
        for (const key of options.invalidate) {
          await queryClient.invalidateQueries({ queryKey: key });
        }
      }
      const message =
        typeof options.successMessage === "function"
          ? options.successMessage(result)
          : options.successMessage;
      if (message) toast.success(message);
      await options.onSuccess?.(result, input);
    },
    onError: (error, input) => {
      const message =
        (typeof options.errorMessage === "function"
          ? options.errorMessage(error)
          : options.errorMessage) || errorMessage(error);
      toast.error(message);
      options.onError?.(error, input);
    },
  });
}

export { api };
