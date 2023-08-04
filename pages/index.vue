<script setup>
definePageMeta({ middleware: ['userdata'] });

const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient();
const loading = ref(false);
const posts = ref();


//Filter Ids :
//0 -> Latest
//1 -> Following
const filterActiveStyle = "bg-neu-green font-bold";
const filterInactiveStyle = "bg-white font-normal";

const selectedFilter = ref(0);

const getPosts = async () => {
  loading.value = true;
  switch (selectedFilter.value) {
    case 0:
      const { data: latestPostData, error: latestPostError } = await client.rpc('get_nonreply_reposts');
      posts.value = latestPostData;
      console.log(latestPostData)
      break;
    case 1:
      const { data, error } = await client.rpc('get_following_posts', { userid: user.value.id })
      console.log(data)
      posts.value = data;
      break;
  }
  loading.value = false;
}

getPosts();

const changeSelected = (filterId) => {
  const tempFilterId = selectedFilter.value;
  selectedFilter.value = filterId;
  if (selectedFilter.value !== tempFilterId) {
    getPosts();
  }
}
definePageMeta({ middleware: ['userdata'] });
</script>

<template>
  <div class="relative">
    <section class="w-full left-0 sticky top-0 z-[20] flex pt-16 justify-between flex-row">
      <button :class="selectedFilter == 0 ? filterActiveStyle : filterInactiveStyle" @click="changeSelected(0)"
        class="w-full transition-all duration-300 ease-in-out border-black border-4 first:border-r-0 p-2">Latest</button>
      <button :class="selectedFilter == 1 ? filterActiveStyle : filterInactiveStyle" @click="changeSelected(1)"
        class="w-full transition-all duration-300 ease-in-out border-black border-4 first:border-r-0 p-2">Following</button>
    </section>
    <section class="flex flex-col justify-center px-4 py-[7.5rem] overflow-scroll gap-4">
      <div v-if="loading" class="w-full grid place-items-center mt-8">
        <loading-spinner />
      </div>
      <post v-if="posts && !loading" v-for="post in posts" :post="post" />
    </section>
  </div>
</template>
