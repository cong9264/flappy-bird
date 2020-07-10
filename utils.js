/**
 * 根据传入元素，类名以及内联样式创建元素
 * @param {String} elName 
 * @param {Array} classArr 
 * @param {Object} styleObj 
 */
function createEl(elName, classArr, styleObj) {
  var dom = document.createElement(elName);
  if (Array.isArray(classArr)) {
    for (var prop of classArr) {
      dom.classList.add(prop);
    }
  }
  if (Object.prototype.toString.call(styleObj) === '[object Object]') {
    for (var key in styleObj) {
      dom.style[key] = styleObj[key];
    }
  }
  return dom;
}

/**
 * 本地存储分数数据
 * @param {String} key 
 * @param {Array} value 
 */
function setLocal(key, value) {
  if (typeof (value) === 'object' && value !== null) {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
}

/**
 * 获取本地存储数据
 * @param {String} key 
 */
function getLocal(key) {
  var value = localStorage.getItem(key);
  if (!value) {
    return [];
  }
  if (value[0] === '[' || value[0] === '{') {
    return JSON.parse(value);
  }
  return value;
}

/**
 * 获取当前时间
 */
function getDate() {
  var time = new Date(),
    year = formatNum(time.getFullYear()),
    month = formatNum(time.getMonth() + 1),
    day = formatNum(time.getDate()),
    hour = formatNum(time.getHours()),
    minute = formatNum(time.getMinutes()),
    second = formatNum(time.getSeconds());
  return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
}

/**
 * 格式化数字
 * @param {Number} num 
 */
function formatNum(num) {
  return num < 10 ? '0' + num : num;
}