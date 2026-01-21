<script setup>

import {onUnmounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useRoomStore} from "@/stores/roomStore.js";
import {useCountdown} from "@vueuse/core";

const roomStore = useRoomStore()
const {roomId, editable, finished, ideasEndDate} = storeToRefs(roomStore)

const timeShown = ref("")

const distanceInMs = (date) => new Date(date).getTime() - new Date().getTime()
const remainingMinutes = () => Math.floor((distanceInMs(ideasEndDate.value) % (1000 * 60 * 60)) / (1000 * 60))
const remainingSeconds = () => Math.floor((distanceInMs(ideasEndDate.value) % (1000 * 60)) / 1000)

let roomSubscription
watch(roomId, () => {
  if(roomId.value) {
    roomSubscription && roomSubscription.unsubscribe()
    roomSubscription = roomStore.subscribeToRoom()
  } else {
    roomSubscription.unsubscribe()
  }
})
onUnmounted(() => roomSubscription && roomSubscription.unsubscribe())

watch(editable, (foo) => {
  console.log("editable changed", foo)
  if(editable.value === true && ideasEndDate.value && distanceInMs(ideasEndDate.value) > 0) {
    setTimerAndScheduleStopEditing()
  }
})

function startCountDownTimer() {
  roomStore.setEndTimeAndEnableEditing()
  setTimerAndScheduleStopEditing()
}

function resetTimer() {
  roomStore.resetTimer()
}

/*
  This function is executed to start de internal countdown on each client.
  Each client should schedule to update the editable db room property so we ensure the room editing is finished
 */
function setTimerAndScheduleStopEditing() {
  let timeoutInSeconds
  if(ideasEndDate.value) {
    timeoutInSeconds = Math.floor((distanceInMs(ideasEndDate.value)) / 1000)
  } else {
    timeoutInSeconds = 10
  }
  console.log("timeoutInSeconds", timeoutInSeconds)

  const { start: startCountdown } = useCountdown(timeoutInSeconds, {
    onComplete() {
      roomStore.finishEditing()
    },
    onTick() {
      timeShown.value = `${remainingMinutes()}:${remainingSeconds()}`
    }
  })

  startCountdown()
}

</script>

<template>
  <div class="position-absolute">
    <div v-if="roomId && editable">Time to edit: {{timeShown}}</div>
    <div v-else-if="roomId && !editable && !finished"><v-icon icon="mdi-play-circle-outline" class="cursor-pointer" @click="startCountDownTimer"></v-icon> Start countdown timer</div>

    <div>timer end date is {{ideasEndDate}}</div>
    <div v-if="roomId && finished">Finished!</div>
    <div v-if="roomId && !editable && finished" @click="resetTimer" class="cursor-pointer">reset</div>
  </div>
</template>

<style scoped>
div {
  color: red;
  top: 70px;
  right: 20px;
}
</style>
