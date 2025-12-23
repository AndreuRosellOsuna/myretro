<script setup>
//
import Column from "@/components/Column.vue";
import AppFooter from "@/components/AppFooter.vue";

import {useRetroIdeasStore} from "@/stores/retroIdeas.js";
import {storeToRefs} from "pinia";
import column from "@/components/Column.vue";

const ideasStore = useRetroIdeasStore()
const {thingsWentWell, thingsWentNotSoWell, feelings} = storeToRefs(ideasStore)

function addNewIdea(){
  ideasStore.addIdea(column, "New idea")
}
</script>

<template>
  <v-app>
    <v-main>
<!--      <HelloWorld />-->
      <v-container class="fill-height" max-width="" style="background-color: aquamarine">
          <v-row  align="start">

            <Column column="TWW" title="Things that went well" :ideas="thingsWentWell" style="background-color: blueviolet">Things went well</Column>
            <Column column="TWNSW" title="Things that went not so well" :ideas="thingsWentNotSoWell" style="background-color: burlywood">Things went not so well</Column>
            <Column column="FF" title="Feelings" :ideas="feelings" style="background-color: darkslategray">Feelings</Column>

          </v-row>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>
