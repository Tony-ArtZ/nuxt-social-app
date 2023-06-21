<script setup>
const router = useRouter()
const user = useSupabaseUser()
</script>
<template>
    <section class="flex pt-20 overflow-scroll justify-center flex-col">
      <post id=1 userName="TonyArtZ" content="Hello everyone" profileUrl="https://pbs.twimg.com/profile_images/1645397579138732032/6i2hNRCW_400x400.jpg" likeCount="20"/>
      <post id=1 userName="TonyArtZ" content="Image" profileUrl="https://pbs.twimg.com/profile_images/1645397579138732032/6i2hNRCW_400x400.jpg" likeCount="20" imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtj_E9XuSthOAyLRNPKMkDyQ7zw-4iQhv19w&usqp=CAU"/>
    </section>
</template>
