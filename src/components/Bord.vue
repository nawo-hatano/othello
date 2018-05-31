<template>
  <canvas
    ref="canvas"
    :width="canvasSize"
    :height="canvasSize"
    @click="clickBoard"
  ></canvas>
</template>

<style>
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
      turn: 'BLACK',
      board: new Array(SQUARES_N),
      judgeBoard: new Array(SQUARES_N),
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    currentTurn() {
      return this.$store.state.currentTurn;
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
      this.squareSize = this.canvasSize / SQUARES_N;
    },
    drawCanvas() {
      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
      this.drawBoard();
      this.drawLine();
      this.drawStone();
    },
    initBoard() {
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
      this.ctx.fillStyle = "#008080";
      this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
    },
    drawLine() {
      this.ctx.lineWidth = 1;
      for(let i = 0; i < SQUARES_N + 2; i++) {
        const x = i * this.squareSize;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvasSize)
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, x);
        this.ctx.lineTo(this.canvasSize, x);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    },
    drawStone() {
      for(let x in this.board) {
        for(let y in this.board){
          if(this.board[x][y] == EMPTY) continue;

          if(this.board[x][y] == BLACK) this.ctx.fillStyle = BLACK_COLOR;
          else if(this.board[x][y] == WHITE) this.ctx.fillStyle = WHITE_COLOR;
          this.ctx.beginPath();
          this.ctx.arc(x * this.squareSize + this.squareSize * .5, y * this.squareSize + this.squareSize * .5, this.squareSize * .4 , 0, Math.PI * 2.0, true)
          this.ctx.fill();
        }
      }
    },
    clickBoard(e) {
      const x = Math.floor(e.offsetX / this.squareSize),
            y = Math.floor(e.offsetY / this.squareSize);
      if(!this.judgeBoard[x][y].size) return;
      this.board[x][y] = this.currentTurn;
      this.reverseStone(x, y);
      this.$store.commit('switchTurn');
      this.computeReverse();
      this.drawCanvas();
      this.computeStone();
    },
    computeReverse() {
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
        while(true) {
          if(nextX < 0 || nextX >= SQUARES_N || nextY < 0 || nextY >= SQUARES_N) break;
          if(this.board[nextX][nextY] == EMPTY) break;
          if(this.board[nextX][nextY] == this.currentTurn) break;
          this.board[nextX][nextY] = this.currentTurn;
          nextX += vec.x;
          nextY += vec.y;
        }
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
    }
  }
}
</script>
