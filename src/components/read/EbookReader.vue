<template>
  <div>
    <!--    <div id="read" :style="{ width: width + 'px' }"></div>-->
    <div>read</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EbookReader',
  props: {
    name: String
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss"></style>
