<template lang="pug">
  v-app
    v-main
      v-container
        v-card.d-flex.justify-start.align-center.pa-2.mb-2.header-buttons
          v-list-item.list-items(v-for='(item, i) in headerItems' :key='i' :to='item.to' exact)
            v-list-item-action
              v-icon {{ item.icon }}
            v-list-item-content
              .v-list-item-title.font-weight-600.font-size-20 {{ item.title }}
        Nuxt
</template>

<script>
import {defineComponent, ref, useRouter} from "@nuxtjs/composition-api";

export default defineComponent({
  name: 'DefaultLayout',

  setup() {
    const router = useRouter()

    const headerItems=ref ([
      {
        icon: 'mdi-apps',
        title: 'Main Page',
        to: '/',
      },
      {
        icon: 'mdi-account',
        title: 'User List Page',
        to: '/user-list',
      },
      {
        icon: 'mdi-book-open-page-variant-outline',
        title: 'Book Cover Page',
        to: '/book-cover',
      },
    ])

    return {
      headerItems,
    }
  }

})
</script>


<style lang="scss">
.header-buttons {
  .list-items {
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 8px;
    color: #37474f;
    background-color: transparent;
    transition: all 0.3s ease;
  }

}

</style>