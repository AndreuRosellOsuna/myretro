import {defineStore} from 'pinia'

export const useRetroIdeasStore = defineStore('retroIdeas', {
  state: () => ({
    /** @type {{ id: number, column: 'TWW' | 'TWNSW' | 'FF', text: string }[]} */
    ideas: [
      {id: 11, column: "TWW", text: 'Hello'},
      {id: 12, column: "TWW", text: 'Hello'},
      {id: 13, column: "TWW", text: 'Hello'},
      {id: 14, column: "TWW", text: 'Hello'},
      {id: 21, column: "TWNSW", text: 'Hello'},
      {id: 22, column: "TWNSW", text: 'Hello'},
      {id: 31, column: "FF", text: 'Hello'},
      {id: 32, column: "FF", text: 'Hello'},
      {id: 33, column: "FF", text: 'Hello'},
    ]
  }),
  getters: {
    thingsWentWell: state => state.ideas.filter(e => e.column === "TWW"),
    thingsWentNotSoWell: state => state.ideas.filter(e => e.column === "TWNSW"),
    feelings: state => state.ideas.filter(e => e.column === "FF"),
  },
  actions: {
    addIdea(column, text) {
      this.ideas.push({id: this.ideas.size, column, text})
    }
  }
})
