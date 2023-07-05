export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  if (user.value) {
    const { count, error } = await client
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("id", user.value.id);
    if (count <= 0 || !count) {
      return navigateTo("/createaccount");
    }
  }
});
