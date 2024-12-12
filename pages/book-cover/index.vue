<template lang="pug">
  .book-cover-page
    v-card.pa-4(elevation="2"  )
      app-tab(:current-tab="currentTab")
        template(v-slot:tab1="{ tabData }")
          search-dropdown.my-3(:items="bookList" @onSelected="getSelectedBook" :selectedBook="selectedBook" placeholder="Select Book to Edit Cover Page")

        template(v-slot:tab2="{ tabData }")
          cover-image-add.mb-6(:selected-book="selectedBook" @isImageLoaded="isCoverImageLoaded" :current-tab="currentTab")

        template(v-slot:tab3="{ tabData }")
          cover-image-preview

        .navigation-buttons-area
          navigation-buttons(
            :current-tab="currentTab"
            :is-next-disabled="!isNextBtnValid"
            @prev="prevTab"
            @next="nextTab"
          )

</template>

<script>
import {defineComponent, useContext, ref, computed, useFetch} from '@nuxtjs/composition-api';
import AppTab from '~/components/tabs/app-tab/app-tab.vue';
import SearchDropdown from "~/components/dropdown/search-dropdown/search-dropdown.vue";
import NavigationButtons from "~/components/buttons/navigation-buttons/navigation-buttons.vue";
import CoverImageAdd from "~/components/image/cover-image-add/cover-image-add.vue";
import CoverImagePreview from "~/components/image/cover-image-preview/cover-image-preview.vue";

export default defineComponent({
  name: 'BookCover',
  props: {},
  components: {
    AppTab,
    SearchDropdown,
    NavigationButtons,
    CoverImageAdd,
    CoverImagePreview
  },
  setup(props, {emit}) {
    const {store} = useContext()
    const currentTab = ref(0)

    const bookList = computed(() => store.state['books'].bookList)
    const selectedBook = computed(() => store.state['books'].selectedBook)

    const isNextBtnValid = computed(() => {
      if (currentTab.value === 0) {
        return Object.keys(selectedBook.value).length > 0
      } else
        return store.state['books'].isNextNavigationBtnActive && currentTab.value !== 2
    })

    const { fetch, fetchState } = useFetch(async () => {
      if(!bookList.value.length) {
        await fetchBookList()
      }
    });

    const fetchBookList = async () => {
      try {
        await store.dispatch('books/getBooksList')
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const getSelectedBook = (book) => {
      store.commit('books/setSelectedBook', book)
      store.commit('books/setNextNavigationBtn', true)
    }

    const isCoverImageLoaded = () => {
      store.commit('books/setNextNavigationBtn', true)
    }

    const nextTab = () => {
      if (currentTab.value === 0) {
        currentTab.value++
      } else if (currentTab.value === 1) {
        currentTab.value++
      }
    }

    const prevTab = () => {
      currentTab.value--;
    }

    return {
      bookList,
      currentTab,
      isNextBtnValid,
      selectedBook,
      isCoverImageLoaded,
      prevTab,
      nextTab,
      getSelectedBook
    }
  },
});
</script>


<style lang="scss" src="./book-cover.scss"/>
