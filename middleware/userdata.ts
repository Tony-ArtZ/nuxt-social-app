export default defineNuxtRouteMiddleware( async (to, from) => {
  const user = useSupabaseUser();
const client = useSupabaseClient()

const {count, error} = await client.from("users").select('*', {count:"exact", head:true})
  if (!user.value) {
    return navigateTo("/createaccount");
  }
});
