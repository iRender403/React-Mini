import { FunctionComponent, HostComponent, ClassComponent, HostText, Fragment } from "./ReactWorkTags";
import { updateHostComponent, updateHostText } from "./ReactFiberReconciler";
import { updateFunctionComponent } from "./ReactFiberReconciler";
import { updateClassComponent } from "./ReactFiberReconciler";
import { updateFragment } from "./ReactFiberReconciler";

// 根据Fiber的Tag值，来调用不同的方法

/**
 *  
 * @param {*} wip 根据Fiber不同的Tag值，调用不同的方法来处理
 */
export default function beginWork(wip) {
    const tag = wip.tag;
    switch (tag) {
        case HostComponent:
            return updateHostComponent(wip);
        case HostText:
            return updateHostText(wip);
        case FunctionComponent:
            return updateFunctionComponent(wip);
        case ClassComponent:
            return updateClassComponent(wip);
        case Fragment:
            return updateFragment(wip);
        default:
            break;
    }

}