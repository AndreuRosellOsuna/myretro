<script setup>

import {ref} from "vue";

const emit = defineEmits(['addNewIdea'])
const { column } = defineProps({
  column: String,
  title: String,
  dialogTitle: String,
  ideas: [{
    id: Number,
    column: 'TWW' | 'TWNSW' | 'FF',
    text: String
  }]
})

const openAddIdeaDialog = ref(false)
const newIdeaValue = ref('')
const newIdeaMaxValue = [v => v.length < 100 || 'Max 100 characters']

function cleanAndCloseDialog() {
  openAddIdeaDialog.value = false
  newIdeaValue.value = ''
}

function cancelDialog() {
  cleanAndCloseDialog()
}

function addNewIdea(){
  emit('addNewIdea', column, newIdeaValue.value)
  cleanAndCloseDialog()
}

</script>

<template>
  <v-col >
    <div class="title" @click="openAddIdeaDialog = true" >
      <h2><v-icon color="black" icon="mdi-plus-circle"></v-icon >{{ title }}</h2>
      <v-dialog max-width="700" v-model="openAddIdeaDialog" persistent>
        <template v-slot:default>
          <v-card :title="dialogTitle" prepend-icon="mdi-information-variant-box">
            <v-card-text>
              <v-textarea label="Add your new idea here" v-model="newIdeaValue" :rules="newIdeaMaxValue" counter autofocus></v-textarea>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="Cancel" color="red" variant="tonal" @click="cancelDialog"></v-btn>
              <v-btn text="Save idea" color="success" variant="tonal" @click="addNewIdea"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

    </div>
    <v-sheet class="pa-2 ma-2" border rounded :elevation="12">
      <v-list v-if="ideas.length > 0">
        <v-list-item v-for="idea in ideas" :title="idea.text">
        </v-list-item>
      </v-list>
      <span v-else>no elements</span>
    </v-sheet>
  </v-col>
</template>

<style scoped>
h2 {
  cursor: pointer;
}

.title {
  margin-left: 10px;
}

</style>
