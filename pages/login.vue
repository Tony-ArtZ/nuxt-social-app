<script setup>

definePageMeta({ middleware: ['userexists'] })

const user = useSupabaseUser()
const client = useSupabaseAuthClient()
const router = useRouter()

let email = ref()
let emailSent = ref(false)
let buttonText = computed(() => { return emailSent.value ? "Resend Email" : "Submit" })

const login = async () => {
  //email regex
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
    alert("Please enter a valid Email")
  }
  else {
    const { data, error } = await client.auth.signInWithOtp({ email: email.value })
    if (error) {
      alert(error)
    }

    else {
      emailSent.value = true
    }
  }
}
</script>

<template>
  <div class="pt-20 grid place-items-center h-screen w-full">
    <section
      class="bg-sky-950 flex border-green-400 border-4 border-solid flex-col items-center p-4 h-96  w-full rounded-xl">
      <h1 class="w-full text-white p-4 text-start font-bold text-4xl mb-8">Login</h1>
      <label class="text-start mr-44 mb-2 font-bold text-green-400">Email:</label>
      <input v-model="email" placeholder="Email" type="email"
        class="rounded-full mb-12 font-bold text-white p-4 bg-slate-800 border-solid border-4 h-12 w-42 border-green-400" />
      <button @click="login" class="p-6 w-44 text-lg bg-green-400 font-bold rounded-xl">{{ buttonText }}</button>
      <p v-if="emailSent" class="text-green-400 mt-4">Please check your email for login link!</p>
    </section>
  </div>
</template>
