import type { PropsWithChildren } from "react";
import { createContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/lib/supabase";
import type { SnowSportType } from "@/models/profile";

type SignUpResult = {
  needsEmailConfirmation: boolean;
};

type OnboardingDraft = {
  email: string;
  name: string;
  sport: SnowSportType;
};

const ONBOARDING_DRAFT_STORAGE_KEY = "peakpartner:onboarding-draft";

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  onboardingDraft: OnboardingDraft;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  updateOnboardingDraft: (draft: Partial<OnboardingDraft>) => void;
  saveOnboardingProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>({
    email: "",
    name: "",
    sport: "ski"
  });

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const storedDraft = await AsyncStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
      if (storedDraft && isMounted) {
        try {
          const parsedDraft = JSON.parse(storedDraft) as Partial<OnboardingDraft>;
          setOnboardingDraft((currentValue) => ({
            ...currentValue,
            ...parsedDraft
          }));
        } catch (error) {
          console.error("[onboarding] failed to parse stored draft", error);
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("[auth] getSession failed", error);
      }

      setSession(data.session);
      setOnboardingDraft((currentValue) => ({
        ...currentValue,
        email: data.session?.user.email ?? currentValue.email
      }));

      if (data.session?.user.id) {
        await loadProfileState(data.session.user.id, data.session.user.email ?? "");
      } else {
        setHasCompletedOnboarding(false);
        setIsLoading(false);
      }
    };

    void bootstrap();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setOnboardingDraft((currentValue) => ({
        ...currentValue,
        email: nextSession?.user.email ?? currentValue.email
      }));

      if (nextSession?.user.id) {
        void loadProfileState(nextSession.user.id, nextSession.user.email ?? "");
      } else {
        setHasCompletedOnboarding(false);
        setIsLoading(false);
      }

      if (!nextSession) {
        setHasCompletedOnboarding(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(onboardingDraft));
  }, [onboardingDraft]);

  const loadProfileState = async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, sport, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("[onboarding] load profile failed", error);
      setHasCompletedOnboarding(false);
      setIsLoading(false);
      return;
    }

    setOnboardingDraft((currentValue) => ({
      email: data?.email ?? email,
      name: (data?.name as string | undefined) ?? currentValue.name,
      sport: (data?.sport as SnowSportType | undefined) ?? currentValue.sport
    }));
    setHasCompletedOnboarding(Boolean(data?.id));
    setIsLoading(false);
  };

  const value: AuthContextValue = {
    session,
    isLoading,
    hasCompletedOnboarding,
    onboardingDraft,
    signIn: async (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();

      console.log("[auth] signIn attempt", { email: normalizedEmail });
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      if (error) {
        console.error("[auth] signIn failed", {
          message: error.message,
          name: error.name,
          status: "status" in error ? error.status : undefined,
          code: "code" in error ? error.code : undefined,
          error
        });
        throw error;
      }
    },
    signUp: async (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();

      console.log("[auth] signUp attempt", { email: normalizedEmail });

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password
      });

      if (error) {
        console.error("[auth] signUp failed", {
          message: error.message,
          name: error.name,
          status: "status" in error ? error.status : undefined,
          code: "code" in error ? error.code : undefined,
          error
        });
        throw error;
      }

      console.log("[auth] signUp success", {
        userId: data.user?.id,
        sessionPresent: Boolean(data.session)
      });

      setOnboardingDraft((currentValue) => ({
        ...currentValue,
        email: normalizedEmail
      }));

      return {
        needsEmailConfirmation: !data.session
      };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      const clearedDraft = {
        email: "",
        name: "",
        sport: "ski"
      } satisfies OnboardingDraft;
      setOnboardingDraft(clearedDraft);
      await AsyncStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
    },
    updateOnboardingDraft: (draft) => {
      setOnboardingDraft((currentValue) => ({
        ...currentValue,
        ...draft
      }));
    },
    saveOnboardingProfile: async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("[onboarding] getUser failed", userError);
        throw userError;
      }

      if (!user?.id) {
        throw new Error("No authenticated user found. Sign in again and retry onboarding.");
      }

      if (!onboardingDraft.email && !user.email) {
        throw new Error("Missing email for onboarding profile.");
      }

      if (!onboardingDraft.name.trim()) {
        throw new Error("Name is required before finishing onboarding.");
      }

      const payload = {
        id: user.id,
        email: onboardingDraft.email || user.email || "",
        name: onboardingDraft.name.trim(),
        sport: onboardingDraft.sport
      };

      console.log("[onboarding] saving profile", payload);

      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" })
        .select("id, email, name, sport, created_at")
        .single();

      if (error) {
        console.error("[onboarding] save profile failed", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          error
        });
        throw error;
      }

      console.log("[onboarding] profile saved", data);
      const nextDraft = {
        email: data.email ?? payload.email,
        name: data.name ?? payload.name,
        sport: (data.sport as SnowSportType | undefined) ?? payload.sport
      } satisfies OnboardingDraft;
      setOnboardingDraft(nextDraft);
      await AsyncStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));
      setHasCompletedOnboarding(true);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
