import {defineStore} from 'pinia'
import pocketbase from "@/plugins/pocketbase.js";
import {useIdeasStore} from "@/stores/ideasStore.js";

export const useRoomStore = defineStore('roomStore', {
  state: () => ({
    roomId: "",
    roomName: "",
    editable: undefined,
    finished: undefined,
    ideasEndDate: "",
  }),
  actions: {
    loadIdeas() {
      const ideasStore = useIdeasStore()
      ideasStore.refreshIdeas()
    },
    async createRoom(roomName) {
      const newRoom = await pocketbase.collection("rooms").create({name: roomName, editable: true})
      this.$patch({roomId: newRoom.id, roomName: newRoom.name, editable: false, finished: false})
      this.loadIdeas()
    },
    async joinRoom(roomId) {
      const room = await pocketbase.collection("rooms").getOne(roomId)
      this.$patch({roomId: room.id, roomName: room.name, editable: room.editable, finished: room.finished, ideasEndDate: room.ideasEndDate})
      this.loadIdeas()
    },
    async setEndTimeAndEnableEditing() {
      const now = new Date()
      now.setSeconds(now.getSeconds() + 2 * 60);
      await pocketbase.collection("rooms").update(this.roomId, {ideasEndDate: now.toUTCString(), editable: true})
    },
    async finishEditing() {
      await pocketbase.collection("rooms").update(this.roomId, {editable: false, finished: true})
    },
    async resetTimer() {
      await pocketbase.collection("rooms").update(this.roomId, {ideasEndDate: null, editable: false, finished: false})
    },
    async subscribeToRoom() {
      return pocketbase.collection("rooms").subscribe(this.roomId, event => {
        this.$patch({ideasEndDate: event.record.ideasEndDate, editable: event.record.editable, finished: event.record.finished})
      })
    }
  }
})
