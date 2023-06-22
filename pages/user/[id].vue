<script setup>
const route = useRoute()
const id = route.params.id
</script>

<template>
    <div class="pt-24 p-4">
        <h1 class="text-green-400 font-bold">
             hello user {{ $route.params.id }}
        </h1>
    </div>
</template>