<script setup>
import Column from "@/components/Column.vue";
import AppFooter from "@/components/AppFooter.vue";

import {useRetroIdeasStore} from "@/stores/retroIdeas.js";
import {storeToRefs} from "pinia";

const ideasStore = useRetroIdeasStore()
const {thingsWentWell, thingsWentNotSoWell, feelings} = storeToRefs(ideasStore)

function addNewIdea(column, ideaText){
  ideasStore.addIdea(column, ideaText)
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" max-width="" style="background-color: beige">
          <v-row  align="start">

            <Column column="TWW"
                    title="Things that went well"
                    dialog-title="Add something that went so well that we should do more of it"
                    :ideas="thingsWentWell"
                    @add-new-idea="addNewIdea"
                    style="background-color: green">
            </Column>
            <Column column="TWNSW"
                    title="Things that went not so well"
                    dialog-title="Add something that went not so well that we should stop doing it"
                    :ideas="thingsWentNotSoWell"
                    @add-new-idea="addNewIdea"
                    style="background-color: orangered">

            </Column>
            <Column column="FF"
                    title="Feelings"
                    dialog-title="Add a feeling that you have"
                    :ideas="feelings"
                    @add-new-idea="addNewIdea"
                    style="background-color: dodgerblue">
            </Column>

          </v-row>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>
