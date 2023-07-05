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
  <div class="pt-20 grid place-items-center h-screen w-full">
    <section
      class="bg-sky-950 flex border-green-400 border-4 border-solid flex-col items-center p-4 w-full rounded-xl"
    >
      <h1 class="w-full text-white p-4 text-start font-bold text-4xl mb-8">
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
        class="bg-slate-800 border-4 mb-4 border-green-400 text-white grid place-items-center font-bold h-32 w-32 rounded-full"
      >
        <img
          v-if="previewImage"
          :src="previewImage"
          class="rounded-full object-cover w-full aspect-square"
        />
        <div v-else class="flex-col flex justify-center items-center p-2 text-sm"><Icon class="text-green-400" name="material-symbols:upload" size="24"/>Upload Image</div>
      </label>
      
      <!--User Name-->
      <label class="text-start mr-44 mb-2 font-bold text-green-400"
        >User Name:</label
      >
      <input
        v-model="userName"
        placeholder="User Name"
        type="text"
        class="rounded-full mb-12 font-bold text-white p-4 bg-slate-800 border-solid border-4 h-12 w-42 border-green-400"
      />

      <button
        @click.prevent="createAccount"
        class="p-6 w-44 text-lg bg-green-400 font-bold rounded-xl"
      >
        Submit
      </button>
    </section>
  </div>
</template>
