<script setup lang="ts">
import { ref } from "vue";
import CartDrawer from "@/components/layout/CartDrawer.vue";
const visible = ref(false);
</script>


<template>
  <div class="card">
    <div class="flex gap-2 justify-center">
      <Button icon="pi pi-arrow-left" @click="visible = true" />
    </div>
  </div>
<CartDrawer v-model:visible="visible" header="Right Drawer" position="right" />
</template>


<style scoped>

</style>