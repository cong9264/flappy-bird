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

function setLocal(key, value) {
  if (typeof (value) === 'object' && value !== null) {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
}

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

function formatNum(num) {
  return num < 10 ? '0' + num : num;
}