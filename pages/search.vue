<script setup>
const route = useRoute();
const id = route.params.id;
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const searchQuery = ref(route.query.search);
const {data, error} = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count)").ilike("content", `%${searchQuery.value}%`).order("created_at", {ascending: false})
let posts = ref(data)

console.log(searchQuery.value, posts.value )
watch(searchQuery.value, async (value) => {
    const {data, error} = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count)").ilike("content", `%${value}%`).order("created_at", {ascending: false})
    posts.value = data
})
</script>

<template>
  <section class="flex flex-col justify-center pt-20 overflow-scroll">
    <post v-for="post in posts"  :post="post" />
  </section>
</template>