<script setup>

import {useRetroIdeasStore} from "@/stores/retroIdeas.js";
import column from "@/components/Column.vue";



defineProps({
  column: String,
  title: String,
  ideas: [{
    id: Number,
    column: 'TWW' | 'TWNSW' | 'FF',
    text: String
  }]
})


function addNewIdea(){
  // ideasStore.addIdea(column, "New idea")
  //TODO add event to push new idea
}

</script>

<template>
  <v-col >
    <h2 @click="addNewIdea">{{ title }}</h2>
    <v-sheet class="pa-2 ma-2" border rounded :elevation="12">
      <v-list v-if="ideas.length > 0">
        <v-list-item v-for="idea in ideas" :title="idea.text">
        </v-list-item>
      </v-list>
      <span v-else>no elements</span>
    </v-sheet>
  </v-col>
</template>
