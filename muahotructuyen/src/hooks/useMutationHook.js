import { useMutation } from "@tanstack/react-query";

export const useMutationHooks = (callBack) => {
  const mutation = useMutation({
    mutationFn: callBack
  });
  return mutation
};
