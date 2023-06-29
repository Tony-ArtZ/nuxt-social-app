<script setup>
let user = useSupabaseUser()
const router = useRouter()
const client = useSupabaseAuthClient()
let sideBar = ref(false)

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

</script>

<template>
    <div class="w-full z-20 h-16 bg-sky-950 flex fixed items-center justify-evenly shadow-2xl">
        <sidebar :side-bar-open="sideBar" @side-bar-close="closeSideBar" />
        <button @click.prevent="openSideBar" class="text-green-400">
            <Icon name="material-symbols:menu" size="32" />
        </button>
        <div class="border-solid border-4 w-52 flex bg-slate-800 border-green-400 rounded-full ">
            <input class="rounded-l-full h-10 w-full p-4 bg-transparent text-white font-bold " />
            <button class="w-12 bg-green-400 grid place-content-center text-sky-950 font-bold rounded-r-full">
                <Icon name="material-symbols:search" size="22" />
            </button>
        </div>
        <button v-if="user" @click.prevent="signOut" class="text-green-400">
            <Icon name="material-symbols:add-box" size="32" />
        </button>
        <button v-else @click.prevent="signIn" class="text-green-400">
            <Icon name="material-symbols:person-add" size="32" />
        </button>
    </div>
</template>
