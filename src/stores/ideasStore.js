import {defineStore} from 'pinia'
import pocketbase from "@/plugins/pocketbase.js";
import {useRoomStore} from "@/stores/roomStore.js";

export const useIdeasStore = defineStore('ideasStore', {
  state: () => ({
    /** @type {{ id: number, column: 'TWW' | 'TWNSW' | 'FF', text: string }[]} */
    ideas: [],
  }),
  getters: {
    thingsWentWell: state => state.ideas.filter(e => e.column === "TWW"),
    thingsWentNotSoWell: state => state.ideas.filter(e => e.column === "TWNSW"),
    feelings: state => state.ideas.filter(e => e.column === "FF"),
  },
  actions: {
    async addIdea(column, text) {
      const roomStore = useRoomStore()
      await pocketbase.collection("ideas").create({column, text, room: roomStore.roomId})
    },
    refreshIdeas() {
      const roomStore = useRoomStore()
      if (!roomStore.roomId) return
      pocketbase.collection("ideas")
        .getFullList({ filter: `room.id = '${roomStore.roomId}'`})
        .then(ideas => {
          const ideasFromServer = ideas.map(idea => ({id: idea.id, column: idea.column, text: idea.text}))
          this.$patch({ideas: ideasFromServer})
        })
    },
    async removeIdea(ideaId) {
      await pocketbase.collection("ideas").delete(ideaId)
    },
    subscribeToIdeas(roomId) {
      return pocketbase.collection("ideas").subscribe("*", event => {
        this.refreshIdeas()
      }, {
        filter: `room.id = '${roomId}'`
      })
    },
  }
})
