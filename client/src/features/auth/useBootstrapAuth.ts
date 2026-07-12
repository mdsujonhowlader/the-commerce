import { setApiTokenGetter } from "@/lib/api";
import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { meUser, syncUser } from "./api";
import { userAuthStore } from "./store";

export function useBootstapAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { setLoading, setUser, clearAuth, setError } = userAuthStore();

  useEffect(() => {
    setApiTokenGetter(async () => {
      const token = await getToken();

      return token ?? null;
    });
  }, [getToken]);

  useEffect(() => {
    async function run() {
      if (!isLoaded) return;
      if (!isSignedIn) {
        clearAuth();
        return;
      }
      try {
        setLoading();

        await syncUser();
        const me = await meUser();

        setUser(me?.user);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Faild to Load User";
        setError(message);
      }
    }
    void run();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
    setLoading,
    setUser,
    clearAuth,
    setError,
  ]);
}
