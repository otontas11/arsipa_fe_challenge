<template lang="pug">
  v-app
    v-main
      v-container
        v-btn.justify-center.mr-2(color="blue-grey" v-text="mainPageText"   @click="gotoMainPage" outlined)
        Nuxt
</template>

<script>
import {defineComponent, ref, useRouter} from "@nuxtjs/composition-api";

export default defineComponent({
  name: 'DefaultLayout',

  setup() {
    const router = useRouter()
    const mainPageText = ref('Main Page')

    const gotoMainPage = () => {
      router.push('/')
    }
    return {mainPageText, gotoMainPage}
  }

})
</script>
