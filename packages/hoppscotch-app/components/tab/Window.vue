<template>
  <div>This is a window {{ windows }}</div>
</template>

<script setup lang="ts">
import { watch } from "@nuxtjs/composition-api"
import { restWindows$, getRESTWindows } from "~/newstore/RESTSession"
import { useReadonlyStream } from "~/helpers/utils/composables"

const props = defineProps({
  windows: {
    type: Array,
    default: null,
  },
})

const restWindows = useReadonlyStream(restWindows$, getRESTWindows())

watch(restWindows, () => {
  console.log("props", props, restWindows.value)
})
</script>
