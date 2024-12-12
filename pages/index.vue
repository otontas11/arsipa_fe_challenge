<template lang="pug">
  .main-page
    v-card.pa-4(elevation="2" )
      b.text-uppercase.d-flex.justify-center.mb-2 {{title}}
      .buttons.d-flex.justify-center
        v-btn.justify-center.mr-2(color="blue-grey" v-text="userPageText" outlined  @click="gotoUserPage")
        v-btn.justify-center(color="blue-grey" v-text="bookPageText" outlined  @click="gotoBookPage")

</template>

<script>
import {defineComponent, ref, useRouter} from '@nuxtjs/composition-api';

export default defineComponent({
  setup(props, {emit}) {
    const router = useRouter()
    const userPageText = ref('User List Page')
    const bookPageText = ref('Book Cover Page')
    const title = ref('Arsipa Fe Challenge')

    const gotoUserPage = () => {
      router.push('/user-list')
    }

    const gotoBookPage = () => {
      router.push('/book-cover')
    }

    return {
      title,
      userPageText,
      bookPageText,
      gotoBookPage,
      gotoUserPage
    }
  },
});
</script>

<style lang="scss" src="./index.scss"/>
