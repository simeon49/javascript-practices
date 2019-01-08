
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


const MAX_DISTANCE = 5;
/**
 * Node
 */
class Node {
  constructor(word, data) {
    this.word = word;
    this.data = data;
    this.dsNodes = [];
    for (let i = 0; i < MAX_DISTANCE; i ++) {
      this.dsNodes.push([]);
    }
  }

  append(word, data) {
    if (this.word === word) {
      return this;
    }
    let distance = Math.abs(word.length - this.word.length);
    if (distance < MAX_DISTANCE) {
      // const start = Date.now();
      distance = minDistanceSteps(this.word, word);
      // console.log(Date.now() - start);
    }
    if (distance < MAX_DISTANCE) {
      const newNode = new Node(word, data);
      this.dsNodes[distance].push(newNode);
      return newNode;
    }

    // else {
    //   for (let t = MAX_DISTANCE - 1; t > 0; t --) {
    //     const nodes = this.dsNodes[t];
    //     for (let i = 0; i < nodes.length; i ++) {
    //       const node = nodes[i];
    //       const newNode = node.append(word, data);
    //       if (newNode) {
    //         return newNode;
    //       }
    //     }
    //   }
    // }
  }

  search(s, maxDistance) {
    const lst = [];

    const distance = minDistanceSteps(this.word, s);
    if (distance <= maxDistance) {
      lst.push({ word: this.word, distance: distance, data: this.data });
    }
    for (let i = 0; i < MAX_DISTANCE && distance + i <= maxDistance; i ++) {
      const nodes = this.dsNodes[i];
      for (let j = 0; j < nodes.length; j ++) {
        lst.concat(nodes[j].search(s, maxDistance));
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
    this.freeList = null;
  }

  load(lst) {
    console.log('loading word data...');
    if (!lst.length) {
      this.tree = null;
      this.freeList = [];
      return;
    }

    this.tree = new Node(lst[0][0], lst[0]);
    let newNodes = [this.tree]
      , freeList = lst.slice(1);

    let nodeCount = 1;
    while (freeList.length > 0 && newNodes.length > 0) {
      console.log(`freeList: ${freeList.length}, nodes: ${nodeCount}`);
      let curNewNodes = []
        , curFreeList = [];

      for (let i = 0; i < freeList.length; i ++) {
        const item = freeList[i];
        let appendOK = false;
        for (let j = 0; j < newNodes.length; j ++) {
          const root = newNodes[j]
            , node = root.append(item[0], item);
          if (node) {
            // console.log(`    ${item[0]} append to ${root.word}: ok`);
            curNewNodes.push(node);
            nodeCount ++;
            appendOK = true;
            break;
          }
        }
        if (!appendOK) {
          curFreeList.push(item);
        }
      }
      newNodes = curNewNodes;
      freeList = curFreeList;
    }
    this.freeList = freeList;
    console.log('finished.');
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
    console.log('searching....');

    const lst = this.tree.search(s, maxDistance);
    if (this.freeList) {
      for (let i = 0; i < this.freeList.length && lst.length < maxCount; i ++) {
        const item = this.freeList[i]
          , distance = minDistanceSteps(s, item[0]);
        if (distance <= maxDistance) {
          lst.push({ word: item[0], distance: distance, data: item});
        }
      }
    }
    console.log('finished.');
    return lst.slice(0, maxCount);
  }
}
