<script setup>
import SideBarMenu from "@/components/layout/SideBarMenu.vue";
import TopBar from "@/components/layout/TopBar.vue";
</script>

<template>
  <div class="layout-wrapper layout-static">
    <TopBar />
    <SideBarMenu />

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style>

</style>