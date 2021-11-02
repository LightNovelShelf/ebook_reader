<template>
  <slot v-bind="$attrs"></slot>

  <n-modal
    v-model:show="showModal"
    preset="dialog"
    :title="title"
    :mask-closable="false"
    :positive-text="isChooseDir ? '选择此文件夹' : null"
    @positive-click="callBack.submit(basePath)"
    @negative-click="callBack.cancel"
    @close="callBack.cancel"
    negative-text="算了"
  >
    <n-list>
      <template #header>
        <div @click="clickDir('..')" style="cursor: pointer; display: flex; align-items: center">
          <n-icon>{{ icon.mdiArrowLeft }}</n-icon>
          <span style="margin-left: 5px">{{ basePath }}</span>
        </div>
      </template>
      <n-scrollbar style="max-height: 50vh">
        <n-list-item v-for="list in dirList" :key="list" @click="clickDir(list)" style="cursor: pointer">
          <div>{{ list }}</div>
          <template #prefix>
            <n-icon>{{ icon.mdiFolder }}</n-icon>
          </template>
        </n-list-item>
        <n-list-item
          v-for="list in fileList"
          :key="list"
          @click="isChooseDir ? null : callBack.submit(`${basePath}/${list}`)"
          :style="isChooseDir ? {} : { cursor: 'pointer' }"
        >
          <div>{{ list }}</div>
          <template #prefix>
            <n-icon>{{ icon.mdiFile }}</n-icon>
          </template>
        </n-list-item>
      </n-scrollbar>
    </n-list>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, provide, ref, reactive } from 'vue'
import { getExternalStorageDirectory, getFiles, getDirectories } from '@/service/index'
import { icon } from '@/plugins/naive-ui'
import { useMessage } from 'naive-ui'
import useIntersectClose from '@/composables/intersectClose'

const path = require('path')

export default defineComponent({
  name: 'ChooseFile',
  setup() {
    const message = useMessage()
    const fileList = ref<string[]>(null)
    const dirList = ref<string[]>(null)
    const showModal = ref(false)
    const title = ref('')
    const callBack = reactive({
      submit: null,
      cancel: null
    })
    const isChooseDir = ref(false)
    let basePath = ref<string>(null)
    const requestFile = ref(null)

    const chooseFile = (suffix: string) => {
      return new Promise<string>((resolve, reject) => {
        callBack.submit = (file) => {
          showModal.value = false
          resolve(file)
        }
        callBack.cancel = reject

        isChooseDir.value = false
        title.value = '选择文件'
        showModal.value = true

        requestFile.value = async () => {
          if (!basePath.value) basePath.value = await getExternalStorageDirectory()
          try {
            dirList.value = (await getDirectories(basePath.value)).sort().map((item) => item.split('/').pop())
            fileList.value = (await getFiles(basePath.value))
              .sort()
              .map((item) => item.split('/').pop())
              .filter((item) => item.endsWith(suffix))
          } catch (err) {
            showModal.value = false
            callBack.cancel()
            message.error(`${err}`)
            basePath.value = await getExternalStorageDirectory()
          }
        }
        requestFile.value()
      })
    }

    const chooseDir = () => {
      return new Promise<string>((resolve, reject) => {
        callBack.submit = (file) => {
          showModal.value = false
          resolve(file)
        }
        callBack.cancel = reject

        isChooseDir.value = true
        title.value = '选择文件夹'
        showModal.value = true

        requestFile.value = async () => {
          if (!basePath.value) basePath.value = await getExternalStorageDirectory()
          try {
            dirList.value = (await getDirectories(basePath.value)).sort().map((item) => item.split('/').pop())
            fileList.value = (await getFiles(basePath.value)).sort().map((item) => item.split('/').pop())
          } catch (err) {
            showModal.value = false
            callBack.cancel()
            message.error(`${err}`)
            basePath.value = await getExternalStorageDirectory()
          }
        }
        requestFile.value()
      })
    }

    provide('chooseFile', { chooseFile, chooseDir })

    return {
      icon,
      isChooseDir,
      showModal,
      title,
      callBack,
      fileList,
      dirList,
      basePath,
      clickDir(name) {
        basePath.value = path.join(basePath.value, name)
        requestFile.value()
      }
    }
  }
})
</script>

<style scoped lang="scss"></style>
