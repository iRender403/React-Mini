import { Placement } from "../shared/utils";

// 这是一个辅助文件，为diff算法提供一些辅助的方法
/**
 * 1. 同一层级方面
 * 2. key相同
 * 3. type相同
 * @param {*} newChildVnode 新的虚拟DOM对象
 * @param {*} oldFiber 旧的Fiber对象
 * @returns 是否能够复用旧的节点
 * @description 如果能够复用旧的节点，那么就复用旧的节点，否则就创建新的节点
 */
export function sameNode(newChildVnode, oldFiber) {
    return oldFiber && newChildVnode.key === oldFiber.key && newChildVnode.type === oldFiber.type;
}


/**
 * 该方法专门用来更新lastPlacedIndex的值，并且根据shouldTrackEffects的值来决定是修改还是移动节点
 * @param {*} newFiber 新的Fiber对象
 * @param {*} lastPlacedIndex 上一次的lastPlacedIndex的值
 * @param {*} newIndex 当前的下标
 * @param { boolean } shouldTrackEffects 是否要进行副作用跟踪
 */
export function placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackEffects) {
    // 更新Fiber上面的index
    newFiber.index = newIndex;
    if (!shouldTrackEffects) {
        // 进入此分支说明是初次渲染，不需要进行副作用跟踪，那么直接返回lastPlacedIndex的值
        // 如果不需要进行副作用跟踪，那么直接返回lastPlacedIndex的值
        // 返回这个的原因是，lastPlaceIndex，
        return lastPlacedIndex;
    }

    // 首先拿到旧的Fiber节点
    const current = newFiber.alternate;
    // 首先获取到旧节点的Index的值
    if (current) {
        // 首先获取到旧的Fiber的index值
        const oldIndex = current.index;
        // 接下来判断，当前的index是否小于lastIndex
        if (oldIndex < lastPlacedIndex) {
            // 如果小于last说明是移动节点
            newFiber.flags |= Placement;
            return lastPlacedIndex;
        } else {
            // 进入此分支，说明oldIndex应该作为lastPlacedIndex
            return oldIndex;
        }
    } else {
        // 进入此分支，说明是初次渲染，那么直接返回newIndex的值
        newFiber.flags |= Placement;
        return lastPlacedIndex;
    }

}   

/**
 * 该方法专门用来删除旧的子节点
 * @param {*} returnFiber 父节点
 * @param {*} childrenToDelete 需要删除的子节点
 * @returns 
 * @description 如果旧的Fiber对象还有剩余，那么将其放进Delete数组中，等待后续统一删除
*/
export function deleteChildren(returnFiber,childrenToDelete) {
    // 这里仅仅只是进行删除操作，真正的删除是在数组里面
    // 将其存放到父节点的Delete数组中，等待后续统一删除,存储你要删除的
    const deletetions = returnFiber.deletions;
    if (deletetions) {
        deletetions.push(childrenToDelete);
    } else {
        // 进入此分支说明说明是初次渲染，那么就创建一个新的数组，存储你要删除的子节点
        returnFiber.deletions=[childrenToDelete];
    }
}

/**
 * 该方法专门用来删除剩余的旧节点,删除节点的核心思想就是一个一个去删除
 * @param {*} returnFiber 父节点
 * @param {*} oldFiber 旧的Fiber对象
 * @returns 
 * @description 如果旧的Fiber对象还有剩余，那么就标记为删除
 */
export function deleteRemainingChildren(returnFiber, oldFiber) {
    let childrenToDelete = oldFiber;
    while(childrenToDelete) {
         deleteChildren(returnFiber,childrenToDelete);
         childrenToDelete = childrenToDelete.sibling;
    }
   
}

/**
 * 将旧的Fiber对象构建成一个hash表
 * @param {*} oldFiber 旧的fiber节点
 */
export function mapRemainingOldFiber(oldFiber) {
    // 创建一个map
    const existingChildrenMap = new Map();
    let existingChild = oldFiber;
    while(existingChild) {
        existingChildrenMap.set(existingChild.key, existingChild);
        // 接下来切换到下一个Fiber节点
        existingChild = existingChild.sibling;
    }
    return existingChildrenMap;
}
