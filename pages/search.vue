<script setup>
const route = useRoute();
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const searchQuery = ref(route.query.search);
const { data, error } = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count)").ilike("content", `%${searchQuery.value}%`).order("created_at", { ascending: false })
console.error(error)
let posts = ref(data)
console.log(route.query.search)

console.log(searchQuery.value, posts.value)
watch(()=>route.query.search, async (value) => {
  searchQuery.value = value
  console.log(route.query.search)
  const { data, error } = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count)").ilike("content", `%${value}%`).order("created_at", { ascending: false })
  posts.value = data
})
</script>

<template>
  <section class="flex flex-col justify-center px-4 pt-20 overflow-scroll min-h-screen gap-4">
    <post v-if="posts.length > 0" v-for="post in posts" :post="post" />
    <div class=" p-4 font-bold text-center text-black text-xl transform rotate-12 bg-neu-yellow border-4 border-black rounded-xl shadow-neu-black" v-else>
      Sorry, No results found...
    </div>
  </section>
</template>
