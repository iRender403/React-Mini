// 该函数用来协调子节点的Fiber对象，生成子节点的Fiber对象，并且建立父子关系
import CreateFiber from "./ReactFiber";
import { isArray, isStr } from "../shared/utils";


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
    // 是否应该追踪副作用和进行flags标记
    const shouldTrackEffects = !!returnFiber.alternate;

    // 第一次遍历，会尝试复用之前的节点
    for (; oldFiber && i < newArray.length; i++) {
        // 第一轮遍历会根据key和type来尝试复用之前的节点
        // 可能出现的情况如下1. key和type都相同，说明可以复用之前的节点
        // 2. key不同，说明不能复用，循环结束
        // 3. key相同，type不同，说明不能复用，将该节点标记为删除，继续遍历
    }   

    // 从上面的for循环中出来可能出现两种情况
    // 1. 没有进入循环,说明是第一次遍历,oldFiber为null
    // 2. 进入了循环,说明是更新
    if (i === newArray.length) {
        // 如果还剩余的旧节点，说明这些旧节点没有被复用，需要标记为删除
    }

    // 接下来就是初次渲染的情况
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

}

/**
 * 该方法专门用来更新lastPlacedIndex的值，并且根据shouldTrackEffects的值来决定是否需要进行flags标记
 * @param {*} newFiber 新的Fiber对象
 * @param {*} lastPlacedIndex 上一次的lastPlacedIndex的值
 * @param {*} newIndex 当前的下标
 * @param { boolean } shouldTrackEffects 是否要进行副作用跟踪
 */
function placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackEffects) {
    // 更新Fiber上面的index
    newFiber.index = newIndex;
    if (!shouldTrackEffects) {
        // 进入此分支说明是初次渲染，不需要进行副作用跟踪，那么直接返回lastPlacedIndex的值
        // 如果不需要进行副作用跟踪，那么直接返回lastPlacedIndex的值
        return lastPlacedIndex;
    }


}   