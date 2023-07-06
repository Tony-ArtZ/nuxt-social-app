<script setup>
definePageMeta({ middleware: ['userdata'] })

const router = useRouter()
const user = useSupabaseUser()
const client = useSupabaseClient()

const {data:posts, error} = await client.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count)").order("created_at", {ascending: false})

definePageMeta({ middleware: ['userdata'] })
</script>

<template>
  <section class="flex flex-col justify-center px-4 pt-20 overflow-scroll gap-4">
    <post v-for="post in posts"  :post="post" />
  </section>
</template>
