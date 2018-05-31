<template>
  <section class="container">
    <header></header>
    <main>
      <div class="contents">
        <Bord></Bord>
      </div>
      <div class="contents">
        <OthelloInfo></OthelloInfo>
      </div>
    </main>
    <footer></footer>
  </section>
</template>

<script>
import OthelloInfo from '~/components/OthelloInfo.vue'
import Bord from '~/components/Bord.vue'

export default {
  components: {
    Bord,
    OthelloInfo
  },
}
</script>

<style>
.container {
  padding: 20px;
}
</style>
