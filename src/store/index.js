import Vuex from 'vuex'

export const store = () => new Vuex.Store({

  state: {
    currentTurn: 'BLACK',
    blackNum: 2,
    whiteNum: 2
  },
  mutations: {
    switchTurn (state) {
      if(state.currentTurn == 'BLACK') state.currentTurn = 'WHITE';
      else state.currentTurn = 'BLACK';
    },
    setBlackNum(state, num) {
      state.blackNum = num;
    },
    setWhiteNum(state, num) {
      state.whiteNum = num;
    }
  }
})

export default store
