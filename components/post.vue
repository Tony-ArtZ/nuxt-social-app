<script setup lang="ts">
import { Post } from '~/.nuxt/components';

interface Post {
    content: string,
    created_at: string,
    id: string,
    picture: string,
    user_id: string,
    likes: number,
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

const like =  async() => {
    alert("liked")
    if(user.value) {
        const {error} = await supabase.from("likes").insert({post_id: props.post.id, user_id:user.value.id})
        alert(JSON.stringify(error))
    }
}

</script>

<template>
    <div class="w-full border-solid border-green-400 border-y-2 p-4 my-4 bg-sky-950">
        <div class="flex items-center w-full gap-4">
            <img :src="post.users.profile_picture" class="z-10 rounded-full object-cover aspect-square w-12" />
            <div>
                <h6 class="text-md font-bold block text-white">{{ post.users.display_name }}</h6>
                <h6 class="text-sm block text-green-400">@{{ post.users.user_name }}</h6>
            </div>
        </div>
        <p class="text-white ml-4 my-4">
            {{ post.content }}
        </p>
        <div class="w-full grid place-items-center">
            <img v-if="post.picture" :src="post.picture" class="w-80 z-10 mb-4 rounded-xl aspect-square object-cover" />
        </div>
        <div>
            <button @click.prevent="like" class="mr-2">
                <icon class="text-green-400" name="material-symbols:favorite-outline" size="24" />
            </button>
            <span class="text-white text-md">{{ post.likes?post.likes:0 }}</span>
        </div>
    </div>
</template>
