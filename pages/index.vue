<template lang="pug">
  .main-page
    v-card.pa-4(elevation="2" )
      b.text-uppercase.d-flex.justify-center.mb-2 {{title}}
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  setup(props, {emit}) {
    const title = ref('Arsipa Fe Challenge')


    return {
      title,
    }
  },
});
</script>

<style lang="scss" src="./index.scss"/>
