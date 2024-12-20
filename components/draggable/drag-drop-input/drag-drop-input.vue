<template lang="pug">
  .drag-drop-input.draggable-area.d-flex(:style="{ top: `${position.y}px`, left: `${position.x}px`}")
    v-icon.mr-1(v-text="'mdi-drag-variant'" color="red" @mousedown.prevent="startDragging")
    .input-area
      .input-area-header
        label {{label}}
        v-btn.delete-btn(color="error" plain @click="deleteButton")
          v-icon(v-text="'mdi-delete-circle'" )
      .input-area-footer
        input.input-text(:value="value" :type="type" :style="textFieldStyles" @input="handleInput")
        b {{position}}
</template>

<script>
import {ref, onMounted, onUnmounted, computed } from '@nuxtjs/composition-api';

export default {
  name: "DragDrop",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: 'Text',
    },
    indexId: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const position = ref({...props.item.initialPosition});
    const isDragging = ref(false);
    const dragStart = ref({x: 0, y: 0});

    const textFieldStyles = computed(() => ({
      color: props.item.style.textColor,
      fontSize: props.item.style.fontSize+'px',
      letterSpacing: props.item.style.letterSpacing+'px'
    }))

    onMounted(() => {
      window.addEventListener("mousemove", drag);
      window.addEventListener("mouseup", stopDragging);
    });

    onUnmounted(() => {
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", stopDragging);
    });

    const startDragging = (event) => {
      isDragging.value = true;
      dragStart.value = {x: event.clientX, y: event.clientY};
    };

    const handleInput = e => {
      emit('input', e.target.value);
    };

    const deleteButton = () => {
      emit('deleteBtn', props.indexId);
    };

    const stopDragging = () => {
      if (isDragging.value) {
        emit("update:position", position.value);
      }
      isDragging.value = false;
    };

    const drag = (event) => {
      if (!isDragging.value) return;

      const deltaX = event.clientX - dragStart.value.x;
      const deltaY = event.clientY - dragStart.value.y;

      dragStart.value = {x: event.clientX, y: event.clientY};

      position.value = {
        x: position.value.x + deltaX,
        y: position.value.y + deltaY,
      };
    };

    return {position, textFieldStyles,deleteButton, startDragging,handleInput };
  },
};
</script>

<style lang="scss" src="./drag-drop-input.scss" />
