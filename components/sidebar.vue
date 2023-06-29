<script setup>
const props = defineProps({
    sideBarOpen: Boolean,
});
const emmits = defineEmits(["sideBarClose"]);

const user = useSupabaseUser();

const dynamicLinkData = reactive({
    link: user.value ? "/profile" : "/login",
    text: user.value ? "Profile" : "Login",
    symbol: user.value ? "material-symbols:person" : "material-symbols:login"
})

let sideBarClass = computed(() =>
    props.sideBarOpen ? "" : "-translate-x-[100rem]"
);
</script>

<template>
    <div :class="sideBarClass"
        class="bg-sky-950 p-5  transform z-50 w-64 h-screen absolute left-0 top-0 transition-all ease-in-out duration-300">
        <button @click.prevent="$emit('sideBarClose')" class="text-green-400">
            <Icon name="material-symbols:close" size="32" />
        </button>
        <section class="mt-8">
            <!--Home-->
            <NuxtLink to="/"
                class="flex gap-2 items-center first:border-t-2 text-2xl text-green-400 border-b-2 p-2 border-green-400">
                <Icon name="material-symbols:home-outline-rounded" size="24" /> Home
            </NuxtLink>
            <!--Profile if user exists-->
            <NuxtLink v-if="user" :to="`/user/${user.id}`"
                class="flex gap-2 items-center text-2xl first:border-t-2 text-green-400 border-b-2 p-2 border-green-400">
                <Icon name="material-symbols:person" size="24" />Profile
            </NuxtLink>
            <!--Login if no user exists-->
            <NuxtLink v-else to="/login"
                class="flex gap-2 items-center text-2xl first:border-t-2 text-green-400 border-b-2 p-2 border-green-400">
                <Icon name="material-symbols:login" size="24" />Login
            </NuxtLink>

        </section>
    </div>
</template>
