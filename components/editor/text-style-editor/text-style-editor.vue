<template lang="pug">
.text-style-editor.pa-2
  .text-center.d-block.mb-4.font-weight-600.red--text.text-decoration-underline Select a textbox and style the text
  v-text-field(v-model.number="localFontSize", type="number", label="Font Size", @input="emitChanges" )
  v-text-field(v-model="localLetterSpacing", type="number", label="Letter Spacing", @input="emitChanges")
  v-color-picker(v-model="localTextColor", hide-inputs, canvas-height="100", label="Title Color", @input="emitChanges")

</template>

<script>
import {defineComponent, ref, watch} from "@nuxtjs/composition-api";

export default defineComponent({
  name: 'TextStyleControls',
  props: {
    customStyle: {
      type: Object,
      default: ()=>{}
    }
  },

  setup(props, {emit}){

    const localFontSize = ref(props.customStyle.fontSize);
    const localLetterSpacing = ref(props.customStyle.letterSpacing);
    const localTextColor = ref(props.customStyle.textColor);

    watch(()=>props.customStyle,(style)=>{
      localFontSize.value=style.fontSize
      localLetterSpacing.value=style.letterSpacing
      localTextColor.value=style.textColor
    })

    const emitChanges = () => {
        emit('update', {textColor:localTextColor.value, fontSize:localFontSize.value,letterSpacing:localLetterSpacing.value});
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