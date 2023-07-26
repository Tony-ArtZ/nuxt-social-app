<script setup>
definePageMeta({ middleware: ['userdata'] })

const route = useRoute();
const id = route.params.id;
const user = useSupabaseUser();
const client = useSupabaseClient();

//Get User data
const { data, error } = await client.from("users").select("*").eq("id", id);
const {data:posts, error:postError} = await client.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count)").eq("user_id", id).order("created_at", {ascending: false})
console.error(postError)

const userData = ref(data[0]);
</script>

<template>
    <div class="pt-16">
  <div class="bg-neu-yellow-light">
    <div class="relative w-full bg-green-400 h-36">
      <img
        :src="userData.banner_picture"
        class="object-cover w-full h-full border-b-4 border-black"
      />
      <img
        class="absolute object-cover w-20 h-20 rounded-full -bottom-10 drop-shadow-neu-border left-2"
        :src="userData.profile_picture"
      />
    </div>
    <section class="h-24 px-2">
      <div class="float-left">
        <h1 class="mt-12 text-xl font-black text-black">
          {{ userData.display_name }}
        </h1>
        <h6 class="text-sm text-neu-yellow drop-shadow-neu-border">@{{ userData.user_name }}</h6>
      </div>
      <NuxtLink
        v-if="user && user.id === id"
        to="/editaccount"
        class="float-right p-2 mt-12 mr-2 text-sm font-bold text-black border-2 border-black rounded-full bg-neu-green shadow-neu-black transition-all ease-in-out duration-300"
      >
        Edit Profile
      </NuxtLink>      
      <button
        v-else-if="user && user.id !== id"
        class="float-right p-2 px-4 mt-12 mr-2 text-sm font-bold text-black border-2 border-black rounded-full bg-neu-green shadow-neu-black transition-all ease-in-out duration-300"
      >
        Follow
      </button>
    </section>
      <section class="p-4 font-bold text-black border-b-2 border-sky-950">
        {{ userData.description }}
      </section>
</div>
  <section class="flex flex-col justify-center px-4 pt-4 overflow-scroll gap-4">
    <post v-for="post in posts"  :post="post" />
  </section>
</div>
</template>
