/**
 * 判断两个节点是否为相同的节点
 * @param {*} oldNode
 * @param {*} newNode
 */
function isSameNode(oldNode, newNode) {
  return oldNode.tagName === newNode.tagName && oldNode.key === newNode.key;
}

/**
 * diff
 * @param {*} oldNode
 * @param {*} newNode
 */
function diff(oldNode, newNode) {
  const patchDic = {};
  computeNodeChange(oldNode, newNode, 0, patchDic);
  return patchDic;
}

/**
 * 计算节点变化
 * @param {*} oldNode
 * @param {*} newNode
 * @param {*} oldIndex
 * @param {*} patchDic
 */
function computeNodeChange(oldNode, newNode, oldIndex, patchDic) {
  const curPatchs = [];
  // 相同节点
  if (isSameNode(oldNode, newNode)) {
    // 计算节点属性差异
    computePropsChange(oldNode, newNode, curPatchs);

    // 计算子节点差异
    computeChildrenChange(oldNode, newNode, curPatchs, oldIndex, patchDic);
  }
  if (curPatchs.length) {
    patchDic[oldIndex] = curPatchs;
  }
}

/**
 * 计算节点属性差异
 * @param {*} oldNode
 * @param {*} newNode
 * @param {*} curPatchs
 */
function computePropsChange(oldNode, newNode, curPatchs) {
  const props = {};
  // 变更的属性
  for (let k in oldNode.props) {
    if (oldNode.props[k] !== newNode.props[k]) {
      props[k] = newNode.props[k];
    }
  }
  // 新添加的属性
  for (let k in newNode.props) {
    if (!oldNode.props.hasOwnProperty(k)) {
      props[k] = newNode.props[k];
    }
  }
  if (!isEmpty(props)) {
    curPatchs.push({ type: 'PROPOS', props: props });
  }
}

/**
 * 计算子节点差异
 * @param {*} oldNode
 * @param {*} newNode
 * @param {*} curPatchs
 * @param {*} index
 * @param {*} patchDic
 */
function computeChildrenChange(oldNode, newNode, curPatchs, index, patchDic) {
  const oldCh = oldNode.children ? oldNode.children : []
    , newCh = newNode.children ? newNode.children : [];

    const { tmpCh, steps } = computeChildrenOrderChange(oldCh, newCh);
    if (steps.length) {
      curPatchs.push({ type: 'CHILDREN', steps: steps });
    }

    let childrenIndex = index;
    let leftNode = null;
    for (let i = 0; i < tmpCh.length; i++) {
      if (leftNode && leftNode.childrenCount) {
        childrenIndex += leftNode.childrenCount;
      }
      childrenIndex ++;
      if (tmpCh[i]) {
        if (!tmpCh[i] || !newCh[i]) return;
        computeNodeChange(tmpCh[i], newCh[i], childrenIndex, patchDic);
      }
      leftNode = newCh[i];
    }
}

/**
 * 计算子节点顺序变化
 * @param {*} oldCh
 * @param {*} newCh
 */
