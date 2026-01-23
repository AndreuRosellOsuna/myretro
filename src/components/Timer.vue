<script setup>

import {computed, onUnmounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useRoomStore} from "@/stores/roomStore.js";
import {useCountdown} from "@vueuse/core";

const roomStore = useRoomStore()
const {roomId, editable, finished, ideasEndDate} = storeToRefs(roomStore)

const timeShown = ref("02:00")

const distanceInMs = (date) => new Date(date).getTime() - new Date().getTime()
const remainingMinutes = () => Math.floor((distanceInMs(ideasEndDate.value) % (1000 * 60 * 60)) / (1000 * 60))
const remainingSeconds = () => Math.floor((distanceInMs(ideasEndDate.value) % (1000 * 60)) / 1000)

let roomSubscription
watch(roomId, () => {
  if(roomId.value) {
    roomSubscription && roomSubscription.unsubscribe()
    roomSubscription = roomStore.subscribeToRoom()
  } else {
    roomSubscription && roomSubscription.unsubscribe()
  }
})
onUnmounted(() => roomSubscription && roomSubscription.unsubscribe())

watch(editable, () => {
  if(editable.value === true && ideasEndDate.value && distanceInMs(ideasEndDate.value) > 0) {
    setTimerAndScheduleStopEditing()
  }
})

function startCountDownTimer() {
  if(disableResetTimerButton.value) {
    roomStore.setEndTimeAndEnableEditing()
    setTimerAndScheduleStopEditing()
  }
}

function resetTimer() {
  if(!disableResetTimerButton.value) {
    roomStore.resetTimer()
  }
}

const hideStartButton = computed(() => !!(!roomId.value || roomId.value && ideasEndDate.value))

const disableResetTimerButton = computed(() => {
  return !!(!roomId.value || (roomId.value && !finished.value))
})

/*
  This function is executed to start de internal countdown on each client.
  Each client should schedule to update the editable db room property so we ensure the room editing is finished
 */
function setTimerAndScheduleStopEditing() {
  let timeoutInSeconds
  if(ideasEndDate.value) {
    timeoutInSeconds = Math.floor((distanceInMs(ideasEndDate.value)) / 1000)
  } else {
    timeoutInSeconds = 2 * 60
  }

  const { start: startCountdown } = useCountdown(timeoutInSeconds, {
    onComplete() {
      roomStore.finishEditing()
    },
    onTick() {
      timeShown.value = `${remainingMinutes().toString().padStart(2,"0")}:${remainingSeconds().toString().padStart(2,"0")}`
    }
  })

  startCountdown()
}

</script>

<template>
<div class="messages-container">
  <div v-if="roomId && finished" class="timer-finished">Finished!</div>
  <div v-if="roomId && editable" class="timer-countdown">{{timeShown}}</div>
</div>
<div class="position-absolute buttons-container">
  <div @click="resetTimer" class="timer-reset" :class="{ 'reset-disabled': disableResetTimerButton }">Reset</div>
  <div v-hidden="hideStartButton" class="timer-start"><v-icon icon="mdi-play-circle-outline" size="x-large" @click="startCountDownTimer"></v-icon> Start</div>
</div>
</template>

<style scoped>

.buttons-container {
  top: 100px;
  right: 50px;
}

.messages-container {
  align-self: self-start;
  margin-left: auto;
  margin-right: auto;
}

.timer-countdown {
  margin-top: 80px;
  height: 50px;
  font-size: 2em;
  animation-name: blink;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
}

.timer-finished {
  color: darkgreen;
  height: 50px;
  animation-name: blink, easeOutBounce;
  animation-duration: 0.3s, 1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
}

.timer-start {
  color: darkgreen;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1.2em;
}

.timer-reset {
  position: relative;
  width: 70px;
  height: 50px;
  align-content: center;
  text-align: center;
  cursor: pointer;
  color: darkred;
  background-color: indianred;
  border: darkred solid 1px;
  border-radius: 12px;
  box-shadow: 3px 3px 2px rgba(0,0,0,0.45);
}

.timer-reset.reset-disabled {
  color: dimgrey;
  background-color: grey;
  cursor: not-allowed;
  border-color: dimgrey;
}

.timer-reset:active:not(.reset-disabled) {
  box-shadow: none;
  top: 3px;
  left: 3px;
}

@keyframes blink {
  from {
    opacity: 0.2;
    font-size: inherit;
  }
  to {
    opacity: 1;
    font-size: 2em;
    text-shadow: 1px 1px 2px white, 0 0 25px blue, 0 0 5px darkblue;
  }
}

@keyframes easeOutBounce {
  0% {
    transform: translateY(0%);
  }

  12% {
    transform: translateY(21.78%);
  }

  24% {
    transform: translateY(87.12%);
  }

  36% {
    transform: translateY(196.02%);
  }

  54% {
    transform: translateY(150.04%);
  }

  74% {
    transform: translateY(196.74%);
  }

  82% {
    transform: translateY(197.50%);
  }

  92% {
    transform: translateY(198.68%);
  }

  96% {
    transform: translateY(196.92%);
  }

  100% {
    transform: translateY(200%);
  }
}
</style>
