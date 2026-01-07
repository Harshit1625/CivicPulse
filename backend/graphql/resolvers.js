const resolver = {
  Query: {
    myIssues: async (_, __, { supabase, user }) => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    allIssues: async (_, __, { supabase }) => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  },
  Issue: {
    user: async (parent, __, { supabase }) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id , name , role")
        .eq("id", parent.user_id)
        .maybeSingle();

      console.log("userData: " + data);
      if (error) throw new Error("Error Occurred: " + error.message);
      return data;
    },
  },
  Mutation: {
    createIssue: async (_, args, { supabase, user, io }) => {
      try {
        if (!user) {
          return "User Not Authenticated!";
        }

        const category = args.category.toLowerCase();
        console.log(category);

        const { data: userData, error } = await supabase
          .from("issues")
          .insert({
            user_id: user.user.id,
            category: category,
            description: args.description,
            latitude: args.latitude,
            longitude: args.longitude,
            area: args.area,
            city: args.city,
          })
          .select()
          .single();

        const { data: userDetails } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user_id)
          .single();

        const data = {
          ...userData,
          user: {
            name: userDetails.name,
            id: userDetails.id,
            role: userDetails.role,
          },
        };
        if (error) throw new Error("Error Occurred: " + error.message);
        io.emit("issue_created", data);
        return data;
      } catch (error) {
        return error;
      }
    },

    deleteIssue: async (_, args, { supabase, user, io }) => {
      if (!user) return "User not authenticated!";
      const id = args.id;
      console.log(id);

      const { error } = await supabase.from("issues").delete().eq("id", id);

      if (error) throw new Error("Issue Not Deleted");
      io.emit("issue_removed", id);
      return "Succesfully Removed ";
    },
  },
};

export default resolver;
