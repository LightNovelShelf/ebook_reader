import { ref } from 'vue'

const menuShow = ref(false)
const sliderShow = ref(false)

export function useMenu() {
  return { menuShow, sliderShow }
}
