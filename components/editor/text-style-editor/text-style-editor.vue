<template lang="pug">
.text-style-editor.pa-2
  .text-center.d-block.mb-4.font-weight-600 Select a textbox and style the text
  v-text-field(v-model.number="localFontSize", type="number", label="Font Size", @input="emitChanges" )
  v-text-field(v-model="localLetterSpacing", type="number", label="Letter Spacing", @input="emitChanges")
  v-color-picker(v-model="localTextColor", hide-inputs, canvas-height="100", label="Title Color", @input="emitChanges")

</template>


<script>
import {defineComponent, ref, watch} from "@nuxtjs/composition-api";

export default defineComponent({
  name: 'TextStyleControls',
  props: {
    fontSize: {
      type: Number,
      default: 20
    },
    letterSpacing: {
      type: Number,
      default: 1
    },
    textColor: {
      type: String,
      default: '#000000'
    }
  },

  setup(props, {emit}){

    const localFontSize = ref(props.fontSize);
    const localLetterSpacing = ref(props.letterSpacing);
    const localTextColor = ref(props.textColor);

    watch(
        () => props.fontSize,
        (newVal) => (localFontSize.value = newVal)
    );

    watch(
        () => props.letterSpacing,
        (newVal) => (localLetterSpacing.value = newVal)
    );

    watch(
        () => props.textColor,
        (newVal) => (localTextColor.value = newVal)
    );

    const emitChanges = () => {
        emit('update:fontSize', localFontSize.value);
        emit('update:letterSpacing', localLetterSpacing.value);
        emit('update:textColor', localTextColor.value);
    };

    return {
        localFontSize,
        localLetterSpacing,
        localTextColor,
        emitChanges
      }
    }
  })

</script>

<style scoped lang="scss">

</style>