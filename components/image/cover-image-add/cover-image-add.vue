<template lang="pug">
  .cover-image-add
    .v-card(outlined height="100%")
      .d-flex.justify-space-between.align-center.my-2
        .book-info.pa-4
          .book-info
            span.font-weight-500.red--text.mr-1 Book Name :
            span.font-weight-600 {{ selectedBook.title }}
          .author-info
            span.font-weight-500.red--text.mr-1 Author :
            span.font-weight-600 {{ selectedBook.author }}

        v-btn.justify-center(color="blue-grey" v-text="`${imgSrcLogo?'Change cover İmage':label}`" outlined  @click="openFileInput"  )
          v-icon(right dark v-text="'mdi-cloud-upload'")

      .cover-container(v-if="imgSrcLogo" )
        v-row
          v-col(cols="12" md="4")
            b.info.text-center Select a textbox and style the text
            v-text-field(v-model.number="textFontSize" type="number" label="Font Size")
            v-text-field(v-model="textLetterSpacing" type="number" label="Letter Spacing")
            v-color-picker(v-model="textColor" hide-inputs canvas-height="100" label="Title Color")

          v-col(cols="12" md="8")
            .review-image-area.relative.w-100.relative
              nuxt-img.review-book-cover(:src="imgSrcLogo"  :key="imgSrcLogo")
              drag-drop-input(v-model="bookTitle" :custom-style="textStyle" label="Book title" :initialPosition="titlePosition" @update:position="(newPos) => titlePosition = newPos")
              drag-drop-input(v-model="bookAuthor" :custom-style="textStyle" label="Author name"  :initialPosition="authorPosition" @update:position="(newPos) => authorPosition = newPos")

      //- Hidden File Input
      input(ref="fileInput" type="file" accept="image/*" hidden @change="uploadImage")

</template>

<script>
import {ref, onMounted, useContext, watch, computed} from '@nuxtjs/composition-api';
import DragDropInput from "~/components/draggable/drag-drop-input/drag-drop-input.vue";

export default {
  name: 'CoverImageAdd',
  props: {
    selectedBook: {
      type: Object,
      default: () => {
      },
    },
    label: {
      type: String,
      default: 'Click to Upload Cover Image',
    },
    currentTab: {
      type: Number,
      default: 0,
    },
  },
  components: {DragDropInput},
  setup(props, {emit}) {

    const {store} = useContext()
    const imgSrcLogo = ref(null);
    const fileInput = ref(null);
    const isImageLoaded = ref(false);

    const bookTitle = ref(props.selectedBook.title);
    const bookAuthor = ref(props.selectedBook.author);

    const titlePosition = ref({x: 100, y: 50});
    const authorPosition = ref({x: 100, y: 150});

    const textColor = ref('#000000');
    const textFontSize = ref(20);
    const textLetterSpacing = ref(1);

    const textStyle = computed(() => {
      return {
        color: `${textColor.value} !important`,
        fontSize: `${textFontSize.value}px`,
        letterSpacing: `${textLetterSpacing.value}px !important`,
      }
    });

    onMounted(() => {
      store.commit('books/setNextNavigationBtn', false)
    });

    watch(() => props.currentTab, () => {
      //drawPreview if goes to 3.tab
      if (props.currentTab === 2) {
        saveForReview()
      }
      console.log("xxx", props.currentTab)
    })

    watch(() => props.selectedBook, () => {
      bookTitle.value = (props.selectedBook.title);
      bookAuthor.value = (props.selectedBook.author);
    })

    const openFileInput = () => fileInput.value.click();

    const uploadImage = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imgSrcLogo.value = reader.result;
          isImageLoaded.value = true;
          emit('isImageLoaded', isImageLoaded.value)
        };
        reader.readAsDataURL(file);
      }
    };

    const saveForReview = () => {
      const reviewArea = document.querySelector('.review-image-area');
      const canvas = document.createElement('canvas');

      const rect = reviewArea.getBoundingClientRect(); // review-image-area sizes
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');

      // bg color
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw pic
      const img = reviewArea.querySelector('img');

      if (img) {
        const imgRect = img.getBoundingClientRect();
        const imgX = imgRect.left - rect.left;
        const imgY = imgRect.top - rect.top;

        ctx.drawImage(img, imgX, imgY, imgRect.width, imgRect.height);
      }

      // get texts - author nd book name
      const texts = reviewArea.querySelectorAll('.input-text');
      texts.forEach((textElement) => {
        const {top, left} = textElement.getBoundingClientRect();
        const x = left - rect.left;
        const y = top - rect.top;

        const text = textElement.value;
        const style = getComputedStyle(textElement);

        ctx.font = `${style.fontSize} ${style.fontFamily}`;
        ctx.fillStyle = style.color;

        // Metin konumunu biraz aşağı kaydırmak için font boyutunu ekliyoruz
        ctx.fillText(text, x, y + parseInt(style.fontSize, 10));
      });

      const dataUrl = canvas.toDataURL(); // Canvas'ı base64 formatına dönüştür
      console.log("dataUrl", dataUrl)
      store.commit('books/setPreviewImgToBase64', {canvasImage: dataUrl});
    };

    return {
      imgSrcLogo,
      fileInput,
      bookTitle,
      bookAuthor,
      titlePosition,
      authorPosition,
      textColor,
      textFontSize,
      textLetterSpacing, textStyle,
      openFileInput,
      uploadImage,
    };
  },
};
</script>

<style>
.cover-container {
  position: relative;
  width: 100%;
  height: auto;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.review-image-area {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border: 2px dashed #bdbdbd;
  border-radius: 12px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  }

}

.d-flex.justify-space-between.align-center.my-2 {
  padding: 10px 20px;
  background-color: #eceff1;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-info {
  font-family: 'Roboto', sans-serif;
  color: #37474f;

  span {
    display: inline-block;
    margin-bottom: 5px;
  }

  .font-weight-500 {
    font-weight: 500;
    color: #ff5252;
  }

  .font-weight-600 {
    font-weight: 600;
    color: #212121;
  }
}

.v-btn.justify-center {
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.v-btn.justify-center:hover {
  background-color: #546e7a !important;
  transform: translateY(-3px);
}

.v-text-field, .v-color-picker {
  margin-bottom: 15px;
  border-radius: 8px;
}

.v-text-field input {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  color: #424242;
}

.v-color-picker {
  border-radius: 8px;
  border: 2px solid #90a4ae;

}

.review-book-cover {
  max-width: 100%;
  border-radius: 8px;
}

.drag-drop-input {
  position: absolute;
  cursor: grab;
  user-select: none;
  background: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border: 2px solid #90a4ae;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, background-color 0.3s ease-in-out;
}

.drag-drop-input:hover {
  background: rgba(250, 250, 250, 0.51);
  color: #e80c0c;
}
</style>

