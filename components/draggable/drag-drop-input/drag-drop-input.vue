<template lang="pug">
  .drag-drop-input.draggable-area.d-flex(:style="{ top: `${position.y}px`, left: `${position.x}px`}")
    v-icon.mr-1(v-text="'mdi-drag-variant'" color="red" @mousedown.prevent="startDragging")
    .input-area
       label {{label}}
       input.input-text(:value="value" :type="type" :style="textFieldStyles" @input="handleInput")
</template>

<script>
import {ref, onMounted, onUnmounted, computed } from '@nuxtjs/composition-api';

export default {
  name: "DragDrop",
  props: {
    initialPosition: {
      type: Object,
      default: () => ({ x: 0, y: 0 }),
    },
    customStyle: {
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
      default: 'text',
    },
  },
  setup(props, { emit }) {
    const position = ref({...props.initialPosition});
    const isDragging = ref(false);
    const dragStart = ref({x: 0, y: 0});

    const textFieldStyles = computed(() => ({
      color: props.customStyle.color,
      fontSize: props.customStyle.fontSize,
      letterSpacing: props.customStyle.letterSpacing
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

    return {position, textFieldStyles,startDragging,handleInput };
  },
};
</script>

<style>
.drag-drop-input {
  position: absolute;
  cursor: grab;
  user-select: none;
  background: rgba(255, 255, 255, 0.5);
  padding: 2px 5px;
  border-radius: 5px;

  .input-text {
    border: 2px black solid;
    border-radius: 5px;
    padding: 5px 15px;
    width: 100%;
  }
}


</style>
