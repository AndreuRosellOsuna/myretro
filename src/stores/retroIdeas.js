import {defineStore} from 'pinia'
import pocketbase from "@/plugins/pocketbase.js";

export const useRetroIdeasStore = defineStore('retroIdeas', {
  state: () => ({
    roomId: "",
    roomName: "",
    /** @type {{ id: number, column: 'TWW' | 'TWNSW' | 'FF', text: string }[]} */
    ideas: [],
  }),
  getters: {
    thingsWentWell: state => state.ideas.filter(e => e.column === "TWW"),
    thingsWentNotSoWell: state => state.ideas.filter(e => e.column === "TWNSW"),
    feelings: state => state.ideas.filter(e => e.column === "FF"),
  },
  actions: {
    setRoomId(roomId) {
      this.roomId = roomId
      this.refreshIdeas()
    },
    async createRoom(roomName) {
      const newRoom = await pocketbase.collection("rooms").create({name: roomName})
      this.roomName = newRoom.name
      this.setRoomId(newRoom.id)
    },
    async joinRoom(roomId) {
      const room = await pocketbase.collection("rooms").getOne(roomId)
      this.roomName = room.name
      this.setRoomId(roomId)
    },
    async addIdea(column, text) {
      await pocketbase.collection("ideas").create({column, text, room: this.roomId})
    },
    refreshIdeas() {
      if (!this.roomId) return
      pocketbase.collection("ideas")
        .getFullList({ filter: `room.id = '${this.roomId}'`})
        .then(ideas => {
          const ideasFromServer = ideas.map(idea => ({id: idea.id, column: idea.column, text: idea.text}))
          this.ideas = []
          this.ideas.push(...ideasFromServer)
        })
    },
    async removeIdea(ideaId) {
      await pocketbase.collection("ideas").delete(ideaId)
    },
  }
})
