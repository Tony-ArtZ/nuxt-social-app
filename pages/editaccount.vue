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
let bannerImageBlob = ref();
let bannerPreviewImage = ref(data[0].banner_picture);
let description = ref(data[0].description)

let updates = reactive({});

//If value is changed, add them to list of fields to Update
watch(description, (newValue) => updates.description = newValue)
watch(displayName, (newValue) => updates.display_name = newValue)

const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    imageBlob.value = file;
    previewImage.value = URL.createObjectURL(file);
};

const bannerChangeHandler = (e) => {
    const file = e.target.files[0];
    bannerImageBlob.value = file;
    bannerPreviewImage.value = URL.createObjectURL(file);
};

const editAccount = async () => {
    try {
        //If images are changed, upload them and add their URL to list of fields to Update

        //Upload image if user has changed the image 
        if (previewImage.value !== data[0].profile_picture) {
            //blob type is "image/png" we get the half after the "/"
            const imageExtention = imageBlob.value.type.split("/")[1];
            const path = `/${user.value.id}/avatar.${imageExtention}`;
            let { error: uploadError } = await supabase.storage
                .from("users")
                .upload(path, imageBlob.value, { upsert: true });
            if (uploadError) throw uploadError;
            updates.profile_picture = `https://sxpvqgwlnbaptmslnlcs.supabase.co/storage/v1/object/public/users/${user.value.id}/avatar.png?date=${Date.now()}`
        }

        //Upload banner if user has changed the image 
        if (bannerPreviewImage.value !== data[0].banner_picture) {
            //blob type is "image/png" we get the half after the "/"
            const imageExtention = bannerImageBlob.value.type.split("/")[1];
            const path = `/${user.value.id}/banner.${imageExtention}`;
            let { error: uploadError } = await supabase.storage
                .from("users")
                .upload(path, bannerImageBlob.value, { upsert: true });
            if (uploadError) throw uploadError;
            updates.banner_picture = `https://sxpvqgwlnbaptmslnlcs.supabase.co/storage/v1/object/public/users/${user.value.id}/banner.png?date=${Date.now()}`
        }

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
        <NuxtLink :to="'/user/' + user.id" class="text-green-400 mb-2 w-full font-bold flex items-center text-sm">
            <Icon name="ic:sharp-close" size="18" /> Cancel
        </NuxtLink>
        <section
            class="flex flex-col items-center w-full p-4 text-center border-4 border-green-400 border-solid bg-sky-950 rounded-xl">
            <h1 class="w-full p-4 mb-8 text-4xl font-bold text-white text-start">
                Edit Account
            </h1>
            <div class="relative mb-12 w-full ">
                <!--Banner Picture-->
                <input required id="banner-upload" @change="bannerChangeHandler" type="file" accept="image/jpg, image/png"
                    class="absolute w-1 h-1 -z-50 -top-[100] hidden" />
                <label for="banner-upload"
                    class="relative mb-4 font-bold text-white   rounded-xl full bg-slate-800 grid place-items-center h-36">
                    <img v-if="bannerPreviewImage" :src="bannerPreviewImage" class="object-cover w-full rounded-xl h-36" />
                    <div v-else class="text-green-400">
                        <Icon class="mr-1" name="bi:upload" /> Upload Image
                    </div>
                    <Icon name="material-symbols:edit" size="24"
                        class="absolute top-0 right-0 w-8 h-8 p-1 mt-2 mr-2 text-green-400 border-2 border-green-400 rounded-full bg-slate-800" />
                </label>
                <!--Profile Picture-->
                <input required id="profile-upload" @change="imageChangeHandler" type="file" accept="image/jpg, image/png"
                    class="absolute w-1 h-1 -z-50 -top-[100] hidden" />
                <label for="profile-upload"
                    class="absolute w-20 h-20 mb-6 font-bold text-white border-4 border-sky-950 rounded-full left-4 -bottom-12 bg-slate-800 grid place-items-center">
                    <img :src="previewImage" class="object-cover w-full rounded-full aspect-square" />
                    <Icon name="material-symbols:edit" size="24"
                        class="absolute top-0 right-0 w-8 h-8 p-1 text-green-400 border-2 border-green-400 rounded-full bg-slate-800" />
                </label>
            </div>
            <!--Display Name-->
            <label class="mb-2 font-bold text-green-400 text-start mr-44">
                Display Name:
            </label>
            <input v-model="displayName" placeholder="Display Name" required type="text"
                class="h-12 p-4 mb-12 font-bold text-white border-4 border-green-400 border-solid rounded-full bg-slate-800 w-72" />

            <label class="mb-2 font-bold text-green-400 text-start mr-44">Description:
            </label>
            <!--Description-->
            <textarea v-model="description" placeholder="Description" type="text"
                class="p-2 mb-12 font-medium text-white border-4 border-green-400 border-solid h-44 w-72 rounded-xl bg-slate-800" />

            <button @click.prevent="editAccount" class="p-6 text-lg font-bold bg-green-400 w-44 rounded-xl">
                Save
            </button>
        </section>
    </div>
</template>
