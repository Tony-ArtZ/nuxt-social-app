<script setup>
const route = useRoute();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const searchQuery = ref(route.query.search);
let loading = ref(false)

//TODO: Add single function for getting posts
const { data, error } = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count)").ilike("content", `%${searchQuery.value}%`).order("created_at", { ascending: false })

let posts = ref(data)

watch(()=>route.query.search, async (value) => {
  loading.value = true;
  searchQuery.value = value
  console.log(route.query.search)
  const { data, error } = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count)").ilike("content", `%${value}%`).order("created_at", { ascending: false })
  loading.value = false;
  posts.value = data;
})

</script>

<template>
  <section class="flex flex-col min-h-screen px-4 pt-20 overflow-scroll gap-4">
    <div v-if="loading" class="grid place-items-center">
      <loadingSpinner/>
    </div>
    <div v-else>
      <post v-if="posts.length > 0" v-for="post in posts" :post="post" />
      <div  class="p-4 mt-16 text-xl font-bold text-center text-black border-4 border-black transform rotate-12 bg-neu-yellow rounded-xl shadow-neu-black" v-else>
        Sorry, No results found...
      </div>
    </div>
  </section>
</template>
