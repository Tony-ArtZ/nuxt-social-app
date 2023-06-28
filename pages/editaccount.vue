<script setup>
definePageMeta({ middleware: ["auth"] });

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const client = useSupabaseClient();
const { data, error } = await client
  .from("users")
  .select("*")
  .eq("id", user.value.id);
let imageBlob = ref();
let previewImage = ref(data[0].profile_picture);
let userName = ref(data[0].display_name);
const router = useRouter();

const imageChangeHandler = (e) => {
  const file = e.target.files[0];
  imageBlob.value = file;
  previewImage.value = URL.createObjectURL(file);
};
</script>

<template>
  <div class="pt-20 grid place-items-center h-screen w-full">
    <section
      class="
        bg-sky-950
        flex
        border-green-400 border-4 border-solid
        flex-col
        items-center
        text-center
        p-4
        w-full
        rounded-xl
      "
    >
      <h1 class="w-full text-white p-4 text-start font-bold text-4xl mb-8">
        Edit Account
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
        class="
          bg-slate-800
          border-4
          mb-4
          border-green-400
          text-white
          grid
          place-items-center
          font-bold
          h-32
          w-32
          rounded-full
        "
      >
        <img
          :src="previewImage"
          class="rounded-full object-cover w-full aspect-square"
        />
      </label>
      <!--User Name-->
      <label class="text-start mr-44 mb-2 font-bold text-green-400">
        Display Name:
      </label>
      <input
        v-model="userName"
        placeholder="User Name"
        type="text"
        class="
          rounded-full
          mb-12
          font-bold
          text-white
          p-4
          bg-slate-800
          border-solid border-4
          h-12
          w-42
          border-green-400
        "
      />

      <label class="text-start mr-44 mb-2 font-bold text-green-400"
        >Description:
      </label>

      <textarea
        placeholder="Description"
        type="text"
        class="
          rounded-xl
          mb-12
          font-bold
          text-white
          p-4
          bg-slate-800
          border-solid border-4
          h-42
          w-42
          border-green-400
        "
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
