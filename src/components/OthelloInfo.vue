<template>
  <div>
    <label>Current Turn: </label><span>{{$store.state.currentTurn}}</span><br>
    <label>white: </label><span>{{$store.state.whiteNum}}</span><br>
    <label>black: </label><span>{{$store.state.blackNum}}</span><br>
    <label v-if="!$store.state.canPutFlag">
      どこにも置けません！
      <button @click="clickPass()">PASS</button>
    </label>
    <span v-if="$store.state.endFlag == 'BLACK'">BLACK WIN!</span>
    <span v-if="$store.state.endFlag == 'WHITE'">WHITE WIN!</span>
    <span v-if="$store.state.endFlag == 'DRAW'"></span>

    <button @click="clickReset()">RESET</button>
  </div>
</template>

<style>
</style>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    clickPass() {
      this.$store.commit('switchTurn');
    },
    clickReset() {
      this.$store.commit('setResetFlag', true);
    }
  }
}
</script>
