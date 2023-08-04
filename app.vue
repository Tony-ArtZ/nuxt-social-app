<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();
const userData = ref(null);
const followData = reactive({ followCount: 0, followingCount: 0 });

onMounted(async () => {
  if (user.value) {
    const { data, error } = await supabase.from("users").select("*").eq("id", user.value.id);
    userData.value = data[0];
    const { count: followCount, error: followCountError } = await supabase.from("follows").select('*', { count: 'exact', head: true }).eq("following", user.value.id);
    const { count: followingCount, error: followingCountError } = await supabase.from("follows").select('*', { count: 'exact', head: true }).eq("followed_by", user.value.id);

    console.log(followCount, followCountError, followingCountError);
    followData.followCount = followCount;
    followData.followingCount = followingCount;
  }
})

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
}

const logIn = () => {
  router.push("/login");
}

const openUserProfile = () => {
  router.push(`/user/${user.value.id}`);
}

watch(user, async (value) => {
  if (value) {
    const { data, error } = await supabase.from("users").select("*").eq("id", value.id);
    userData.value = data[0];
  }

  else {
    userData.value = null;
  }
})
</script>

<template>
  <div class="bg-white">
    <navbar />
    <div class="flex-row">
      <section class="hidden fixed md:block min-h-full float-left w-64 bg-neu-yellow-light">
        <div class="bg-neu-yellow-light h-screen w-64 pt-40 px-4">
          <section v-if="user && userData" @click="openUserProfile" class="flex flex-row">
            <div class="h-full">
              <img :src="userData.profile_picture"
                class="object-cover w-16 border-2 rounded-full aspect-square border-neu-green drop-shadow-neu-border" />
            </div>
            <div class="flex flex-col justify-center h-full pl-4">
              <h2 class="text-xl font-bold text-black">
                {{ userData.display_name }}
              </h2>
              <h4 class="text-sm text-neu-yellow drop-shadow-neu-border">
                @{{ userData.user_name }}
              </h4>
            </div>
          </section>
          <section v-if="user && userData" class="flex border-b-2 pb-4 border-black flex-row mt-6 mb-4 gap-4">
            <div class="text-black"> <span class="text-sm font-normal text-neu-green drop-shadow-neu-border">{{
              followData.followingCount }}</span> Following</div>
            <div class="text-black"> <span class="text-sm font-normal text-neu-yellow drop-shadow-neu-border">{{
              followData.followCount }}</span> Followers</div>
          </section>
          <!--Home-->
          <NuxtLink to="/"
            class="flex items-center p-2 mb-4 text-2xl text-black bg-white border-2 border-black shadow-neu-border gap-2 first:border-t-2">
            <Icon class="text-neu-green drop-shadow-neu-border" name="material-symbols:home" size="24" /> Home
          </NuxtLink>
          <!--Profile if user exists-->
          <NuxtLink v-if="user" :to="`/user/${user.id}`"
            class="flex items-center p-2 text-2xl text-black bg-white border-2 border-black shadow-neu-border gap-2 first:border-t-2">
            <Icon class="text-neu-yellow drop-shadow-neu-border" name="material-symbols:person" size="24" />Profile
          </NuxtLink>
          <!--Login if no user exists-->
          <NuxtLink v-else to="/login"
            class="flex items-center p-2 text-2xl text-black bg-white border-2 border-black shadow-neu-border gap-2 first:border-t-2">
            <Icon class="text-neu-yellow drop-shadow-neu-border" name="material-symbols:login" size="24" />Login
          </NuxtLink>
          <section class="w-full py-2 mt-4 border-t-2 border-black border-solid">
            <div class="w-full">
              <button @click="signOut" v-if="user"
                class="flex items-center float-right text-lg gap-2 text-neu-green drop-shadow-neu-border">SignOut
                <Icon class="text-neu-green drop-shadow-neu-border" name="ph:sign-out-fill" size="24" />
              </button>
              <button @click="logIn" v-if="!user"
                class="flex items-center float-right text-lg gap-2 text-neu-green drop-shadow-neu-border">LogIn
                <Icon class="text-neu-green drop-shadow-neu-border" name="ph:sign-in-fill" size="24" />
              </button>
            </div>
          </section>
        </div>
      </section>
      <div class="pl-0 md:pl-64">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style></style>
