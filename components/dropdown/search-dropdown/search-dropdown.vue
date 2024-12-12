<template lang="pug">
  .search-dropdown
    .font-weight-600.font-size-16 {{label}}
    v-autocomplete(
      :value="selectedItem"
      :items="items"
      item-text="title"
      item-value="primary_isbn10"
      :placeholder="placeholder"
      label
      outlined
      :search-dropdown="false"
      return-object
      background-color="white"
      :menu-props="{ closeOnContentClick: true, transition: 'scale-transition' }"
      @input="onSelected"
    )
      template(#selection="{ item }")
        .selection.black--text {{ item.title  }}

      template(#item="{ item }")
        .book-and-author.d-flex
          v-list-item-icon.mr-3
            v-icon.font-weight-600(v-text="'mdi-book'")
          v-list-item-content(dense)
            v-list-item-title.font-weight-600 {{ item.title }}
            v-list-item-title  {{item.author}}

</template>

<script>
import {defineComponent, ref, useContext} from '@nuxtjs/composition-api';
export default defineComponent({
  props: {
    items:{
      type:Array,
      default:()=>[],
    },
    selectedBook:{
      type:Object,
      default:()=>{},
    },
    label: {
      type: String,
      default: 'Select Book',
    },
    placeholder: {
      type: String,
      default: 'Select Book to Edit Cover Page',
    },

  },
  components: {
    },
  setup(props, { emit }) {

    const selectedItem = ref(props.selectedBook);

    const onSelected = (item) => {
      emit('onSelected',item);
    };

    return {
      selectedItem,
      onSelected,
    }

  },
});
</script>

<style lang="scss" src="./search-dropdown.scss" />