function computeChildrenOrderChange(oldCh, newCh) {
  const steps = [];

  function moveBackAfter(idx, targetIdx, lst) {
    if (lst.length - 1 === targetIdx) {
      steps.push({ method: 'MOVE_TO_END', index: idx });
    } else {
      steps.push({ method: 'MOVE_BEFORE', index: idx, before: targetIdx + 1 });
    }
    const node = lst[idx];
    for (let i = idx; i < targetIdx; i ++) {
      lst[i] = lst[i + 1];
    }
    lst[targetIdx] = node;
  }

  function moveFrontBefore(idx, targetIdx, lst) {
    steps.push({ method: 'MOVE_BEFORE', index: idx, before: targetIdx });
    const node = lst[idx];
    for (let i = idx; i > targetIdx; i --) {
      lst[i] = lst[i - 1];
    }
    lst[targetIdx] = node;
  }

  function addNodeBefore(node, targetIdx, lst) {
    if (lst.length === targetIdx) {
      steps.push({ method: 'INSERT_END', node: node });
    } else {
      steps.push({ method: 'INSERT_BEFOR', node: node, before: targetIdx });
    }
    for (let i = lst.length; i > targetIdx; i --) {
      lst[i] = lst[i - 1];
    }
    lst[targetIdx] = null; // 占位
  }

  function removeNode(idx, lst) {
    steps.push({ method: 'REMOVE', index: idx});
    for (let i = idx; i < lst.length - 1; i ++) {
      lst[i] = lst[i + 1];
    }
  }

  function findKeyIndex(oldCh, key, startIdx, endIdex) {
    if (!key) return;
    for (let i = startIdx + 1; i < endIdex; i++) {
      const node = oldCh[i];
      if (node.key === key) {
        return i;
      }
    }
    return;
  }

  oldTmpCh = oldCh.slice(0);

  let oldStartIdx = 0,
    oldEndIdx = oldTmpCh.length - 1,
    oldStartNode = oldTmpCh[oldStartIdx],
    oldEndNode = oldTmpCh[oldEndIdx];
  let newStartIdx = 0,
    newEndIdx = newCh.length - 1,
    newStartNode = newCh[newStartIdx],
    newEndNode = newCh[newEndIdx];
  let oldKeyIdxDic = null;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isSameNode(oldStartNode, newStartNode)) {
      oldStartNode = oldTmpCh[++oldStartIdx];
      newStartNode = newCh[++newStartIdx];

    } else if (isSameNode(oldStartNode, newEndNode)) {
      moveBackAfter(oldStartIdx, oldEndIdx, oldTmpCh);
      oldStartNode = oldTmpCh[oldStartIdx];
      oldEndIdx -= 1;
      newEndNode = newCh[--newEndIdx];

    } else if (isSameNode(oldEndNode, newStartNode)) {
      moveFrontBefore(oldEndIdx, oldStartIdx, oldTmpCh);
      oldStartIdx += 1;
      oldEndNode = oldTmpCh[oldEndIdx];
      newStartNode = newCh[++newStartIdx];

    } else if (isSameNode(oldEndNode, newEndNode)) {
      oldEndNode = oldTmpCh[--oldEndIdx];
      newEndNode = newCh[--newEndIdx];

    } else {
      const oldIdx = findKeyIndex(oldTmpCh, newStartNode.key, oldStartIdx, oldEndIdx);
      if (oldIdx) {
        const oldNode = oldCh[oldIdx];
        if (isSameNode(oldNode, newStartNode)) {
          moveFrontBefore(oldIdx, oldStartIdx, oldTmpCh);
        } else {
          addNodeBefore(newStartNode, oldStartIdx, oldTmpCh);
          oldEndIdx += 1;
        }
      } else {
        addNodeBefore(newStartNode, oldStartIdx, oldTmpCh);
        oldEndIdx += 1;
      }
      oldStartIdx += 1;
      newStartNode = newCh[++newStartIdx];
    }
  }
  // 删除多余老节点
  if (oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      removeNode(i, oldTmpCh);
    }
    // 创建新节点
  } else if (newStartIdx <= newEndIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      const node = newCh[i];
      addNodeBefore(node, oldStartIdx++, oldTmpCh);
    }
  }
  return {
    tmpCh: oldTmpCh,
    steps: steps
  };
}

/**
 * 更新节点变化(深度遍历)
 * @param {*} oldNode
 * @param {*} patchDic
 */
function updatePatch(oldNode, patchDic) {
  walkPatch(oldNode, patchDic, 0);
}

function walkPatch(node, patchDic, index) {
  const patchs = patchDic[index];
  if (patchs) {
    for (let i = 0; i < patchs.length; i++) {
      const patch = patchs[i];
      doPatch(node, patch);
    }
  }
  index += 1;
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      index = walkPatch(node.children[i], patchDic, index);

    }
  }
  return index;
}

/**
 * 执行更新操作
 * @param {*} node
 * @param {*} patch
 */
function doPatch(node, patch) {
  switch (patch.type) {
    case 'PROPOS':
      for (let key in patch.props) {
        const value = patch.props[key];
        if (value) {
          node.dom.setAttribute(key, value);
        } else {
          node.dom.removeAttribute(key);
        }
      }
      break;
    case 'CHILDREN':
      patch.steps.forEach(step => {
        const method = step.method
          , domCh = node.dom.childNodes
          , nodeCh = node.children;

        if (method === 'MOVE_TO_END') {
          node.dom.append(domCh[step.index]);
          nodeCh.push(nodeCh.splice(step.index, 1)[0]);
        } else if (method === 'MOVE_BEFORE') {
          node.dom.insertBefore(domCh[step.index], domCh[step.before]);
          nodeCh.splice(step.before, 0, nodeCh.splice(step.index, 1)[0]);
        } else if (method === 'INSERT_END') {
          const n = step.node instanceof VElement ? step.node.render() : document.createTextNode('' + step.node);
          node.dom.append(n);
          nodeCh.push(step.node);
        } else if (method === 'INSERT_BEFOR') {
          const n = step.node instanceof VElement ? step.node.render() : document.createTextNode('' + step.node);
          node.dom.insertBefore(n, domCh[step.before]);
          nodeCh.splice(step.before, 0, step.node);
        } else if (method === 'REMOVE') {
          try {
            node.dom.removeChild(domCh[step.index]);
            nodeCh.splice(step.index, 1);
          } catch (error) {
            window['node'] = node;
            window['step'] = step;
            throw error;
          }
        } else {
          console.error(`unknow method '${method}'`);
        }
      });
      break;
    default:
      break;
  }
}
