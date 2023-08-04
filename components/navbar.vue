<script setup>
let user = useSupabaseUser()
const router = useRouter()
const client = useSupabaseAuthClient()
let sideBar = ref(false)

let searchQuery = ref("")

const openSideBar = () => {
    sideBar.value = true
}

const closeSideBar = () => {
    sideBar.value = false
}
const signOut = async () => {
    client.auth.signOut()
}

const signIn = () => {
    router.push('/login')
}

const createPost = () => {
    router.push("/createpost")
}

const search = () => {
    router.push({ path: "/search", query: { search: searchQuery.value } })
}


const handleKeyPress = (e) => {
    if (e.key == "Enter") {
        search();
    }
}
onMounted(() => {
    document.addEventListener("keyup", handleKeyPress);
})

</script>

<template>
    <div class="fixed z-50 flex items-center w-full h-16 shadow-2xl bg-neu-yellow-light justify-evenly">
        <sidebar :side-bar-open="sideBar" @side-bar-close="closeSideBar" />
        <button @click.prevent="openSideBar" class="md:hidden block text-neu-green drop-shadow-neu-border">
            <Icon name="material-symbols:menu" size="32" />
        </button>
        <NuxtLink to="/" class="hidden md:block">
            <img class="w-10 h-10 drop-shadow-neu-border" src="../public/vibely_logo.svg"/>
        </NuxtLink>
        <div class="flex border-4 border-black border-solid rounded-full shadow-neu-border w-52 bg-neu-green-light">
            <input v-model="searchQuery" class="w-full h-10 p-4 font-bold text-black bg-transparent rounded-l-full" />
            <button @click.prevent="search"
                class="w-12 font-bold border-l-4 border-black rounded-r-full bg-neu-yellow grid place-content-center text-sky-950">
                <Icon name="material-symbols:search" size="22" />
            </button>
        </div>
        <button v-if="user" @click.prevent="createPost" class="text-neu-green drop-shadow-neu-border">
            <Icon name="material-symbols:add-box" size="32" />
        </button>
        <button v-else @click.prevent="signIn" class="text-neu-green drop-shadow-neu-border">
            <Icon name="material-symbols:person-add" size="32" />
        </button>
    </div>
</template>
