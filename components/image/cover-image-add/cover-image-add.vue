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

        v-btn.justify-center(color="blue-grey" v-text="`${imgSrcLogo?'Change Cover İmage':label}`" outlined  @click="openFileInput"  )
          v-icon(right dark v-text="'mdi-cloud-upload'")

      .cover-container(v-if="imgSrcLogo" )
        v-row
          v-col(cols="12" md="4")
            text-style-editor(
              :custom-style="activeSelectedInput==='book_title'?computedTitleStyle:computedAuthorStyle"
              @update="changeActiveInputTextStyle"
            )

          v-col(cols="12" md="8")
            .review-image-area.relative.w-100.relative
              nuxt-img.review-book-cover(:src="imgSrcLogo"  :key="imgSrcLogo")

              drag-drop-input(v-model="editableBookTitle" :custom-style="computedTitleStyle" label="Book title"
                :initialPosition="titleTextPosition" @click.native="changeActiveInput('book_title')"
                @update:position="(newPos) => titleTextPosition = newPos")

              drag-drop-input(v-model="editableBookAuthor" :custom-style="computedAuthorStyle" label="Author name"
                :initialPosition="authorTextPosition" @click.native="changeActiveInput('author_title')"
                @update:position="(newPos) => authorTextPosition = newPos")

      //- Hidden File Input
      input(ref="fileInputRef" type="file" accept="image/*" hidden @change="uploadImage")

</template>

<script>
import {ref, onMounted, useContext, watch, computed, defineComponent, reactive} from '@nuxtjs/composition-api';
import DragDropInput from "~/components/draggable/drag-drop-input/drag-drop-input.vue";
import TextStyleEditor from "~/components/editor/text-style-editor/text-style-editor.vue";

export default defineComponent({
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
  components: {DragDropInput, TextStyleEditor},
  setup(props, {emit}) {

    const {store} = useContext()
    const imgSrcLogo = ref(null);
    const fileInputRef = ref(null);
    const isUploadedImageLoaded = ref(false);

    const editableBookTitle = ref(props.selectedBook.title);
    const editableBookAuthor = ref(props.selectedBook.author);
    const activeEditableField = ref('book_title')
    const activeSelectedInput = computed(() => activeEditableField.value)

    const titleTextPosition = ref({x: 100, y: 50});
    const authorTextPosition = ref({x: 100, y: 150});

    // Book title styles
    const bookTitleStyle = reactive({
      titleTextColor: '#000000',
      titleFontSize: 20,
      titleLetterSpacing: 1
    })

    // Book author styles
    const bookAuthorStyle = reactive({
      authorTextColor: '#000000',
      authorFontSize: 18,
      authorLetterSpacing: 1
    })

    // dynamic  title styles
    const computedTitleStyle = computed(() => ({
      textColor: `${bookTitleStyle.titleTextColor}`,
      fontSize: `${bookTitleStyle.titleFontSize}`,
      letterSpacing: `${bookTitleStyle.titleLetterSpacing}`,
    }));

    // dynamic  author styles
    const computedAuthorStyle = computed(() => ({
      textColor: `${bookAuthorStyle.authorTextColor}`,
      fontSize: `${bookAuthorStyle.authorFontSize}`,
      letterSpacing: `${bookAuthorStyle.authorLetterSpacing}`,
    }));

    onMounted(() => {
      store.commit('books/setNextNavigationBtn', false)
    });

    watch(() => props.currentTab, () => {
      //drawPreview if goes to 3.tab
      if (props.currentTab === 2) {
        saveForReview()
      }
    })

    watch(() => props.selectedBook, () => {
      editableBookTitle.value = (props.selectedBook.title);
      editableBookAuthor.value = (props.selectedBook.author);
    })

    const changeActiveInputTextStyle = (styles) => {
      if (activeSelectedInput.value === 'book_title') {
        bookTitleStyle.titleTextColor = styles.textColor
        bookTitleStyle.titleFontSize = styles.fontSize
        bookTitleStyle.titleLetterSpacing = styles.letterSpacing
      } else {
        bookAuthorStyle.authorTextColor = styles.textColor
        bookAuthorStyle.authorFontSize = styles.fontSize
        bookAuthorStyle.authorLetterSpacing = styles.letterSpacing
      }
    }

    const changeActiveInput = (inputName) => {
      activeEditableField.value = inputName
    }

    const openFileInput = () => fileInputRef.value.click();

    const uploadImage = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imgSrcLogo.value = reader.result;
          isUploadedImageLoaded.value = true;
          emit('isUploadedImageLoaded', isUploadedImageLoaded.value)
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
      store.commit('books/setPreviewImgToBase64', {canvasImage: dataUrl});
    };

    return {
      imgSrcLogo,
      fileInputRef,
      editableBookTitle,
      editableBookAuthor,
      titleTextPosition,
      authorTextPosition,
      computedTitleStyle,
      computedAuthorStyle,
      activeSelectedInput,
      openFileInput,
      uploadImage,
      changeActiveInputTextStyle,
      changeActiveInput
    };
  },
});
</script>

<style lang="scss" src="./cover-image-add.scss"/>

