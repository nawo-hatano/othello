import Vuex from 'vuex'

export const store = () => new Vuex.Store({

  state: {
    currentTurn: 'BLACK',
    blackNum: 2,
    whiteNum: 2,
    canPutFlag: false,
    resetFlag: false,
    endFlag: false
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
    },
    setPutFlag(state, canPutState) {
      state.canPutFlag = canPutState;
    },
    setResetFlag(state, resetState) {
      state.resetFlag = resetState;
    },
    setEndFlag(state, endState) {
      state.endFlag = endState;
    }
  }
})

export default store
