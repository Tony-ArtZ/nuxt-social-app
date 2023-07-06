<script setup>
import { v4 as uuidv4 } from 'uuid';

const charLimit = 300
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
let content = ref("")
let charCount = computed(() => content.value.length)
const charCountClass = computed(() => charCount.value === charLimit?"text-red-400":"")
let imageBlob = ref()
let imagePreview = ref()

const removeImageHandler = () => {
  imageBlob.value = null;
  imagePreview.value = null;
}

const imageChangeHandler = (e) => {
  const file = e.target.files[0];
  imageBlob.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const createPost = async () => {
    try {
      const postId = uuidv4()

      const postData = {
        id : postId,
        user_id: user.value.id,
        content: content.value,
      }

        //Upload image if user has changed the image 
        if (imagePreview.value && imageBlob.value) {
            //blob type is "image/png" we get the half after the "/"
            const imageExtention = imageBlob.value.type.split("/")[1];
          const path = `/${user.value.id}/${postId}.${imageExtention}`;
            let { error: uploadError } = await supabase.storage
                .from("posts")
                .upload(path, imageBlob.value, { upsert: true });
            if (uploadError) throw uploadError;
          postData.picture = `https://sxpvqgwlnbaptmslnlcs.supabase.co/storage/v1/object/public/posts/${user.value.id}/${postId}.${imageExtention}?date=${Date.now()}`
        }

      const {error} = await supabase.from("posts").insert(postData)
      if(error) throw error
      else router.push("/")
    }
  catch (error) {
    alert(error)
  }
}
</script>

<template>
  <div class="w-full h-screen px-2 bg-neu-green-light grid place-items-center">
    <section
      class="flex flex-col items-center w-full p-4 px-6 mt-24 bg-white border-4 border-black border-solid shadow-neu-black">
      <h1 class="w-full p-4 mb-8 text-4xl font-bold text-start">Make a new Post</h1>
      <textarea required :maxlength="charLimit" v-model="content" placeholder="Write Something" type="text"
        class="w-full p-4 mb-2 font-bold text-black border-4 border-black border-solid outline-none rounded-xl bg-neu-yellow-light h-52" />
      <h2 :class="charCountClass" class="w-full mb-4 text-black text-end">{{charCount}}/{{charLimit}} characters</h2>
        <input id="image" class="hidden" @change="imageChangeHandler" type="file" accept="image/jpg, image/png" />
        <label
          for="image"
          class="relative w-full"
      >
        <img v-if="imagePreview" :src="imagePreview" class="object-cover w-full mb-6 aspect-square rounded-xl"/>
        <button v-if="imagePreview" @click.prevent="removeImageHandler" class="absolute w-8 h-8 text-black border-4 border-black rounded-full bg-neu-green right-1 top-1 aspect-square"><Icon name="ic:sharp-close" size="16" /></button>
        <div
          class="w-full px-4 py-2 mb-12 mr-2 text-sm font-bold text-black border-4 border-black rounded-full bg-neu-yellow shadow-neu-black hover:bg-neu-green hover:text-slate-800 transition-all ease-in-out duration-300"
        >
          <Icon name="ph:image" size="20"/>
          Add Image
        </div>
      </label>
      <button @click.prevent="createPost" class="p-6 text-lg font-bold border-4 border-black shadow-neu-black bg-neu-green w-44 rounded-xl">Create Post</button>
    </section>
  </div>
</template>
