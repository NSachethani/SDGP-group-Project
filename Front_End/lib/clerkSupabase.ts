import { useSession } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export function useClerkSupabaseClient() {
  const { session } = useSession();
  const SUPABASE_URL = "https://ecleafwuvusbyrzcuypi.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGVhZnd1dnVzYnlyemN1eXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk4NTksImV4cCI6MjA1NzYyNTg1OX0.0dIH_SM50-zdKH1Or07_dRwEOOIe7YjDxe9ttqHsuq4";

  const supabase = createClient(SUPABASE_URL || "", SUPABASE_KEY || "", {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await session?.getToken({ template: "supabase" });
        const headers = new Headers(options?.headers);
        if (clerkToken) {
          headers.set("Authorization", `Bearer ${clerkToken}`);
        }
        return fetch(url, { ...options, headers });
      },
    },
    auth: {
      storage: AsyncStorage,
    },
  });

  return supabase;
}
