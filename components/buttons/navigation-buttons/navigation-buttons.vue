<template lang="pug">
  .navigation-buttons
    v-btn.mr-2(
      @click="$emit('prev')"
      v-if="currentTab !== 0"
      color="primary"
    ) Back
    v-btn(
      @click="$emit('next')"
      :disabled="isNextDisabled"
      color="primary"
    ) Next
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    currentTab: {
      type: Number,
      default: 0
    },
    isNextDisabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {}
  }
})
</script>