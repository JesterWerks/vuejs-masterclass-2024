<script setup lang="ts">
import TopNavbar from '@/components/Layout/TopNavbar.vue'
import Sidebar from '@/components/Layout/SideBar.vue'
import { menuKey } from '@/utils/injectionKeys'

const { pageData } = storeToRefs(usePageStore())
const taskSheetOpen = ref(false)
const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)

provide(menuKey, {
  menuOpen,
  toggleMenu,
})
</script>

<template>
  <div>
    <Sidebar
      @taskClicked="taskSheetOpen = true"
      @reportClicked="taskSheetOpen = true"
      @projectClicked="taskSheetOpen = true"
      @departmentClicked="taskSheetOpen = true"
      @emailClicked="taskSheetOpen = true"
    />
    <AppNewTask v-model="taskSheetOpen" />
    <AppNewProject v-model="taskSheetOpen" />
    <AppNewReport v-model="taskSheetOpen" />
    <AppNewDepartment v-model="taskSheetOpen" />
    <AppNewEmail v-model="taskSheetOpen" />
    <div
      class="flex flex-col transition-[margin]"
      :class="{ 'ml-52': menuOpen, 'ml-24': !menuOpen }"
    >
      <TopNavbar />

      <main class="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
        <div class="flex items-center">
          <h1 class="text-lg font-semibold md:text-2xl">{{ pageData.title }}</h1>
        </div>
        <slot></slot>
      </main>
    </div>
  </div>
</template>
