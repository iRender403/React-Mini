function getFatherNode(wip) {
    let temp = wip;
    // 如果父节点没有stateNode属性，说明父节点是一个函数组件或者是一个类组件，这时候我们就要继续往上找父节点
    while (temp) {
        if (temp.stateNode) return temp.stateNode;
        // 如果没有进入上面的 if，说明当前的 fiber 节点并没有对应的 DOM 对象
        // 那么就需要继续向上寻找
        // 那么问题来了，为什么该 fiber 上面没有对应的 DOM 对象呢？
        // 因为该 fiber 节点可能是一个函数组件或者类组件、Franment
        temp = temp.return;
    }
}

function commitNode(wip) {

    // 首先第一步我们要获取到当前节点的父节点
    let parentNode = getFatherNode(wip.return);
    console.log('parentNode', parentNode, wip.return)
    //  进行一个DOM操作
    if (parentNode) {
        parentNode.appendChild(wip.stateNode);
    }
}

/**
 * 
* @param {*} wipRoot  根节点
 */
export function commitWorker(wipRoot) {
    // wipRoot.children
    console.log('commitWorker wipRoot', wipRoot)
    if (!wipRoot) return;
    // 1.提交自己
    // 2.提交子节点
    // 3.提交兄弟节点
    commitNode(wipRoot);
    commitWorker(wipRoot.children);
    commitWorker(wipRoot.sibling);
}