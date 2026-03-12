<script setup lang="ts">
import { Drawer } from "primevue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(["update:visible"])
</script>

<template>
  <Drawer
      v-model:visible="props.visible"
      @update:visible="(value) => emit('update:visible', value)"
      header="Right Drawer"
      position="right"
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </Drawer>
</template>

<style scoped>

</style>