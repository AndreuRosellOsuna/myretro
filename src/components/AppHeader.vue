<script setup>

import {ref} from "vue";
import {useRetroIdeasStore} from "@/stores/retroIdeas.js";
import {storeToRefs} from "pinia";
const ideasStore = useRetroIdeasStore()

const retroRoomId = ref('')
const roomIdRules = {
  required: value => !!value || 'Required.',
  max: value => value.length <= 15 || 'Max 15 characters',
}
const roomNameRules = {
  required: value => !!value || 'Required.',
  max: value => value.length <= 50 || 'Max 50 characters',
}

const {roomName} = storeToRefs(ideasStore)

const openAddRoomDialog = ref(false)
const newRoomName = ref("")

function cleanAndCloseDialog() {
  openAddRoomDialog.value = false
  newRoomName.value = ""
}

function cancelDialog() {
  cleanAndCloseDialog()
}

const createNewRoom = () => {
  ideasStore.createRoom(newRoomName.value)
  cleanAndCloseDialog()
}

const enterRoom = () => {
  if (!retroRoomId.value) return
  ideasStore.joinRoom(retroRoomId.value)
}

</script>

<template>
  <v-app-bar>
    <v-app-bar-title>
      <template v-slot:default>
        My Retro <span v-if="roomName" class="text-amber font-weight-semibold">{{roomName}}</span>
      </template>
    </v-app-bar-title>
    <template v-slot:append>
      <div class="mr-2 room-input-container">
        <v-text-field
          v-model="retroRoomId"
          type="input"
          label="Retro Room"
          placeholder="123ABC"
          hint="Enter the room ID to join"
          density="compact"
          append-icon="mdi-send"
          @click:append="enterRoom"
          :rules="[roomIdRules.required, roomIdRules.max]"
          prepend-icon="mdi-plus-circle"
          @click:prepend="openAddRoomDialog = true"
          clearable
        ></v-text-field>
      </div>
    </template>
  </v-app-bar>

  <v-dialog max-width="700" v-model="openAddRoomDialog" persistent>
    <template v-slot:default>
      <v-card title="Create new room" prepend-icon="mdi-information-variant-box">
        <v-card-text>
          <v-text-field label="Room name"
                        v-model="newRoomName"
                        :rules="[roomNameRules.required, roomNameRules.max]"
                        counter
                        autofocus>
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cancel" color="red" variant="tonal" @click="cancelDialog"></v-btn>
          <v-btn text="Create room" color="success" variant="tonal" @click="createNewRoom"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.room-input-container {
  width: 250px;
}
</style>
