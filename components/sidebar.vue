<script setup>
const props = defineProps({
    sideBarOpen: Boolean,
});
const emmits = defineEmits(["sideBarClose"]);

const user = useSupabaseUser();

let sideBarClass = computed(() =>
    props.sideBarOpen ? "" : "-translate-x-[100rem]"
);
</script>

<template>
    <div
        :class="sideBarClass"
        class="bg-sky-950 p-5 pl-12 transform z-20 w-96 h-screen absolute left-0 top-0 transition-all ease-in-out duration-300"
    >
        <button @click.prevent="$emit('sideBarClose')" class="text-green-400">
            <Icon name="material-symbols:close" size="32" />
        </button>
        <section>
            <NuxtLink v-if="user" to="/profile">Profile</NuxtLink>
            <NuxtLink v-else to="/login">Login</NuxtLink>
        </section>
    </div>
</template>
