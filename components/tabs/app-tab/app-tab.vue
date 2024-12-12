<template lang="pug">
  .app-tabs
    v-tabs(v-model="currentTabNo" )
      v-tab(v-for="(tab, index) in tabs" :key="index" :disabled="true") {{ tab.title }}

      v-tab-item(v-for="(tab, index) in tabs" :key="index")
        slot(:name="tab.slotName" :tabData="tab")

    slot

</template>

<script>
import {computed, defineComponent, ref} from '@nuxtjs/composition-api';

 export default defineComponent({
  props: {
    currentTab:{
      type:Number,
      default:0
    }
  },
  setup(props, {emit}) {
    const tabs = ref([
      { title: "Choose Book", slotName: "tab1" },
      { title: "Edit Cover", slotName: "tab2" },
      { title: "Preview & Download", slotName: "tab3" },
    ]);

    const currentTabNo = computed(()=>props.currentTab);

    return {
      currentTabNo,
      tabs,
    };
  },
});
</script>

