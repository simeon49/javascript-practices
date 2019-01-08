
function minDistanceSteps(s1, s2) {
  const len1 = s1.length
    , len2 = s2.length;

  if (len1 === 0) {
    return len2;
  } else if (len2 === 0) {
    return len1;
  }

  const matrix = [];
  for (let i = 0; i <= len1; i ++) {
    matrix[i] = [i];
  }
  for (let j = 1; j <= len2; j ++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= len1; i ++) {
    for (let j = 1; j <= len2; j ++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j]  = matrix[i - 1][j - 1];
      } else {
        let countAdd = matrix[i][j - 1] + 1;
        let countDelete = matrix[i - 1][j] + 1;
        let countChange = matrix[i - 1][j - 1] + 1;
        matrix[i][j] = Math.min(countAdd, countDelete, countChange);
      }
    }
  }
  // console.log(matrix);
  return matrix[len1][len2];
}

/**
 * Node
 */
class Node {
  constructor(word, data) {
    this.word = word;
    this.data = data;
    this.dsNodesDic = {};
  }

  append(word, data) {
    if (this.word === word) {
      return this;
    }
    const distance = minDistanceSteps(this.word, word);
    const newNode = new Node(word, data);
    if (!this.dsNodesDic[distance]) {
      this.dsNodesDic[distance] = [];
    }
    this.dsNodesDic[distance].push(newNode);
  }

  search(s, maxDistance) {
    let lst = [];

    const rootDistance = minDistanceSteps(this.word, s);
    if (rootDistance <= maxDistance) {
      lst.push({ word: this.word, distance: rootDistance, data: this.data });
    }
    for (let i = rootDistance - maxDistance; i < rootDistance + maxDistance; i ++) {
      const nodes = this.dsNodesDic[i];
      if (!nodes) {
        continue;
      }
      for (let i = 0; i < nodes.length; i ++) {
        const node = nodes[i];
        const distance = minDistanceSteps(node.word, s);
        if (distance < maxDistance) {
          lst.push({ word: node.word, distance: distance, data: node.data });
        }
      }
    }
    return lst;
  }
}


/**
 * 拼写补全
 */
class WordSearch {
  constructor() {
    this.tree = null;
  }

  load(lst) {
    if (!lst.length) {
      this.tree = null;
      return;
    }

    this.tree = new Node(lst[0][0], lst[0]);
    for (let i = 0; i < lst.length; i ++) {
      const item = lst[i];
      this.tree.append(item[0], item);
    }
  }


  /**
   * 搜索
   * @param {*} s
   * @param {*} max
   */
  search(s, maxDistance, maxCount=20) {
    if (!this.tree) {
      return [];
    }
    let lst = this.tree.search(s, maxDistance);
    lst.sort((a, b) => a.distance - b.distance);
    return lst.slice(0, maxCount);
  }
}
