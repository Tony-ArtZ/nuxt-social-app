<script setup>
const route = useRoute();
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const searchQuery = ref(route.query.search);
const { data, error } = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count)").ilike("content", `%${searchQuery.value}%`).order("created_at", { ascending: false })
let posts = ref(data)
console.log(route.query.search)

console.log(searchQuery.value, posts.value)
watch(()=>route.query.search, async (value) => {
  searchQuery.value = value
  console.log(route.query.search)
  const { data, error } = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count)").ilike("content", `%${value}%`).order("created_at", { ascending: false })
  posts.value = data
})
</script>

<template>
  <section class="flex flex-col justify-center pt-20 overflow-scroll">
    <post v-if="posts.length > 0" v-for="post in posts" :post="post" />
    <div class="text-white font-bold p-4 text-center" v-else>
      Sorry, No results found...
    </div>
  </section>
</template>