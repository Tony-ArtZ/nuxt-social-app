<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
</script>

<template>
  <div class="bg-white">
    <navbar />
    <NuxtPage />
  </div>
</template>

<style></style>
