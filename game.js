var bird = {
  /**
   * initaliza
   */
  init() {
    this.initData();
    this.animate();
    this.handle();
  },

  /**
   * initaliza data
   */
  initData() {
    this.el = document.getElementById('game');
    this.oBird = this.el.getElementsByClassName('bird')[0];
    this.oStart = this.el.getElementsByClassName('start')[0];
    this.oScore = this.el.getElementsByClassName('score')[0];
    this.oMask = this.el.getElementsByClassName('mask')[0];
    this.oEnd = this.el.getElementsByClassName('end')[0];
    this.skyPosition = 0;
    this.skyStep = 2;
    this.birdTop = 220;
    this.birdStepY = 0;
    this.startColor = 'blue';
    this.startFlag = false;
    this.minTop = 0;
    this.maxTop = 570;
  },

  /**
   * animation management
   */
  animate() {
    var count = 0;
    timer = setInterval(() => {
      this.skyMove();
      if (this.startFlag) {
        this.birdDrop();
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

  },
  /**
   * 统一管理,所有关于事件的函数
   */
  handle() {
    this.handleStart();
  },
  /**
   * start button
   */
  handleStart() {
    this.oStart.onclick = () => {
      this.startFlag = true;
      this.oBird.style.left = '80px';
      this.oStart.style.display = 'none';
      this.oScore.style.display = 'block';
      this.skyStep = 5;
    };
  },

  failGame() {
    clearInterval(this.timer);
    this.oMask.style.display = 'block';
    this.oEnd.style.display = 'block';
    this.oBird.style.display = 'none';
    this.oScore.style.display = 'none';
  },
};