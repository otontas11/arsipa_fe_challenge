<template lang="pug">
  .cover-image-preview
    .review-container
      v-img(ref="previewCanvas" :src="base64CanvasImg" max-width="600"  :key="base64CanvasImg")
      v-btn.justify-center(color="blue-grey" v-text="downloadText" outlined  @click="downloadImage")
        v-icon(v-text="'mdi-download'")

</template>

<script>

import {computed, defineComponent, ref, useContext} from "@nuxtjs/composition-api";

export default defineComponent({
  name: 'CoverImagePreview',
  setup() {

    const { store } = useContext();
    const downloadText=ref('Download')
    const previewCanvas = ref(null);

    const base64CanvasImg = computed(()=>store.state.books.base64CanvasImg)

    const downloadImage = () => {
      if (!base64CanvasImg.value) {
        console.warn("No image data available for download.");
        return;
      }

      const link = document.createElement('a');
      link.download = 'book-cover.png';
      link.href = base64CanvasImg.value;
      link.click();
    };

    return { previewCanvas,base64CanvasImg,downloadText, downloadImage };

  },
})

</script>

<style lang="scss" src="./cover-image-preview.scss">

</style>