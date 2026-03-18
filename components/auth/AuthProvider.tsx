import type { PropsWithChildren } from "react";
import { createContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

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

  const loadProfileState = async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("email, full_name, sport_type, onboarding_completed")
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
      name: data?.full_name ?? currentValue.name,
      sport: (data?.sport_type as SnowSportType | undefined) ?? currentValue.sport
    }));
    setHasCompletedOnboarding(Boolean(data?.onboarding_completed));
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
      setOnboardingDraft({
        email: "",
        name: "",
        sport: "ski"
      });
    },
    updateOnboardingDraft: (draft) => {
      setOnboardingDraft((currentValue) => ({
        ...currentValue,
        ...draft
      }));
    },
    saveOnboardingProfile: async () => {
      if (!session?.user.id) {
        throw new Error("No active Supabase session. Complete email confirmation or sign in again.");
      }

      if (!onboardingDraft.email && !session.user.email) {
        throw new Error("Missing email for onboarding profile.");
      }

      if (!onboardingDraft.name.trim()) {
        throw new Error("Name is required before finishing onboarding.");
      }

      const generatedUsername = (onboardingDraft.email || session.user.email || `user-${session.user.id}`)
        .split("@")[0]
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .slice(0, 24);

      const payload = {
        id: session.user.id,
        email: onboardingDraft.email || session.user.email || "",
        username: generatedUsername || `user_${session.user.id.slice(0, 8)}`,
        full_name: onboardingDraft.name.trim(),
        sport_type: onboardingDraft.sport,
        onboarding_completed: true
      };

      console.log("[onboarding] saving profile", payload);

      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" })
        .select("id, email, full_name, sport_type, created_at, onboarding_completed")
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
      setHasCompletedOnboarding(true);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
