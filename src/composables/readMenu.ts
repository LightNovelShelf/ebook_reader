import { ref } from 'vue'

const menuShow = ref(false)
const sliderShow = ref(false)
const fontSettingShow = ref(false)

const $reset = () => {
  menuShow.value = false
  sliderShow.value = false
  fontSettingShow.value = false
}

export function useMenu() {
  return {
    menuShow,
    sliderShow,
    fontSettingShow,
    $reset
  }
}
