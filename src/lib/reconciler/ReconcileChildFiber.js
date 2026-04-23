// 该函数用来协调子节点的Fiber对象，生成子节点的Fiber对象，并且建立父子关系
import CreateFiber from "./ReactFiber";
import { isArray, isStr, Update } from "../shared/utils";
import { sameNode, placeChild, deleteRemainingChildren } from "./ReactReconcilFiberAssistant";

/**
 * 该方法的作用是根据父节点Fiber对象和子节点的虚拟DOM对象，来生成子节点的Fiber对象，并且建立父子关系
 * @param {*} returnFiber 父节点
 * @param {*} children 子节点
 */
export function reconcileChildren(returnFiber, children) {
    // 1. 如果该子节点是一个字符串或者数字，那么直接跳过，因为在beginwork中已经处理过了
    if (isStr(children)) {
        return;
    }
    // 准备工作
    // 准备一:初始化数组变量
    // 如果是一个数组，说明有多个子节点
    // 如果不是一个数组，说明只有一个子节点，我们需要把它转换成一个数组来处理
    const newArray = isArray(children) ? children : [children];
    // 第二个准备
    let previousNewFiber = null; //上一个Fiber对象
    let oldFiber = returnFiber.alternate?.children; // 旧的Fiber对象的第一个子节点的Fiber对象
    let i = 0;//子节点的索引
    let lastPlacedIndex = 0;//上一次DOM节点被放入的最远距离

    // 是否应该追踪副作用和进行flags标记，只有在更新时才需要追踪
    let shouldTrackEffects = !!returnFiber.alternate;
    // 存储下一个Fiber对象
    // 临时存储旧的Fiber对象
    let nextOldFiber = null;

    //#region  多节点diff
    // 接下来就是整个diff的核心思想
    // 整体来讲分为五个大的步骤
    // 第一轮遍历，从左往右遍历子节点的虚拟DOM对象，遍历的同时比较新旧节点，新节点的VNode，旧节点的Fiber对象，如果可以复用，那么就复用之前的节点
    // 如果复用,那么继续往右遍历，直到不能复用的节点,或者遍历完所有的节点
    // 如果不能复用,并且是key不同的节点,那么就跳出循环,结束第一轮遍历
    // 2.检查children是否完成了遍历,因为从上面出来,就只有两种情况,一种是提前跳出来的,另外一种遍历完成调出来的
    // 如果是完成了遍历,说明还有剩余的旧节点,那么就标记为删除
    // 3.初次渲染(这一步其实已经完成了),还有一种情况也是属于初次渲染的情况,就是就节点遍历完了,新节点还有剩余
    // 那么这些新节点就属于初次渲染
    // 4. 处理新旧节点都还有剩余的情况
    // 分两步走,1. 将旧的节点放入map中,方便查找,如果存在则复用旧节点,并且将其从map中删除 2. 遍历剩余的新节点,判断是否在map中
    // 5.整个新节点遍历完成后,map中剩余的节点,都标记为删除 
    //#endregion 

    // 第一次遍历，会尝试复用之前的节点
    for (; oldFiber && i < newArray.length; i++) {
        //  先拿到当前的vnode
        let newChildVnode = newArray[i];
        if (newChildVnode === null) continue;

        // 在判断之前的我要拿到旧的Fiber节点
        // 在判断是否能够复用之前，我们先给 nextOldFiber 赋值
        // 这里有一种情况
        // old 一开始是 1 2 3 4 5，进行了一些修改，现在只剩下 5 和 4
        // old >> 5(4) 4(3)
        // new >> 4(3) 1 2 3 5(4)
        // 此时旧的节点的 index 是大于 i，因此我们需要将 nextOldFiber 暂存为 oldFiber
        if (oldFiber.index > i) {
            nextOldFiber = oldFiber;
            oldFiber = null;
        } else {
            nextOldFiber = oldFiber.sibling;
        }
        //  接下来就是判断是否能够复用旧的节点，如果能够复用，那么就复用旧的节点，否则就创建新的节点
        const same = sameNode(newChildVnode, nextOldFiber);
        if (!same) {
            // 我们需要将这个oldFiber还原，方便后面使用
            if (oldFiber === null) {
                oldFiber = nextOldFiber;
            }
            // 那么第一轮遍历就结束了
            break;
        }
        // 如果没有走到这里，说明代码可以复用
        // 我们所说的复用其实复用的是他的DOM对象
        const newFiber = CreateFiber(newChildVnode, returnFiber);
        // 复用旧节点上面的旧节点信息，尤其是复用旧的DOM对象
        Object.assign(newFiber, {
            stateNode: nextOldFiber.stateNode,
            alternate: nextOldFiber,
            flags: Update,
        });
        // 接下来我们来更新lastPlacedIndex
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, i, shouldTrackEffects);

        // 接下来就是连接链表
        if (previousNewFiber === null) {
            // 说明这是第一个子节点，那么就把它赋值给父节点的children属性
            returnFiber.children = newFiber;
        } else {
            // 说明不是第一个子节点，那么就把它赋值给上一个Fiber对象的sbiling属性
            previousNewFiber.sibling = newFiber;
        }
        // 更新previousNewFiber的值
        previousNewFiber = newFiber;
        // oldFiber指向下一个节点信息
        oldFiber = nextOldFiber;
    }

    // 从上面的for循环中出来可能出现两种情况
    // 1. 没有进入循环,说明是第一次遍历,oldFiber为null
    // 2. 进入了循环,说明是更新
    if (i === newArray.length) {
        // 如果还剩余的旧节点，说明这些旧节点没有被复用，需要标记为删除
        deleteRemainingChildren(returnFiber, oldFiber);
        return;
    }

    // 第三步，接下来就是初次渲染的情况
    if (!oldFiber) {
        // 直接创建新的Fiber对象并且建立父子关系
        for (; i < newArray.length; i++) {

            let newChildVnode = newArray[i];
            // 那么我们这一次就不处理，直接跳到下一次
            if (newChildVnode === null) continue;
            // 就创建新的Fiber
            const newFiber = CreateFiber(newChildVnode, returnFiber);
            // 接下来我们来更新lastPlacedIndex
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, i, shouldTrackEffects);
            // 建立父子关系
            if (previousNewFiber === null) {
                // 说明这是第一个子节点，那么就把它赋值给父节点的children属性
                returnFiber.children = newFiber;
                console.log('returnFiber.children', returnFiber.children);
            } else {
                // 说明不是第一个子节点，那么就把它赋值给上一个Fiber对象的sbiling属性
                previousNewFiber.sibling = newFiber;
            }
            // 更新previousNewFiber的值
            previousNewFiber = newFiber;
        }
    }

    // 第4步，处理新旧节点都还有剩余的情况
    // 首先我们需要新创建一个map,用来存储旧的Fiber对象,方便查找
    const existingChildrenMap = mapRemainingOldFiber(oldFiber);

    // 去遍历剩余的新节点,判断是否在map中
    for (; i < newArray.length; i++) {
        let newChildVnode = newArray[i];
        if (newChildVnode === null) continue;
        // 根据新节点的vnode去生成新的Fiber对象
        const newFiber = CreateFiber(newChildVnode, returnFiber);

        // 接下来判断当前的vnode是否在map中
        const existingChild = existingChildrenMap.get(newChildVnode.key);

        if (existingChild) {
            // 如果在map中找到了，那么就复用旧的节点
            Object.assign(newFiber, {
                stateNode: existingChild.stateNode,
                alternate: existingChild,
                flags: Update,
            });
            // 从map中删除旧的节点
            existingChildrenMap.delete(newChildVnode.key);
        }

        // 更新lastPlacedIndex
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, i, shouldTrackEffects);

        // 最后形成链表
        if (previousNewFiber === null) {
            // 说明这是第一个子节点，那么就把它赋值给父节点的children属性
            returnFiber.children = newFiber;
        } else {
            // 说明不是第一个子节点，那么就把它赋值给上一个Fiber对象的sbiling属性
            previousNewFiber.sibling = newFiber;
        }
        // 更新previousNewFiber的值
        previousNewFiber = newFiber;
    }

    // 第5步，整个新节点遍历完成后,map中剩余的节点,都标记为删除 
    // 遍历剩下的数组中的每一个节点，调用deleteRemainingChildren方法，将这些节点标记为删除
    existingChildrenMap.forEach((child) => {
        deleteRemainingChildren(returnFiber, child);
    });
    
}

