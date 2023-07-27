<script setup>

definePageMeta({ middleware: ['userdata'] })

const route = useRoute();
const id = route.params.id;
const user = useSupabaseUser();
const client = useSupabaseClient();
const following = ref(false);
const followCount = ref(0);

//Get User data
const { data, error } = await client.from("users").select("*").eq("id", id);
const { data: posts, error: postError } = await client.from("posts").select("*, users(user_name,profile_picture,display_name), likes(count), posts(count)").eq("user_id", id).order("created_at", { ascending: false })
// const { count: followCount, error: followCountError } = await client.from("follows").select('*', { count: 'exact', head: true }).eq("following", id);
const { count: followingCount, error: followingCountError } = await client.from("follows").select('*', { count: 'exact', head: true }).eq("followed_by", id);

const updateFollowCount = async () => {
  const { count, error: followCountError } = await client.from("follows").select('*', { count: 'exact', head: true }).eq("following", id);
  followCount.value = count
}
updateFollowCount();


const updateFollow = async () => {
  if (user.value) {
    const { count, error } = await client.from("follows").select('*', { count: 'exact', head: true }).eq("following", id).eq("followed_by", user.value.id);
    if (count > 0) {
      following.value = true;
    }
    else {
      following.value = false;
    }
  }
}

if (user.value) {
  updateFollow();
}


const userData = ref(data[0]);

const follow = async () => {
  try {
    if (!following.value) {
      const { error } = await client.from("follows").insert({ following: id, followed_by: user.value.id });
      if (error) throw (error);
    }

    else {
      const { error } = await client.from("follows").delete().eq("following", id).eq("followed_by", user.value.id);
      if (error) throw (error);
    }
    updateFollow();
    updateFollowCount();
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div class="pt-16">
    <div class="bg-neu-yellow-light">
      <div class="relative w-full bg-green-400 h-36">
        <img :src="userData.banner_picture" class="object-cover w-full h-full border-b-4 border-black" />
        <img class="absolute object-cover w-20 h-20 rounded-full -bottom-10 drop-shadow-neu-border left-2"
          :src="userData.profile_picture" />
      </div>
      <section class="h-24 px-2">
        <div class="float-left">
          <h1 class="mt-12 text-xl font-black text-black">
            {{ userData.display_name }}
          </h1>
          <h6 class="text-sm text-neu-yellow drop-shadow-neu-border">@{{ userData.user_name }}</h6>
        </div>
        <NuxtLink v-if="user && user.id === id" to="/editaccount"
          class="float-right p-2 mt-12 mr-2 text-sm font-bold text-black border-2 border-black rounded-full bg-neu-green shadow-neu-black transition-all ease-in-out duration-300">
          Edit Profile
        </NuxtLink>
        <button v-else-if="user && user.id !== id" @click.prevent="follow"
          class="float-right p-2 px-4 mt-12 mr-2 text-sm font-bold text-black border-2 border-black rounded-full bg-neu-green shadow-neu-black transition-all ease-in-out duration-300">
          {{ following ? "Following" : "Follow" }}
        </button>
      </section>
      <section class="p-4 font-bold text-black border-b-2 border-sky-950">
        {{ userData.description }}
        <section class="mt-6 flex flex-row gap-4 ">
          <div class="text-black "> <span class="text-neu-green text-sm font-normal drop-shadow-neu-border">{{
            followingCount }}</span> Following</div>
          <div class="text-black "> <span class="text-neu-yellow text-sm font-normal drop-shadow-neu-border">{{
            followCount }}</span> Followers</div>
        </section>
      </section>
    </div>
    <section class="flex flex-col justify-center px-4 pt-4 overflow-scroll gap-4">
      <post v-for="post in posts" :post="post" />
    </section>
  </div>
</template>
