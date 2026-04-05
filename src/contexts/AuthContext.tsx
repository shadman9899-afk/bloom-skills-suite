import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching profile:", error);
        setProfile(null);
      } else {
        console.log("👤 Profile loaded:", data);
        setProfile(data);
      }
    } catch (err) {
      console.error("❌ Profile fetch failed:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log("🔐 Initializing Supabase auth...");

    let isMounted = true;

    // Get initial session FIRST
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;

      if (error) {
        console.error("❌ Error getting session:", error);
      }

      console.log("🔐 Initial session:", session);
      setSession(session);

      if (session?.user) {
        fetchProfile(session.user.id);
      }

      setLoading(false);
    });

    // Then listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔐 Auth state changed:", event);

        if (!isMounted) return;

        setSession(session);

        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const signOut = async () => {
    console.log("🚪 Signing out user...");
    try {
      await supabase.auth.signOut();
      setProfile(null);
      console.log("✅ User signed out successfully");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ session, user: session?.user || null, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
