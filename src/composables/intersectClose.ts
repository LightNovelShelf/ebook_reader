import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Guid } from 'js-guid'

// TODO 如果一个窗口关闭自身再开始另一个窗口，则有BUG，代优化
export default function useIntersectClose() {
  const id = Guid.newGuid().toString()
  const isShow = ref(false)
  const parentStateKey = ref(null)
  const router = useRouter()
  const route = useRoute()
  const closeHook = []
  const finishHook = []

  const popstate = (event) => {
    // console.log(event)
    if (isShow.value && event.state.key === parentStateKey.value) {
      console.log('popstate 1')
      closeHook.forEach((item) => item())
      isShow.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('popstate', popstate, false)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', popstate, false)
  })

  const onIntersectClose = (entries, observer, isIntersecting) => {
    // console.log({ entries, observer, isIntersecting })
    if (entries) {
      console.log('pushState')
      parentStateKey.value = window.history.state.key
      window.history.pushState({ key: id }, null, '#' + route.path)
    } else {
      if (isShow.value) {
        console.log('popstate 2')
        router.go(-1)
      }
    }
    isShow.value = isIntersecting
  }

  return {
    onIntersectClose,
    isShow,
    onClose(call) {
      closeHook.push(call)
    },
    onFinish(call) {
      finishHook.push(call)
    }
  }
}
