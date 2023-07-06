<script setup>
definePageMeta({ middleware: ['userdata'] })

const route = useRoute();
const id = route.params.id;
const user = useSupabaseUser();
const supabase = useSupabaseClient();

//Get User data
const { data, error } = await supabase.from("users").select("*").eq("id", id);

const userData = ref(data[0]);
</script>

<template>
    <div class="px-2 pt-24">
  <div class="border-4 border-black shadow-neu-black bg-neu-green-light">
    <div class="relative w-full bg-green-400 h-36">
      <img
        :src="userData.banner_picture"
        class="object-cover w-full h-full"
      />
      <img
        class="absolute w-20 h-20 rounded-full -bottom-10 drop-shadow-neu-border left-2"
        :src="userData.profile_picture"
      />
    </div>
    <section class="h-24 px-2">
      <div class="float-left">
        <h1 class="mt-12 text-2xl font-bold text-neu-green drop-shadow-neu-border">
          {{ userData.display_name }}
        </h1>
        <h6 class="text-sm text-green-400">@{{ userData.user_name }}</h6>
      </div>
      <NuxtLink
      to="/editaccount"
      class="float-right p-2 mt-12 mr-2 text-sm font-bold text-green-400 border-2 border-green-400 rounded-full hover:bg-green-400 hover:text-slate-800 hover:shadow-glow-green transition-all ease-in-out duration-300"
      >
        Edit Profile
      </NuxtLink>
    </section>
      <section class="p-4 text-white border-b-2 border-sky-950">
        {{ userData.description }}
      </section>
</div>
    </div>
</template>
