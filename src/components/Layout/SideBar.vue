<script setup lang="ts">
import SidebarLinks from './SidebarLinks.vue'
import { Button } from '@/components/ui/button'
import { menuKey, type MenuInjectionOptions } from '@/utils/injectionKeys'
import { useWindowSize } from '@vueuse/core'

const links = [
  {
    title: 'Dashboard',
    to: '/',
    icon: 'lucide:house',
  },
  {
    title: 'Reports',
    to: '/reports',
    icon: 'lucide:building',
  },
  {
    title: 'Emails',
    to: '/emails',
    icon: 'lucide:badge-check',
  },
  {
    title: 'Departments',
    to: '/departments',
    icon: 'lucide:badge-check',
  },
]
const accountLinks = [
  {
    title: 'Profile',
    to: '/profile',
    icon: 'lucide:user',
  },
  {
    title: 'Sign Out',
    icon: 'lucide:log-out',
  },
]

const router = useRouter()

const executeAction = async (linkTitle: string) => {
  if (linkTitle === 'Sign Out') {
    const { logout } = await import('@/utils/supaAuth')
    const isLoggedOut = await logout()

    if (isLoggedOut) router.push('/login')
  }
}
defineEmits(['taskClicked', 'projectClicked', 'reportClicked', 'departmentClicked', 'emailClicked'])

const { menuOpen, toggleMenu } = inject(menuKey) as MenuInjectionOptions
const windowWidth = useWindowSize().width

watchEffect(() => {
  if (windowWidth.value > 1024) {
    menuOpen.value = true
  } else {
    menuOpen.value = false
  }
})
</script>
<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 transition-[width]"
    :class="{ 'w-52': menuOpen, 'w-24': !menuOpen }"
  >
    <div class="flex h-16 items-center border-b px-2 lg:px-4 shrink-0 gap-1 justify-between">
      <Button @click="toggleMenu" variant="outline" size="icon" class="w-8 h-8">
        <iconify-icon icon="lucide:menu"></iconify-icon>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon" class="w-8 h-8">
            <iconify-icon icon="lucide:plus"></iconify-icon>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="$emit('taskClicked')"> Task </DropdownMenuItem>
          <DropdownMenuItem @click="$emit('projectClicked')"> Project </DropdownMenuItem>
          <DropdownMenuItem @click="$emit('reportClicked')"> Report </DropdownMenuItem>
          <DropdownMenuItem @click="$emit('departmentClicked')"> Department </DropdownMenuItem>
          <DropdownMenuItem @click="$emit('emailClicked')"> Email </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <nav class="flex flex-col gap-2 justify-between h-full relative">
      <div>
        <SidebarLinks :links="links" />
      </div>

      <div class="border-y text-center bg-background py-3">
        <SidebarLinks :links="accountLinks" @actionClicked="executeAction" />
      </div>
    </nav>
  </aside>
</template>
