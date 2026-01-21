<script setup>
import Column from "@/components/Column.vue";
import {useIdeasStore} from "@/stores/ideasStore.js";
import {useRoomStore} from "@/stores/roomStore.js";
import {storeToRefs} from "pinia";
import {onUnmounted, watch} from "vue";
import Timer from "@/components/Timer.vue";

const ideasStore = useIdeasStore()
const roomStore = useRoomStore()
const {thingsWentWell, thingsWentNotSoWell, feelings} = storeToRefs(ideasStore)
const {roomId} = storeToRefs(roomStore)

let ideasSubscription

watch(roomId, () => {
  if(roomId.value !== "") {
    ideasSubscription && ideasSubscription.unsubscribe()
    ideasSubscription = ideasStore.subscribeToIdeas(roomId.value)
  } else {
    ideasSubscription.unsubscribe()
  }
})

onUnmounted(() => ideasSubscription && ideasSubscription.unsubscribe())

function addNewIdea(column, ideaText){
  ideasStore.addIdea(column, ideaText)
}

function removeIdea(ideaId){
  ideasStore.removeIdea(ideaId)
}

</script>

<template>
  <v-main>
    <div class="timer-container position-absolute v-container fill-height">
      <Timer></Timer>
    </div>
    <v-container class="fill-height" style="background-color: beige">
      <v-row>

        <Column column="TWW"
                title="Things that went well"
                dialog-title="Add something that went so well that we should do more of it"
                :ideas="thingsWentWell"
                @add-new-idea="addNewIdea"
                @remove-idea="removeIdea"
                style="background-color: green">
        </Column>
        <Column column="TWNSW"
                title="Things that went not so well"
                dialog-title="Add something that went not so well that we should stop doing it"
                :ideas="thingsWentNotSoWell"
                @add-new-idea="addNewIdea"
                @remove-idea="removeIdea"
                style="background-color: orangered">

        </Column>
        <Column column="FF"
                title="Feelings"
                dialog-title="Add a feeling that you have"
                :ideas="feelings"
                @add-new-idea="addNewIdea"
                @remove-idea="removeIdea"
                style="background-color: dodgerblue">
        </Column>

      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.timer-container {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
