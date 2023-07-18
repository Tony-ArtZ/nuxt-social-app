<script setup lang="ts">

interface Post {
    content: string,
    created_at: string,
    id: string,
    picture: string,
    user_id: string,
    likes: [{count: number}],
    posts: [{count: number}],
    users: {
        display_name: string,
        profile_picture: string,
        user_name: string
    }
}

const props = defineProps<{
    post: Post,
    replyTo?: String
}>()

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

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

const openPost = ()=>{
    router.push(`/post/${props.post.id}`)
}
</script>

<template>
    <div @click.prevent="openPost" class="w-full p-4 my-2 border-4 border-black border-solid even:bg-neu-yellow-light odd:bg-neu-green-light shadow-neu-black first:border-t-2">
        <div class="flex items-center w-full gap-4">
            <img :src="post.users.profile_picture" class="z-10 object-cover w-12 border-black rounded-full drop-shadow-neu-border aspect-square" />
            <div>
                <h6 class="block font-bold text-neu-green drop-shadow-neu-border text-md">{{ post.users.display_name }}</h6>
                <h6 class="block text-sm font-bold text-black">@{{ post.users.user_name }}</h6>
            </div>
        </div>
        <p class="my-4 ml-4 text-black">
            {{ post.content }}
        </p>
        <div class="w-full grid place-items-center">
            <img v-if="post.picture" :src="post.picture" class="z-10 object-cover mb-4 border-4 border-black w-80 rounded-xl aspect-square" />
        </div>
        <section class="flex pl-4 gap-4">
        <div>
            <button @click.prevent="like" class="mr-2">
                <icon class="text-neu-green drop-shadow-neu-border" :name="likeIconState" size="24" />
            </button>
            <span class="font-bold text-black text-md">{{ likeCount }}</span>
        </div>
        <div>
            <button @click.prevent="like" class="mr-2">
                <icon :class="liked?'text-neu-yellow':'text-neu-green'" class="text-neu-green drop-shadow-neu-border" name="ant-design:retweet-outlined" size="24" />
            </button>
            <span class="font-bold text-black text-md">{{ likeCount }}</span>
        </div>
        <div>
            <icon class="mr-2 text-neu-green drop-shadow-neu-border" name="material-symbols:mode-comment-outline" size="24"/>
            <span class="font-bold text-black text-md">{{ post.posts[0].count }}</span>
        </div>
        </section>
    </div>
</template>
