<template>
  <div class="canvas-wrapper">
    <canvas
      ref="canvasBg"
      :width="canvasSize"
      :height="canvasSize"
    ></canvas>
    <canvas
      ref="canvas"
      :width="canvasSize"
      :height="canvasSize"
      @click="clickBoard"
    ></canvas>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  position: relative;
  height: 400px;
  widows: 400px;
}
canvas {
  position: absolute;
}
</style>

<script>
const SQUARES_N = 8,
      EMPTY = 'EMPTY',
      BLACK = 'BLACK',
      WHITE = 'WHITE',
      BLACK_COLOR = "#2E2E2E",
      WHITE_COLOR = "#FFF8DC",
      VECTOR = [{x: 0, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}, {x: -1, y: 0}, {x: 1, y: -1}, {x: -1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}];

export default {
  data() {
    return {
      //なんかVUEの値にしていると重くなるかもとの情報を見たので、後ほど調整したい
      //http://chibinowa.net/note/vuejs/vue-26.html
      canvasSize: 400, //のちほどリサイズ対応したい
      board: new Array(SQUARES_N),
      judgeBoard: new Array(SQUARES_N)
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    currentTurn() {
      this.computeReverse();
    },
    resetFlag() {
      this.init();
      this.$store.commit('setResetFlag', false);
      this.$store.commit('setEndFlag', false);
    }
  },
  computed: {
    currentTurn() {
      return this.$store.state.currentTurn;
    },
    resetFlag() {
      return this.$store.state.resetFlag;
    }
  },
  methods: {
    init() {
      this.setParams();
      this.initBoard();
      this.drawCanvas();
    },
    setParams() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.ctxBg = this.$refs.canvasBg.getContext("2d");
      this.squareSize = this.canvasSize / SQUARES_N;
    },
    drawCanvas() {
      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
      this.drawStone();
    },
    initBoard() {
      this.drawBoard();
      for(let i = 0; i < SQUARES_N; i++) {
        this.board[i] = new Array(SQUARES_N).fill(EMPTY);
        this.judgeBoard[i] = new Array(SQUARES_N).fill({size: false, vec: new Array()});
      }
      const center = SQUARES_N / 2 - 1;
      this.board[center][center] = WHITE;
      this.board[center + 1][center] = BLACK;
      this.board[center][center + 1] = BLACK;
      this.board[center + 1][center + 1] = WHITE;
      this.computeReverse();
    },
    drawBoard() {
      this.ctxBg.fillStyle = "#008080";
      this.ctxBg.fillRect(0, 0, this.canvasSize, this.canvasSize);
      this.ctxBg.lineWidth = 1;
      this.ctxBg.beginPath();
      for(let i = 0; i < SQUARES_N + 2; i++) {
        const x = i * this.squareSize;
        this.ctxBg.moveTo(x, 0);
        this.ctxBg.lineTo(x, this.canvasSize)
        this.ctxBg.moveTo(0, x);
        this.ctxBg.lineTo(this.canvasSize, x);
      }
      this.ctxBg.stroke();
    },
    drawStone() {
      for(let x in this.board) {
        for(let y in this.board){
          this.drawPutStone(x, y);
        }
      }
    },
    clickBoard(e) {
      const x = Math.floor(e.offsetX / this.squareSize),
            y = Math.floor(e.offsetY / this.squareSize);
      if(!this.judgeBoard[x][y].size) return;
      this.board[x][y] = this.currentTurn;
      this.drawPutStone(x, y);
      this.reverseStone(x, y);
      this.$store.commit('switchTurn');
      this.computeReverse();
      this.computeStone();
    },
    drawPutStone(x, y) {
      if(this.board[x][y] == EMPTY) return;

      if(this.board[x][y] == BLACK) this.ctx.fillStyle = BLACK_COLOR;
      else if(this.board[x][y] == WHITE) this.ctx.fillStyle = WHITE_COLOR;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x * this.squareSize + this.squareSize * .5, y * this.squareSize + this.squareSize * .5, this.squareSize * .4, this.squareSize * .4, 0, Math.PI * 2.0, true)
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    },
    computeReverse() {
    this.$store.commit('setPutFlag', false);
      for(let x in this.board) {
        for(let y in this.board){
          this.judgeBoard[x][y] = {size: false, vec: new Array()};
          if(this.board[x][y] != EMPTY) continue;

          for(let vec of VECTOR) {
            let nextX = Number(x) + vec.x,
                nextY = Number(y) + vec.y;
            if(nextX < 0 || nextX >= SQUARES_N || nextY < 0 || nextY >= SQUARES_N) continue;
            if(!this.board[nextX][nextY]) continue;
            if(this.board[nextX][nextY] == EMPTY || this.board[nextX][nextY] == this.currentTurn) continue;
            let sum = 1;
            while(true) {
              nextX += vec.x;
              nextY += vec.y;
              if(nextX < 0 || nextX >= SQUARES_N || nextY < 0 || nextY >= SQUARES_N) break;
              if(this.board[nextX][nextY] == EMPTY) break;
              if(this.board[nextX][nextY] == this.currentTurn) {
                this.judgeBoard[x][y].size = this.judgeBoard[x][y].size + sum || sum;
                this.judgeBoard[x][y].vec.push(vec);
                this.$store.commit('setPutFlag', true);
                break;
              }
              sum++;
            }
          }
        }
      }
    },
    reverseStone(x, y) {
      for(let vec of this.judgeBoard[x][y].vec){
        let nextX = x + vec.x,
            nextY = y + vec.y;
        this.ctx.save();
        while(true) {
          if(nextX < 0 || nextX >= SQUARES_N || nextY < 0 || nextY >= SQUARES_N) break;
          if(this.board[nextX][nextY] == EMPTY) break;
          if(this.board[nextX][nextY] == this.currentTurn) break;
          this.board[nextX][nextY] = this.currentTurn;
          this.animationStone(nextX, nextY, this.currentTurn);
          nextX += vec.x;
          nextY += vec.y;
        }
        this.ctx.restore();
      }
    },
    animationStone(x, y, currentTurn) {
      const lastRender = new Date();
      let value = 100;
      const _ = this;
      animation();

      function animation() {
        let delta = new Date() - lastRender;
        _.ctx.clearRect(x * _.squareSize, y * _.squareSize, _.squareSize, _.squareSize);
        _.ctx.save();
        _.ctx.beginPath();
        value = value - delta/10;
        if(currentTurn != BLACK) _.ctx.fillStyle = BLACK_COLOR;
        else _.ctx.fillStyle = WHITE_COLOR;

        if(value < -100) value = -100;
        if(value < 0) {
          if(currentTurn == BLACK) _.ctx.fillStyle = BLACK_COLOR;
          else _.ctx.fillStyle = WHITE_COLOR;
        }
        _.ctx.translate(x * _.squareSize + _.squareSize * .5, y * _.squareSize + _.squareSize * .5, _.squareSize * .4);
        _.ctx.scale(value/100, 1);
        _.ctx.arc(0, 0, _.squareSize * .4 , 0, Math.PI * 2.0, true)
        _.ctx.closePath();
        if(currentTurn != BLACK) _.ctx.fillStyle = BLACK_COLOR;
        else _.ctx.fillStyle = WHITE_COLOR;

        if(value < 0) {
          if(currentTurn == BLACK) _.ctx.fillStyle = BLACK_COLOR;
          else _.ctx.fillStyle = WHITE_COLOR;
        }
        _.ctx.fill();
        _.ctx.restore();
        if(value == -100) return;
        requestAnimationFrame(animation);
      }
    },
    computeStone() {
      let blackNum = 0,
          whiteNum = 0;
      for(let x in this.board) {
        for(let y in this.board){
          if(this.board[x][y] == BLACK) blackNum++;
          else if(this.board[x][y] == WHITE) whiteNum++;
        }
      }
      this.$store.commit('setBlackNum', blackNum);
      this.$store.commit('setWhiteNum', whiteNum);
      if(blackNum + whiteNum >= SQUARES_N * SQUARES_N)
        if(blackNum > whiteNum) this.$store.commit('setEndFlag', 'BLACK')
        else if(whiteNum > blackNum) this.$store.commit('setEndFlag', 'WHITE')
        else this.$store.commit('setEndFlag', 'DRAW')
    }
  }
}
</script>
