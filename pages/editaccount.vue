<script setup>
definePageMeta({ middleware: ["auth"] });

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

//Get default User data
const { data, error } = await client
    .from("users")
    .select("*")
    .eq("id", user.value.id);

let imageBlob = ref();
let previewImage = ref(data[0].profile_picture);
let displayName = ref(data[0].display_name);
let description = ref(data[0].description)

const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    imageBlob.value = file;
    previewImage.value = URL.createObjectURL(file);
};

const editAccount = async () => {
    try {
        //Upload image if user has changed the image 
        if (previewImage.value !== data[0].profile_picture) {
            //blob type is "image/png" we get the half after the "/"
            const imageExtention = imageBlob.value.type.split("/")[1];
            const path = `/${user.value.id}/avatar.${imageExtention}`;
            let { error: uploadError } = await supabase.storage
                .from("users")
                .upload(path, imageBlob.value, { upsert: true });
            if (uploadError) throw uploadError;
        }

        const updates = {
            display_name: displayName.value,
            profile_picture: `https://sxpvqgwlnbaptmslnlcs.supabase.co/storage/v1/object/public/users/${user.value.id
                }/avatar.png?date=${Date.now()}`,
            description: description.value,
        };

        //Upload the data
        const { error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", user.value.id);

        if (error) throw JSON.stringify(error);
        else router.push(`/user/${user.value.id}`)

    } catch (error) {
        alert(error);
    }
};
</script>

<template>
    <div class="w-full h-screen pt-20 grid place-items-center">
        <section
            class="flex flex-col items-center w-full p-4 text-center border-4 border-green-400 border-solid bg-sky-950 rounded-xl">
            <h1 class="w-full p-4 mb-8 text-4xl font-bold text-white text-start">
                Edit Account
            </h1>
            <!--Banner Picture-->
            <input required id="banner-upload" @change="imageChangeHandler" type="file" accept="image/jpg, image/png"
                class="hidden" />
            <label for="banner-upload"
                class="relative mb-4 font-bold text-white border-4 border-green-400 w-72 bg-slate-800 grid place-items-center aspect-video">
                <img  class="object-cover w-full" />
                <Icon name="material-symbols:edit" size="24"
                    class="absolute top-0 right-0 w-8 h-8 p-1 text-green-400 border-2 border-green-400 rounded-full bg-slate-800" />
            </label>
            <!--Profile Picture-->
            <input required id="profile-upload" @change="imageChangeHandler" type="file" accept="image/jpg, image/png"
                class="hidden" />
            <label for="profile-upload"
                class="relative w-24 h-24 mb-4 font-bold text-white border-4 border-green-400 rounded-full bg-slate-800 grid place-items-center">
                <img :src="previewImage" class="object-cover w-full rounded-full aspect-square" />
                <Icon name="material-symbols:edit" size="24"
                    class="absolute top-0 right-0 w-8 h-8 p-1 text-green-400 border-2 border-green-400 rounded-full bg-slate-800" />
            </label>
            <!--Display Name-->
            <label class="mb-2 font-bold text-green-400 text-start mr-44">
                Display Name:
            </label>
            <input v-model="displayName" placeholder="Display Name" required type="text"
                class="h-12 p-4 mb-12 font-bold text-white border-4 border-green-400 border-solid rounded-full bg-slate-800 w-42" />

            <label class="mb-2 font-bold text-green-400 text-start mr-44">Description:
            </label>
            <!--Description-->
            <textarea v-model="description" placeholder="Description" type="text"
                class="w-64 h-48 p-2 mb-12 font-medium text-white border-4 border-green-400 border-solid rounded-xl bg-slate-800" />

            <button @click.prevent="editAccount" class="p-6 text-lg font-bold bg-green-400 w-44 rounded-xl">
                Save
            </button>
        </section>
    </div>
</template>
