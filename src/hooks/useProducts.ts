import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = (search?: string, category?: string) => {
  return useQuery({
    queryKey: ["products", search, category],
    queryFn: async () => {
      let query = supabase
        .from("medicines")
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq("is_active", true);

      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,generic_name.ilike.%${search}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useDoctors = (specialty?: string) => {
  return useQuery({
    queryKey: ["doctors", specialty],
    queryFn: async () => {
      let query = supabase
        .from("doctors")
        .select("*")
        .eq("is_available", true);

      if (specialty) {
        query = query.eq("specialty", specialty);
      }

      const { data, error } = await query.order("rating", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useLabTests = (category?: string) => {
  return useQuery({
    queryKey: ["lab_tests", category],
    queryFn: async () => {
      let query = supabase
        .from("lab_tests")
        .select("*")
        .eq("is_active", true);

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query.order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useHealthPackages = () => {
  return useQuery({
    queryKey: ["health_packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("health_packages")
        .select("*")
        .eq("is_active", true)
        .order("is_popular", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useScanTests = (type?: string) => {
  return useQuery({
    queryKey: ["scan_tests", type],
    queryFn: async () => {
      let query = supabase
        .from("scan_tests")
        .select("*")
        .eq("is_active", true);

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error } = await query.order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUserOrders = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useUserAppointments = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["appointments", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          doctors (
            name,
            specialty,
            profile_image
          )
        `)
        .eq("user_id", userId)
        .order("appointment_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useUserLabBookings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["lab_bookings", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("lab_bookings")
        .select(`
          *,
          lab_tests (
            name,
            category
          ),
          health_packages (
            name
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};
