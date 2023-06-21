<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  profileUrl: { type: String, required: true },
  imageUrl: { type: String, required: false },
  likeCount: { type: Number, required: false },
})
</script>

<template>
    <div
        class="w-full border-solid border-green-400 border-y-2 p-4 my-4 bg-sky-950">
        <div class="flex items-center w-full gap-4">
            <img
                :src="profileUrl"
                class="rounded-full object-cover aspect-square w-12"
            />
            <h6 class="text-md font-bold text-white">{{userName}}</h6>
        </div>
        <p class="text-white ml-12 my-4">
            {{content}}
        </p>
        <div class="w-full grid place-items-center">
            <img v-if="imageUrl" :src="imageUrl" class="w-80 mb-4 rounded-xl aspect-sqiare object-cover"/>
        </div>
        <div>
            <button class="mr-2"><icon class="text-green-400" name="material-symbols:favorite-outline" size="24"/></button>
            <span class="text-white text-md">{{likeCount}}</span>
        </div>
    </div>
</template>
