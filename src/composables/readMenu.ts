import { ref } from 'vue'

const menuShow = ref(false)
const sliderShow = ref(false)

const $reset = () => {
  menuShow.value = false
  sliderShow.value = false
}

export function useMenu() {
  return {
    menuShow,
    sliderShow,
    $reset
  }
}
