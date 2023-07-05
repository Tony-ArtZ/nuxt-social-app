<script setup lang="ts">
import { Post } from '~/.nuxt/components';

interface Post {
    content: string,
    created_at: string,
    id: string,
    picture: string,
    user_id: string,
        likes: [{count: number}],
    users: {
        display_name: string,
        profile_picture: string,
        user_name: string
    }
}

const props = defineProps<{
    post: Post
}>()

const supabase = useSupabaseClient();
const user = useSupabaseUser();

let likeCount = ref(props.post.likes[0].count)
const liked = ref(false)

const updateLike = async () => { 
    const {count:likedCount} = await supabase.from("likes").select("*", {head:true, count:"exact"}).eq("post_id", props.post.id)
    likeCount.value = likedCount!
    const {count:likedByUser} = await supabase.from("likes").select("*", {head:true, count:"exact"}).eq("user_id", user.value.id).eq("post_id", props.post.id)
    liked.value = likedByUser! > 0
}

if(user) {
    updateLike()
}

const likeIconState = computed(()=> liked.value?"material-symbols:favorite":"material-symbols:favorite-outline")
const like =  async() => {
    if(user.value) {
        if(liked.value) {
            const {error} = await supabase.from("likes").delete().eq("user_id", user.value.id).eq("post_id", props.post.id)

        }
        else {
        const {error} = await supabase.from("likes").insert({post_id: props.post.id, user_id:user.value.id})
        }

        updateLike()
    }
}

</script>

<template>
    <div class="w-full p-4 border-b-2 border-green-400 border-solid first:border-t-2 bg-sky-950">
        <div class="flex items-center w-full gap-4">
            <img :src="post.users.profile_picture" class="z-10 object-cover w-12 rounded-full aspect-square" />
            <div>
                <h6 class="block font-bold text-white text-md">{{ post.users.display_name }}</h6>
                <h6 class="block text-sm text-green-400">@{{ post.users.user_name }}</h6>
            </div>
        </div>
        <p class="my-4 ml-4 text-white">
            {{ post.content }}
        </p>
        <div class="w-full grid place-items-center">
            <img v-if="post.picture" :src="post.picture" class="z-10 object-cover mb-4 w-80 rounded-xl aspect-square" />
        </div>
        <div>
            <button @click.prevent="like" class="mr-2">
                <icon class="text-green-400" :name="likeIconState" size="24" />
            </button>
            <span class="text-white text-md">{{ likeCount }}</span>
        </div>
    </div>
</template>
