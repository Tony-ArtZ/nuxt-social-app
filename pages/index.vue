<script setup>
const router = useRouter()
const user = useSupabaseUser()
const client = useSupabaseClient()

const {data:posts, error} = await client.from("posts").select("*, users(user_name,profile_picture,display_name)").order("created_at", {ascending: false})

console.log(posts, error)

definePageMeta({ middleware: ['userdata'] })
</script>

<template>
  <section class="flex pt-20 overflow-scroll justify-center flex-col">
    <post v-for="post in posts"  :post="post" />
  </section>
</template>
