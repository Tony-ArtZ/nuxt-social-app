<script setup lang="ts">

import { v4 as uuidv4 } from 'uuid';


interface Post {
    content: string,
    created_at: string,
    id: string,
    picture: string,
    user_id: string,
    reply_to: string,
    like_count: number,
    reply_count: number,
    display_name: string,
    profile_picture: string,
    user_name: string
};

const props = defineProps<{
    post: Post,
    replyTo?: String
}>()

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

let likeCount = ref(props.post.like_count)
let liked = ref(false)
let reposted = ref(false)

let postReplyName = ref()

if (props.post.reply_to) {
    const { data, error } = await supabase.from("posts").select("*, users(id, display_name, user_name)").eq("id", props.post.reply_to)
    if (data && !error) {
        postReplyName.value = data[0].users;
    }
    else {
        console.log(error)
    }
}

// fetch and update local variables for Likes
const updateLike = async () => {
    const { count: likeCountData } = await supabase.from("likes").select("*", { head: true, count: "exact" }).eq("post_id", props.post.id)
    likeCount.value = likeCountData ? likeCountData : 0
    const { count: likedByUserCount } = await supabase.from("likes").select("*", { head: true, count: "exact" }).eq("user_id", user.value?.id).eq("post_id", props.post.id)
    liked.value = likedByUserCount! > 0;
}

// fetch and update local variables for Likes
const updateRepost = async () => {

}

// handle repost, create a repost if repost entry doesn't exists else delete the entry
const repost = async () => {
    try {
        const repostId = uuidv4()
        const {error} = await supabase.from("reposts").insert({id:repostId, post_id: props.post.id, user_id: user?.value?.id})
        updateRepost()
    } catch (err) {
        alert(JSON.stringify(err))
    }
}

// handle like, create a like if liked entry doesn't exists else delete the entry
const like = async () => {
    try {
        if (user.value) {
            if (liked.value) {
                const { error } = await supabase.from("likes").delete().eq("user_id", user.value.id).eq("post_id", props.post.id)
                if (error) throw (error)
            }
            else {
                const { error } = await supabase.from("likes").insert({ post_id: props.post.id, user_id: user.value.id })
                if (error) throw (error)
            }

            updateLike()
        }
    } catch (err) {
        alert(JSON.stringify(err))
    }
}

//if user exists check whether the user has already liked the post
if (user) {
    updateLike()
    updateRepost()
}

//if liked use a filled icon otherwise use an outline
const likeIconState = computed(() => liked.value ? "material-symbols:favorite" : "material-symbols:favorite-outline")


const openPost = () => {
    router.push(`/post/${props.post.id}`)
}

const navigateToUser = (userId:string) => {
    router.push(`/user/${userId}`)
}

</script>

<template>
    <div @click.prevent="openPost"
        class="w-full p-4 my-2 border-4 border-black border-solid even:bg-neu-yellow-light odd:bg-neu-green-light shadow-neu-black first:border-t-2">
        <section v-if="postReplyName" class="mb-4 font-bold">replying to <span @click.stop.prevent="navigateToUser(postReplyName.id)" class="text-neu-yellow font-normal hover:cursor-pointer drop-shadow-neu-border">@{{ postReplyName.user_name }}</span></section>
        <div @click.stop.prevent="navigateToUser(props.post.user_id)" class="z-20 flex items-center w-full gap-4">
            <img :src="post.profile_picture"
                class="z-10 object-cover w-12 border-black rounded-full drop-shadow-neu-border aspect-square" />
            <div>
                <h6 class="block font-bold text-neu-green drop-shadow-neu-border text-md">{{ post.display_name }}</h6>
                <h6 class="block text-sm font-bold text-black">@{{ post.user_name }}</h6>
            </div>
        </div>
        <p class="my-4 ml-4 text-black">
            {{ post.content }}
        </p>
        <div class="w-full grid place-items-center">
            <img v-if="post.picture" :src="post.picture"
                class="z-10 object-cover mb-4 border-4 border-black w-80 rounded-xl aspect-square" />
        </div>
        <section class="flex pl-4 gap-4">
            <div>
                <button @click.prevent="like" class="mr-2">
                    <icon class="text-neu-green drop-shadow-neu-border" :name="likeIconState" size="24" />
                </button>
                <span class="font-bold text-black text-md">{{ likeCount }}</span>
            </div>
            <div>
                <button @click.prevent="repost" class="mr-2">
                    <icon :class="reposted ? 'text-neu-yellow' : 'text-neu-green'" class="drop-shadow-neu-border"
                        name="ant-design:retweet-outlined" size="24" />
                </button>
                <span class="font-bold text-black text-md">0</span>
            </div>
            <div>
                <icon class="mr-2 text-neu-green drop-shadow-neu-border" name="material-symbols:mode-comment-outline"
                    size="24" />
                <span class="font-bold text-black text-md">{{ post.reply_count }}</span>
            </div>
        </section>
    </div>
</template>
