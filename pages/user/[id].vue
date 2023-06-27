<script setup>
const route = useRoute();
const id = route.params.id;
const user = useSupabaseUser();
const client = useSupabaseClient();
const { data, error } = await client
    .from("users")
    .select("*")
    .eq("id", user.value.id);
const userData = ref(data[0]);
</script>

<template>
    <div class="pt-24 ">
        <div class="w-full h-36 relative bg-green-400">
            <img class="h-20 w-20 absolute -bottom-10 border-4 border-sky-950 left-2 rounded-full"
                :src="userData.profile_picture" />
        </div>
        <section class="px-2">
            <div class="float-left">
                <h1 class="text-white mt-12 text-2xl font-bold">
                    {{ userData.display_name }}
                </h1>
                <h6 class="text-green-400 text-sm">
                    @{{ userData.user_name }}
                </h6>
            </div>
            <NuxtLink to="/editaccount" class="border-green-400 text-green-400 text-sm mr-2 font-bold border-2 p-2 float-right mt-12 rounded-full hover:bg-green-400 hover:text-slate-800 hover:shadow-glow-green transition-all ease-in-out duration-300">Edit Profile</NuxtLink>
        </section>
    </div>
</template>
