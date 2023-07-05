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
    router.push({path:"/search", query:{search: searchQuery.value}})
}

</script>

<template>
    <div class="fixed z-20 flex items-center w-full h-16 shadow-2xl bg-sky-950 justify-evenly">
        <sidebar :side-bar-open="sideBar" @side-bar-close="closeSideBar" />
        <button @click.prevent="openSideBar" class="text-green-400">
            <Icon name="material-symbols:menu" size="32" />
        </button>
        <div class="flex border-4 border-green-400 border-solid rounded-full w-52 bg-slate-800">
            <input v-model="searchQuery" class="w-full h-10 p-4 font-bold text-white bg-transparent rounded-l-full" />
            <button @click.prevent="search" class="w-12 font-bold bg-green-400 rounded-r-full grid place-content-center text-sky-950">
                <Icon name="material-symbols:search" size="22" />
            </button>
        </div>
        <button v-if="user" @click.prevent="createPost" class="text-green-400">
            <Icon name="material-symbols:add-box" size="32" />
        </button>
        <button v-else @click.prevent="signIn" class="text-green-400">
            <Icon name="material-symbols:person-add" size="32" />
        </button>
    </div>
</template>
