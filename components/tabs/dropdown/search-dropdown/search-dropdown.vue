<template lang="pug">
  .search-dropdown
    label.font-weight-600.font-size-14 {{label}}
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
import { defineComponent, ref } from '@nuxtjs/composition-api';
export default defineComponent({
  props: {
    items:{
      type:Array,
      default:()=>[],
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

    const selectedItem = ref({});

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

<style lang="scss">
.search-dropdown {
  margin: 20px auto;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;

  label {
    display: block;
    margin-bottom: 10px;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }

  .selection {
    color: #333;
    font-weight: 500;
  }

}

</style>

