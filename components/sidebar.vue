<script setup>
const props = defineProps({
    sideBarOpen: Boolean,
});

//function call on when the "X" button is pressed 
const emmits = defineEmits(["sideBarClose"]);

const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const userData = ref();

if (user.value) {
    const { data, error } = await supabase.from("users").select("*");
    userData.value = data[0];
    console.log(userData.value)
}
// If closed then move sidebar off screen using reactive vue class bind 
let sideBarClass = computed(() =>
    props.sideBarOpen ? "" : "-translate-x-[100rem]"
);

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
}

const logIn = () => {
    router.push("/login");
}

const openUserProfile = () => {
    router.push(`/user/${user.value.id}`);
}
</script>

<template>
    <div :class="sideBarClass"
        class="absolute top-0  drop-shadow-2xl left-0 z-50 w-64 h-screen p-5 bg-neu-yellow-light transform transition-all ease-in-out duration-300">
        <button @click.prevent="$emit('sideBarClose')" class="text-neu-green drop-shadow-neu-border">
            <Icon name="material-symbols:close" size="32" />
        </button>
        <section v-if="userData" @click="openUserProfile" class="flex mt-8 flex-row">
            <div class="h-full">
                <img :src="userData.profile_picture"
                    class="rounded-full w-16 aspect-square object-cover border-neu-green drop-shadow-neu-border border-2" />
            </div>
            <div class="h-full pl-4 flex justify-center flex-col">
                <h2 class="text-black font-bold text-xl">
                    {{ userData.display_name }}
                </h2>
                <h4 class="text-neu-yellow text-sm drop-shadow-neu-border">
                    @{{ userData.user_name }}
                </h4>
            </div>
        </section>
        <section class="mt-8 border-t-2 border-black py-8">
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
        <section class="w-full py-2 border-t-2 border-black mt-4 border-solid">
            <div class="w-full">
                <button @click="signOut" v-if="user"
                    class="text-lg float-right flex items-center gap-2 text-neu-green drop-shadow-neu-border">SignOut
                    <Icon class="text-neu-green drop-shadow-neu-border" name="ph:sign-out-fill" size="24" />
                </button>
                <button @click="logIn" v-if="!user"
                    class="text-lg float-right flex items-center gap-2 text-neu-green drop-shadow-neu-border">LogIn
                    <Icon class="text-neu-green drop-shadow-neu-border" name="ph:sign-in-fill" size="24" />
                </button>
            </div>
        </section>
    </div>
</template>
