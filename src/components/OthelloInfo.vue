<template>
  <div>
    <label>Current Turn: </label><span>{{$store.state.currentTurn}}</span><br>
    <label>white: </label><span>{{$store.state.whiteNum}}</span><br>
    <label>black: </label><span>{{$store.state.blackNum}}</span><br>

    <!-- <button @click="onClick()">RESET</button> -->
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
  method: {
    // onClick() {

    // }
  }
}
</script>
