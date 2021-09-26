<template>
  <naive-icon v-bind="$attrs">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="currentColor" :d="_path" />
    </svg>
  </naive-icon>
</template>

<script>
import { defineComponent } from 'vue'
import { NIcon as naiveIcon } from 'naive-ui'

export default defineComponent({
  name: 'Icon',
  components: {
    naiveIcon
  },
  props: {
    path: String
  },
  computed: {
    _path() {
      return this.$slots.default ? this.$slots.default()[0].children.trim() : this.path
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped></style>
