<script setup>
definePageMeta({ middleware: ["auth"] });

const supabase = useSupabaseClient();
const user = useSupabaseUser();
let imageBlob = ref();
let previewImage = ref();
let userName = ref();
const router = useRouter();

const imageChangeHandler = (e) => {
  const file = e.target.files[0];
  imageBlob.value = file;
  previewImage.value = URL.createObjectURL(file);
};

const createAccount = async () => {
  try {
    if (!imageBlob.value || imageBlob.value.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    //blob type is "image/png" we get the half after the "/"
    const imageExtention = imageBlob.value.type.split("/")[1];
    const path = `/${user.value.id}/avatar.${imageExtention}`;
    let { error: uploadError } = await supabase.storage
      .from("users")
      .upload(path, imageBlob.value, { upsert: true });

    if (uploadError) throw uploadError;

    const userUploadData = {
      id: user.value.id,
      profile_picture: `https://sxpvqgwlnbaptmslnlcs.supabase.co/storage/v1/object/public/users/${user.value.id}/avatar.png`,
      user_name: userName.value,
      display_name: userName.value,
    };

    let { data, error } = await supabase.from("users").upsert(userUploadData);

    if (error) throw error;
    else router.push(`/user/${user.value.id}`);
  } catch (error) {
    alert(JSON.stringify(error));
  }
};
</script>

<template>
  <div class="w-full h-screen px-4 pt-20 grid place-items-center bg-neu-green-light">
    <section
      class="flex flex-col items-center w-full p-4 bg-white border-4 border-black shadow-neu-black"
    >
      <h1 class="w-full p-4 mb-8 text-4xl font-bold text-black text-start">
        Create Account
      </h1>
      <!--Profile Picture-->
      <input
        required
        id="profile-upload"
        @change="imageChangeHandler"
        type="file"
        accept="image/jpg, image/png"
        class="hidden"
      />
      <label
        for="profile-upload"
        class="w-32 h-32 mb-4 font-bold text-white border-4 border-black rounded-full shadow-neu-black bg-neu-yellow-light grid place-items-center"
      >
        <img
          v-if="previewImage"
          :src="previewImage"
          class="object-cover w-full rounded-full aspect-square"
        />
        <div v-else class="flex flex-col items-center justify-center p-2 text-sm font-black text-black"><Icon class="text-neu-yellow drop-shadow-neu-border" name="material-symbols:upload" size="24"/>Upload Image</div>
      </label>
      
      <!--User Name-->
      <label class="mb-2 font-bold text-black text-start mr-44"
        >User Name:</label
      >
      <input
        v-model="userName"
        placeholder="User Name"
        type="text"
        class="h-12 p-4 mb-12 font-bold text-black border-4 border-black shadow-neu-black bg-neu-yellow-light w-42"
      />

      <button
        @click.prevent="createAccount"
        class="p-6 text-lg font-bold border-4 border-black bg-neu-green w-44 shadow-neu-black rounded-xl"
      >
        Submit
      </button>
    </section>
  </div>
</template>
