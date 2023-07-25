<script setup>

definePageMeta({ middleware: ['userexists'] })

const user = useSupabaseUser()
const supabase = useSupabaseAuthClient()
const router = useRouter()

let email = ref()
let emailSent = ref(false)
let buttonText = computed(() => { return emailSent.value ? "Resend Email" : "Submit" })

const googleLogin = async () => {
  await supabase.auth.signInWithOAuth({provider:"google"})
}
watch(user.value, (newValue)=>{
  if(newValue) 
    router.push("/")
})
const login = async () => {
  //email regex
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
    alert("Please enter a valid Email")
  }
  else {
    const { data, error } = await supabase.auth.signInWithOtp({ email: email.value })
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
  <div class="w-full h-screen px-4 pt-20 grid place-items-center bg-neu-green-light">
    <section
      class="flex flex-col items-center w-full p-4 bg-white border-4 border-black border-solid shadow-neu-black">
      <h1 class="w-full p-4 mb-8 text-4xl font-bold text-black text-start">Login</h1>
      <label class="mb-2 font-bold text-black text-start mr-44">Email:</label>
      <input v-model="email" placeholder="Email" type="email"
        class="h-12 p-4 mb-12 font-bold text-black border-4 border-black border-solid bg-neu-yellow-light shadow-neu-black w-42" />
      <button @click="login" class="p-6 text-lg font-bold border-4 mb-4 border-black bg-neu-green w-44 rounded-xl shadow-neu-black">{{ buttonText }}</button>
      <p v-if="emailSent" class="my-4 mt-4 font-bold text-black">Please check your email for login link!</p>
      <button @click.prevent="googleLogin" class="bg-neu-yellow p-2 border-4 border-black shadow-neu-black "><Icon class="text-neu-black" name="ri:google-fill" size="32"/></button>
    </section>
  </div>
</template>
