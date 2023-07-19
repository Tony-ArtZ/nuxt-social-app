
<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
definePageMeta({ middleware: ['userdata'] })

interface Post {
    content: string,
    created_at: string,
    id: string,
    picture: string,
    user_id: string,
    reply_to: string,
    likes: [{count: number}],
    posts: [{count: number}],
    users: {
        display_name: string,
        profile_picture: string,
        user_name: string
    }
}


const charLimit = 300
let charCount = computed(() => content.value.length)
const charCountClass = computed(() => charCount.value === charLimit?"text-red-400":"")
const route = useRoute();
const id = route.params.id;
const user = useSupabaseUser();
const supabase = useSupabaseClient();
let content = ref("");

//Get Post data
//const { data, error } = await client.from("users").select("*").eq("id", id);
const {data, error:postError} = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count), reposts(count)").eq("id", id);
const {data:comments, error:commentError} = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count), reposts(count)").eq("reply_to", id);
//const {data:replyTo, error:replyToError} = await supabase.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count)").eq("id", data![0].reply_to);


console.log(JSON.stringify(data))
const post:Post = data![0]


let likeCount = ref(post?.likes[0].count);
const liked = ref(false);

const updateLike = async () => { 
    const {count:likedCount} = await supabase.from("likes").select("*", {head:true, count:"exact"}).eq("post_id", id);
    likeCount.value = likedCount;
    const {count:likedByUser} = await supabase.from("likes").select("*", {head:true, count:"exact"}).eq("user_id", user?.value?.id).eq("post_id", id);
    liked.value = likedByUser > 0;
}

if(user) {
    updateLike()
}

const likeIconState = computed(()=> liked.value?"material-symbols:favorite":"material-symbols:favorite-outline");
const like =  async() => {
    if(user.value) {
        if(liked.value) {
            const {error} = await supabase.from("likes").delete().eq("user_id", user.value.id).eq("post_id", id);

        }
        else {
            const {error} = await supabase.from("likes").insert({post_id: id, user_id:user.value.id});
        }

        updateLike()
    }
}

const createPost = async () => {
  if(!content.value) {
    alert("can't post an empty reply")
  }

  else {
    try {
      const postId = uuidv4()

      const postData = {
        id : postId,
        user_id: user?.value?.id,
        content: content.value,
        reply_to: id,
      }

        //Upload image if user has changed the image 
        /*if (imagePreview.value && imageBlob.value) {
            //blob type is "image/png" we get the half after the "/"
            const imageExtention = imageBlob.value.type.split("/")[1];
          const path = `/${user.value.id}/${postId}.${imageExtention}`;
            let { error: uploadError } = await supabase.storage
                .from("posts")
                .upload(path, imageBlob.value, { upsert: true });
            if (uploadError) throw uploadError;
          postData.picture = `https://sxpvqgwlnbaptmslnlcs.supabase.co/storage/v1/object/public/posts/${user.value.id}/${postId}.${imageExtention}?date=${Date.now()}`
        }*/

      const {error} = await supabase.from("posts").insert(postData);
      if(error) throw error;
    }
  catch (error) {
    alert(error)
  }
  }
}
</script>
<template>
  <div class="px-4 pt-20">
  <Post :post="post"/>

   <div class="mt-4">
      <textarea v-model="content" placeholder="Write a Comment" class="w-full p-4 border-4 border-black bg-neu-yellow-light shadow-neu-black"/>
      <div class="flex flex-row w-full gap-2">
        <span :class="charCountClass" class="mb-4 text-black text-end">{{charCount}}/{{charLimit}} characters</span>
        <label class="p-2 ml-auto border-4 border-black bg-neu-yellow shadow-neu-black aspect-square"><Icon name="ph:image" size="24"/></label>
        <button @click.prevent="createPost" class="px-3 py-2 border-4 border-black bg-neu-green shadow-neu-black">Send</button>
      </div>
    </div>

    <section v-if="comments && comments.length > 0" class="pl-4 before:content-[''] before:h-full relative h-min before:w-2 before:bg-neu-yellow before:absolute before:left-0 before:border-2 before:border-black before:drop-shadow-neu-border">
      <Post v-for="comment in comments" :post="comment"/>
    </section>
  </div>
</template>
