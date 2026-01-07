import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // 1️⃣ Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 2️⃣ Profile state
  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);

    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data);
        setProfileLoading(false);
      });
  }, [session]);

  //to fetch profile after login (after completing profile)
  const refetch = async () => {
    if (!session) return;

    setProfileLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) throw new Error("Error fetching profile!");
    setProfile(data);
    setProfileLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        authLoading,
        profileLoading,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
