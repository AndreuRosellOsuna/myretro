import {defineStore} from 'pinia'
import pocketbase from "@/plugins/pocketbase.js";
import {useIdeasStore} from "@/stores/ideasStore.js";

export const useRoomStore = defineStore('roomStore', {
  state: () => ({
    roomId: "",
    roomName: "",
  }),
  actions: {
    setRoomId(roomId) {
      this.$patch({roomId})
      const ideasStore = useIdeasStore()
      ideasStore.refreshIdeas()
    },
    async createRoom(roomName) {
      const newRoom = await pocketbase.collection("rooms").create({name: roomName})
      this.$patch({roomName: newRoom.name})
      this.setRoomId(newRoom.id)
    },
    async joinRoom(roomId) {
      const room = await pocketbase.collection("rooms").getOne(roomId)
      this.$patch({roomName: room.name})
      this.setRoomId(roomId)
    },
  }
})
