<script setup>

import {ref} from "vue";
import {useRoomStore} from "@/stores/roomStore.js";
import {storeToRefs} from "pinia";

const emit = defineEmits(['addNewIdea', 'removeIdea'])
const { column } = defineProps({
  column: {
    type: String,
    required: true,
    validator: value => ['TWW', 'TWNSW', 'FF'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  dialogTitle: {
    type: String,
    required: true,
  },
  ideas: [{
    id: String,
    column: 'TWW' | 'TWNSW' | 'FF',
    text: String
  }]
})

const openAddIdeaDialog = ref(false)
const newIdeaValue = ref('')
const newIdeaMaxValue = [v => v.length < 100 || 'Max 100 characters']

const roomStore = useRoomStore()
const {editable} = storeToRefs(roomStore)

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

function openAddIdeaDialogFunction() {
  if(editable.value) {
    return openAddIdeaDialog.value = true
  }
}

</script>

<template>
  <v-col class="mx-5 rounded ideas-column" :class="{'disabled': !editable}">
    <div class="ml-3" @click="openAddIdeaDialogFunction" >
      <h2 class="ideas-column-title"><v-icon color="black" icon="mdi-plus-circle"></v-icon >{{ title }}</h2>
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
          <v-list-item v-for="idea in ideas">
            <v-sheet class="d-flex justify-space-between pa-3 ma-1" border rounded :elevation="6">
              <span>{{idea.text}}</span>
              <span class="align-self-center">
                <v-icon icon="mdi-pencil-outline" class="cursor-pointer" @click=""></v-icon>
                <v-icon icon="mdi-chat-remove" class="cursor-pointer" @click="$emit('removeIdea', idea.id)"></v-icon>
              </span>
            </v-sheet>
          </v-list-item>
      </v-list>
      <span v-else>no elements</span>
    </v-sheet>
  </v-col>
</template>

<style >
.ideas-column-title {
  cursor: pointer;
}
.disabled .ideas-column-title {
  cursor: not-allowed;
}
.ideas-column {
  box-shadow: 5px 5px 2px rgba(0,0,0,0.45);
  opacity: 0.8;
}
.ideas-column.disabled {
  cursor: not-allowed !important;
  opacity: 0.60;
}
</style>
