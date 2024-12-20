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

        v-btn.justify-center(color="blue-grey" v-text="`${imgSrcLogo?'Change Cover İmage':label}`" outlined  @click="triggerFileInputClick"  )
          v-icon(right dark v-text="'mdi-cloud-upload'")

      .cover-container(v-if="imgSrcLogo" )
        v-row
          v-col(cols="12" md="4")
            text-style-editor(
              :custom-style="draggableInputs[lastClickedIndex]?.style"
              @update="updateActiveFieldTextStyle"
            )

            v-btn(v-text="'Add New İnput'" @click="addNewDraggableInput")

          v-col(cols="12" md="8")
            .review-image-area.relative.w-100.relative
              nuxt-img.review-book-cover(:src="imgSrcLogo"  :key="imgSrcLogo")

              template(v-for="(item, index) in draggableInputs" )

                drag-drop-input(v-model="item.text" :custom-style="item.style" label="Title"
                  :initialPosition="item.initPosition" @click.native="setActiveSelectedInputIndex(index)"
                  @update:position="updatePosition(index, $event)" @deleteBtn="deleteSelectedInput(index)")

      //- Hidden File Input
      input(ref="fileInputRef" type="file" accept="image/*" hidden @change="handleImageUpload")

</template>

<script>
import {ref, onMounted, useContext, watch, computed, defineComponent} from '@nuxtjs/composition-api';
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
    const lastClickedIndex = ref(0)

    const editableBookTitle = ref(props.selectedBook.title);
    const editableBookAuthor = ref(props.selectedBook.author);
    const activeEditableField = ref('book_title')
    const activeSelectedInput = computed(() => activeEditableField.value)

    const authorTextPosition = ref({x: 100, y: 150});

    const draggableInputs = ref([{
      initPosition: {x: 100, y: 50},
      text: 'Text',
      style: {
        fontSize: 20,
        letterSpacing: 1,
        textColor: '#000000'
      }
    }])

    onMounted(() => {
      store.commit('books/setNextNavigationBtn', false)
    });

    watch(() => props.currentTab, () => {
      //drawPreview if goes to 3.tab
      if (props.currentTab === 2) {
        generatePreviewCanvas()
      }
    })

    watch(() => props.selectedBook, () => {
      editableBookTitle.value = (props.selectedBook.title);
      editableBookAuthor.value = (props.selectedBook.author);
    })

    const updateActiveFieldTextStyle = (styles) => {
      draggableInputs.value[lastClickedIndex.value].style = {...styles}
    }

    const setActiveEditableField = (inputName) => {
      activeEditableField.value = inputName
    }

    const triggerFileInputClick = () => fileInputRef.value.click();

    const handleImageUpload = (event) => {
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

    const generatePreviewCanvas = () => {
      const reviewArea = document.querySelector('.review-image-area');
      const canvas = document.createElement('canvas');

      const rect = reviewArea.getBoundingClientRect(); // review-image-area sizes
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');

      // Background color
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw uploaded image
      const img = reviewArea.querySelector('img');
      if (img) {
        const imgRect = img.getBoundingClientRect();
        const imgX = imgRect.left - rect.left;
        const imgY = imgRect.top - rect.top;

        ctx.drawImage(img, imgX, imgY, imgRect.width, imgRect.height);
      }

      // Add text elements (author and book title)
      const texts = reviewArea.querySelectorAll('.input-text');
      texts.forEach((textElement) => {
        const {top, left} = textElement.getBoundingClientRect();
        const x = left - rect.left;
        const y = top - rect.top;

        const text = textElement.value;
        const style = getComputedStyle(textElement);

        // Font settings
        const fontSize = parseInt(style.fontSize, 10);
        const fontFamily = style.fontFamily;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = style.color;

        // Set alignment
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Letter spacing adjustment
        const letterSpacing = parseFloat(style.letterSpacing) || 0;

        // Positional adjustments for fine-tuning
        const offsetX = 18;
        const offsetY = 16;

        // Draw text with letter spacing
        let currentX = x + offsetX;
        const adjustedY = y + offsetY;

        for (const char of text) {
          ctx.fillText(char, currentX, adjustedY);
          currentX += ctx.measureText(char).width + letterSpacing;
        }
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 1.0); // 1.0 tam kalite

      // const dataUrl = canvas.toDataURL(); // Convert canvas to base64
      store.commit('books/setPreviewImgToBase64', {canvasImage: dataUrl});
    };

    const addNewDraggableInput = () => {
      const inputLength = draggableInputs.value.length

      draggableInputs.value.push({
        initPosition: {
          x: 100,
          y: inputLength < 10 ? 50 + inputLength * 50 : 50 + 9 * 50 // if more than 10 input , create them in same point

        },
        text: 'Text',
        style: {
          fontSize: 20,
          letterSpacing: 1,
          textColor: '#000000'
        }
      })
    }

    const updatePosition = (index, newPos) => {
      draggableInputs.value[index].initPosition = {...newPos}
    }

    const setActiveSelectedInputIndex = (lastSelectedIndex) => {
      lastClickedIndex.value = lastSelectedIndex
    }

    const deleteSelectedInput = (index) => {
      if (!draggableInputs.value.length) return;

      draggableInputs.value.splice(index, 1);
    }

    return {
      imgSrcLogo,
      fileInputRef,
      editableBookTitle,
      editableBookAuthor,
      authorTextPosition,
      activeSelectedInput,
      lastClickedIndex,
      draggableInputs,
      triggerFileInputClick,
      handleImageUpload,
      updateActiveFieldTextStyle,
      setActiveEditableField,
      addNewDraggableInput,
      updatePosition,
      deleteSelectedInput,
      setActiveSelectedInputIndex
    };
  },
});
</script>

<style lang="scss" src="./cover-image-add.scss"/>

