import { ref } from 'vue'

const menuShow = ref(true)

export function useMenu(): any {
  return { menuShow }
}
