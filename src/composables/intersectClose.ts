import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Guid } from 'js-guid'

export default function useIntersectClose() {
  const id = Guid.newGuid().toString()
  const isShow = ref(false)
  const parentStateKey = ref(null)
  const router = useRouter()
  const route = useRoute()
  const hook = []

  const popstate = (event) => {
    console.log(event)
    if (isShow.value && event.state.key === parentStateKey.value) {
      console.log('popstate 1')
      hook.forEach((item) => item())
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
    console.log({ entries, observer, isIntersecting })
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
      hook.push(call)
    }
  }
}
