import { ref } from 'vue'

const menuShow = ref(false)

export function useMenu(): any {
  return { menuShow }
}
