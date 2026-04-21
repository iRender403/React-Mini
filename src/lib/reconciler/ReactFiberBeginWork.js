import {
    FunctionComponent,
    HostComponent,
    ClassComponent,
    HostText,
    Fragment
} from "./ReactWorkTags";
import {
    updateHostComponent,
    updateHostText,
    updateFunctionComponent,
    updateClassComponent
} from "./ReactFiberReconciler";

// 根据Fiber的Tag值，来调用不同的方法

/**
 * 在真实的react源码中，beginwork其实不参与生成真实的DOM，他是通过diff算法来生成副作用链表的，在这个链表上面会有一些标记，标记了这个节点需要进行什么样的操作
 * 在我们这个版本中，我们就直接在beginwork中生成真实的DOM节点了，并且在生成的过程中进行属性的更新
 * 
 */

/**
 *  
 * @param {*} wip 根据Fiber不同的Tag值，调用不同的方法来处理
 */
export function beginWork(wip) {
    const tag = wip.tag;
    switch (tag) {
        case HostComponent:
            updateHostComponent(wip);
            break;
        case HostText:
            updateHostText(wip);
            break;
        case FunctionComponent:
            updateFunctionComponent(wip);
            break;
        case ClassComponent:
            updateClassComponent(wip);
            break;
        case Fragment:
            updateFragment(wip);
            break;
        default:
            break;
    }

}

