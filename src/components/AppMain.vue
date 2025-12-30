<script setup>
import Column from "@/components/Column.vue";
import {useRetroIdeasStore} from "@/stores/retroIdeas.js";
import {storeToRefs} from "pinia";
import {onUnmounted, watch} from "vue";
import pocketbase from "@/plugins/pocketbase.js";

const ideasStore = useRetroIdeasStore()
const {thingsWentWell, thingsWentNotSoWell, feelings, roomId} = storeToRefs(ideasStore)

let ideasSubscription

watch(roomId, () => {
  if(roomId.value !== "") {
    ideasSubscription && ideasSubscription.unsubscribe()
    ideasSubscription = pocketbase.collection("ideas").subscribe("*", event => {
      ideasStore.refreshIdeas()
    }, {
      filter: `room.id = '${roomId.value}'`
    })
  } else {
    ideasSubscription.unsubscribe()
  }
})

onUnmounted(() => ideasSubscription.unsubscribe())

function addNewIdea(column, ideaText){
  ideasStore.addIdea(column, ideaText)
}

function removeIdea(ideaId){
  ideasStore.removeIdea(ideaId)
}

</script>

<template>
  <v-main>
    <v-container class="fill-height" style="background-color: beige">
      <v-row align="start">

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
