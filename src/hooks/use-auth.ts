import { useMutation } from "@tanstack/react-query";
import { apiLogin, apiRegister, apiForgotPassword, tokenStorage } from "@/lib/api";
import { useStore } from "@/lib/store";

export function useLogin() {
  const signIn = useStore((s) => s.signIn);
  const setTokens = useStore((s) => s.setTokens);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiLogin(email, password),
    onSuccess: (data) => {
      tokenStorage.set(data.accessToken, data.refreshToken);
      setTokens(data.accessToken, data.refreshToken);
      signIn({ name: `${data.user.firstName} ${data.user.lastName}`, email: data.user.email });
    },
  });
}

export function useRegister() {
  const signIn = useStore((s) => s.signIn);
  const setTokens = useStore((s) => s.setTokens);
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) => {
      const parts = name.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ") || parts[0];
      return apiRegister(firstName, lastName, email, password);
    },
    onSuccess: (data) => {
      tokenStorage.set(data.accessToken, data.refreshToken);
      setTokens(data.accessToken, data.refreshToken);
      signIn({ name: `${data.user.firstName} ${data.user.lastName}`, email: data.user.email });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => apiForgotPassword(email),
  });
}
