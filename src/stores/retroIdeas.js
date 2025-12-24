import {defineStore} from 'pinia'
import pocketbase from "@/plugins/pocketbase.js";

export const useRetroIdeasStore = defineStore('retroIdeas', {
  state: () => ({
    /** @type {{ id: number, column: 'TWW' | 'TWNSW' | 'FF', text: string }[]} */
    ideas: []
  }),
  getters: {
    thingsWentWell: state => state.ideas.filter(e => e.column === "TWW"),
    thingsWentNotSoWell: state => state.ideas.filter(e => e.column === "TWNSW"),
    feelings: state => state.ideas.filter(e => e.column === "FF"),
  },
  actions: {
    async addIdea(column, text) {
      await pocketbase.collection("ideas").create({column, text})
    },
    refreshIdeas() {
      pocketbase.collection("ideas")
        .getFullList()
        .then(ideas => {
          const ideasFromServer = ideas.map(idea => ({id: idea.id, column: idea.column, text: idea.text}))
          this.$reset()
          this.ideas.push(...ideasFromServer)
        })
    }
  }
})
