<script setup>
const props = defineProps({
    sideBarOpen: Boolean,
});

//function call on when the "X" button is pressed 
const emmits = defineEmits(["sideBarClose"]);

const user = useSupabaseUser();

// If closed then move sidebar off screen using reactive vue class bind 
let sideBarClass = computed(() =>
    props.sideBarOpen ? "" : "-translate-x-[100rem]"
);
</script>

<template>
    <div :class="sideBarClass"
        class="absolute top-0 left-0 z-50 w-64 h-screen p-5 bg-neu-yellow-light transform transition-all ease-in-out duration-300">
        <button @click.prevent="$emit('sideBarClose')" class="text-neu-green drop-shadow-neu-border">
            <Icon name="material-symbols:close" size="32" />
        </button>
        <section class="mt-8">
            <!--Home-->
            <NuxtLink to="/"
                class="flex items-center p-2 mb-4 text-2xl text-black bg-white border-2 border-black shadow-neu-border gap-2 first:border-t-2">
                <Icon class="text-neu-green drop-shadow-neu-border" name="material-symbols:home" size="24" /> Home
            </NuxtLink>
            <!--Profile if user exists-->
            <NuxtLink v-if="user" :to="`/user/${user.id}`"
                class="flex items-center p-2 text-2xl text-black bg-white border-2 border-black shadow-neu-border gap-2 first:border-t-2">
                <Icon class="text-neu-yellow drop-shadow-neu-border" name="material-symbols:person" size="24" />Profile
            </NuxtLink>
            <!--Login if no user exists-->
            <NuxtLink v-else to="/login"
                class="flex items-center p-2 text-2xl text-black bg-white border-2 border-black shadow-neu-border gap-2 first:border-t-2">
                <Icon class="text-neu-yellow drop-shadow-neu-border" name="material-symbols:login" size="24" />Login
            </NuxtLink>

        </section>
    </div>
</template>
