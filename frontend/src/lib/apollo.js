import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { supabase } from "./supabase";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL,
});

const authLink = new SetContextLink(async ({ headers }) => {
  const { data } = await supabase.auth.getSession();

  return {
    headers: {
      ...headers,
      authorization: data.session ? `Bearer ${data.session.access_token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
