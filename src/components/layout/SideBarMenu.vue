<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { SIDEBAR_CONFIG } from "@/constants/SIDEBAR_CONFIG.ts";
import { useLayout } from '@/layout/composables/layout';
const { onMenuToggle } = useLayout();

const { t } = useI18n();
const router = useRouter();

const model = computed(() => {
  return Object.entries(SIDEBAR_CONFIG).map(([section, items]) => ({
    label: t(`menu.${section.toLowerCase()}`),
    items: items.map(item => ({
      label: t(item.label),
      icon: item.icon,
      to: item.route,
      visible: item.state
    }))
  }));
});

const onMenuItemClick = (item) => {
  if (item.to) {
    router.push(item.to);
    onMenuToggle()
  }
};
</script>

<template>
  <div class="layout-sidebar">
    <ul class="layout-menu">
      <template v-for="(item, i) in model" :key="item.label">
        <li class="layout-root-menuitem">
          <div class="layout-menuitem-root-text">{{ item.label }}</div>
          <ul>
            <li v-for="(child, j) in item.items" :key="child.label" :class="{ 'hidden': child.visible === false }">
              <a @click="onMenuItemClick(child)"
                 class="layout-menuitem-link"
                 :class="{ 'active-route': router.currentRoute.value.path === child.to }">
                <i :class="[child.icon, 'layout-menuitem-icon']"></i>
                <span class="layout-menuitem-text">{{ child.label }}</span>
              </a>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>