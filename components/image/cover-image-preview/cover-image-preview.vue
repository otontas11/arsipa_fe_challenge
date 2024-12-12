<template lang="pug">
  .cover-image-preview
    .review-container
      v-img(ref="previewCanvas" :src="base64CanvasImg" max-width="600" )
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

<style>
.cover-image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .review-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  v-img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  v-btn {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  v-btn:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    .review-container {
      padding: 15px;
    }

    v-btn {
      font-size: 14px;
      padding: 8px 16px;
    }
  }

}
</style>