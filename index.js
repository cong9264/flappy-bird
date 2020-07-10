var bird = {
  /**
   * initaliza global
   */
  init() {
    this.initData();
    this.animate();
    this.handle();
    if (sessionStorage.getItem('play')) {
      this.gameStart();
    }
  },

  /**
   * initaliza data
   */
  initData() {
    this.el = document.getElementById('game');
    this.oBird = this.el.getElementsByClassName('bird')[0];
    this.oStart = this.el.getElementsByClassName('start')[0];
    this.oInGame = this.el.getElementsByClassName('in-game')[0];
    this.oScore = this.el.getElementsByClassName('score')[0];
    this.oMask = this.el.getElementsByClassName('mask')[0];
    this.oEnd = this.el.getElementsByClassName('end')[0];
    this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
    this.oRankList = this.el.getElementsByClassName('rank-list')[0];
    this.oRestart = this.el.getElementsByClassName('restart')[0];

    this.skyPosition = 0;
    this.skyStep = 2;
    this.birdTop = 220;
    this.birdStepY = 0;
    this.startColor = 'blue';
    this.startFlag = false;
    this.timer = null;
    this.minTop = 0;
    this.maxTop = 570;
    this.pipeLength = 7;
    this.pipeLastIndex = 6;
    this.pipeArr = [];
    this.score = 0;
    this.scoreArr = this.getScore();
  },

  /**
   * animation management
   */
  animate() {
    var count = 0;
    this.timer = setInterval(() => {
      this.skyMove();

      if (this.startFlag) {
        this.birdDrop();
        this.pipeMove();
      }

      if (++count % 10 === 0) {
        if (!this.startFlag) {
          this.birdJump();
          this.startBound();
        }
        this.birdFly(count);
      }
    }, 30);
  },

  /**
   * 获取本地分数
   */
  getScore() {
    return getLocal('score');
  },
  /**
   * background(sky) move
   */
  skyMove() {
    this.skyPosition -= this.skyStep;
    this.el.style.backgroundPositionX = this.skyPosition + 'px';
  },

  /**
   * bird jump
   */
  birdJump() {
    this.birdTop = this.birdTop === 220 ? 260 : 220;
    this.oBird.style.top = this.birdTop + 'px';
  },

  /**
   * bird fly
   */
  birdFly(count) {
    this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
  },

  /**
   * bird drop
   */
  birdDrop() {
    this.birdTop += ++this.birdStepY;
    this.oBird.style.top = this.birdTop + 'px';

    this.judgeKnock();
    this.addScore();
  },

  /**
   * start button bound
   */
  startBound() {
    var prevColor = this.startColor;
    this.startColor = prevColor === 'blue' ? 'white' : 'blue';

    this.oStart.classList.remove('start-' + prevColor);
    this.oStart.classList.add('start-' + this.startColor);
  },

  /**
   * 碰撞检测
   */
  judgeKnock() {
    this.judgeBoundary();
    this.judgePipe();
  },

  /**
   * 边界碰撞检测
   */
  judgeBoundary() {
    if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
      this.failGame();
    }
  },

  /**
   * 柱子碰撞检测
   */
  judgePipe() {
    var index = this.score % this.pipeLength,
      birdY = this.birdTop,
      pipeX = this.pipeArr[index].up.offsetLeft,
      pipeY = this.pipeArr[index].y;

    if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
      this.failGame();
    }
  },

  /**
   * 柱子移动
   */
  pipeMove() {
    for (var i = 0; i < this.pipeLength; i++) {
      var oUpPipe = this.pipeArr[i].up,
        oDownPipe = this.pipeArr[i].down,
        left = oUpPipe.offsetLeft - this.skyStep;

      if (left < -52) {
        var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
        oUpPipe.style.left = lastPipeLeft + 300 + 'px';
        oDownPipe.style.left = lastPipeLeft + 300 + 'px';
        this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;

        // var pipeHeight = this.getPipeHeight();

        // oUpPipe.style.height = pipeHeight.up + 'px';
        // oDownPipe.style.height = pipeHeight.down + 'px';
        continue;
      }
      oUpPipe.style.left = left + 'px';
      oDownPipe.style.left = left + 'px';
    }
  },

  /**
   * 加分
   */
  addScore() {
    var index = this.score % this.pipeLength,
      pipeX = this.pipeArr[index].up.offsetLeft;
    if (pipeX < 13) {
      this.oScore.innerText = ++this.score;
    }
  },
  /**
   * 统一管理,所有关于事件的函数
   */
  handle() {
    this.handleStart();
    this.handleClick();
    this.handleRestart();
  },

  /**
   * start button
   */
  handleStart() {
    this.oStart.onclick = this.gameStart.bind(this);
  },

  /**
   * restart button
   */
  handleRestart() {
    this.oRestart.onclick = () => {
      console.log(1111);
      sessionStorage.setItem('play', true);
      window.location.reload();
    };
  },

  /**
   * 
   */
  gameStart() {
    this.startFlag = true;
    this.oBird.style.left = '80px';
    this.oBird.style.transition = 'none';
    this.oStart.style.display = 'none';
    this.oScore.style.display = 'block';
    this.skyStep = 5;

    for (var i = 0; i < this.pipeLength; i++) {
      this.createPipe(300 * (i + 1));
    }
  },

  /**
   * 点击界面触发，小鸟蹦
   */
  handleClick() {
    this.el.onclick = (e) => {
      if (!e.target.classList.contains('start')) {
        this.birdStepY = -10;
      }
    }
  },

  /**
   * 创建柱子
   */
  createPipe(x) {
    var pipeHeight = this.getPipeHeight();
    oUpPipe = createEl('div', ['pipe', 'pipe-up'], { 'height': pipeHeight.up + 'px', 'left': x + 'px' }),
      oDownPipe = createEl('div', ['pipe', 'pipe-down'], { 'height': pipeHeight.down + 'px', 'left': x + 'px' });

    this.oInGame.appendChild(oUpPipe);
    this.oInGame.appendChild(oDownPipe);

    this.pipeArr.push({
      up: oUpPipe,
      down: oDownPipe,
      y: [pipeHeight.up, pipeHeight.up + 150]
    });
  },

  getPipeHeight() {
    var upHeight = Math.floor(Math.random() * 175) + 50,
      downHeight = 600 - 150 - upHeight;

    return {
      up: upHeight,
      down: downHeight
    };
  },

  /**
   * 添加分数，存储
   */
  setScore() {
    this.scoreArr.push({
      score: this.score,
      time: getDate()
    });

    this.scoreArr.sort((a, b) => b.score - a.score);

    setLocal('score', this.scoreArr);
  },

  /**
   * game fail
   */
  failGame() {
    clearInterval(this.timer);

    this.setScore();
    this.renderRankList();

    this.oMask.style.display = 'block';
    this.oEnd.style.display = 'block';
    this.oBird.style.display = 'none';
    this.oScore.style.display = 'none';
    this.oFinalScore.innerText = this.score;
  },

  /**
   * 分数列表渲染
   */
  renderRankList() {
    var template = '';
    for (var i = 0; i < 8; i++) {
      template += `
      <li class="rank-item">
        <span class="rank-no ${this.degreeClass(i)} ">${i + 1}</span>
        <span class="rank-score">${this.scoreArr[i].score}</span>
        <span class="rank-time">${this.scoreArr[i].time}</span>
      </li>`;
    }
    this.oRankList.innerHTML = template;
  },

  /**
   * 排名匹配
   */
  degreeClass(i) {
    var degreeClass = '';
    switch (i) {
      case 0:
        return degreeClass = 'first';
      case 1:
        return degreeClass = 'second';
      case 2:
        return degreeClass = 'third';
      default:
        return degreeClass = '';
    }
  }
};