
import { FunctionComponent, ClassComponent, HostComponent, HostText, Fragment } from "./ReactWorkTags";
import { isFn, isStr, isUndefined } from "../shared/utils";
import { Placement } from "../shared/utils";
/**
 * 专门用来创建Fiber对象的函数
 * @param {*} vdom 子节点的虚拟DOM对象
 * @param {*} returnFiberNode 父节点的Fiber对象
 * @returns 
 */
export default function CreateFiber(vdom, returnFiberNode) {
    const fiber = {
        // 储存类型
        type: vdom.type,
        // 储存key
        key: vdom.key,
        //  储存类型对象
        props: vdom.props,
        // 储存当前节点的DOM元素
        stateNode: null,
        // 初始化链表
        // 兄弟节点
        sbiling: null,
        // 子节点
        children: null,
        // 父节点
        return: returnFiberNode,
        // 副作用标记
        flag: Placement,
        // 储存当前位置
        index: null,
        // 存储旧 fiber 对象
        alternate: null,

    }
    //实际上fiber对象上面还有一个值就是tag,他用来标记fiber的类型值
    // 不同的类型的tag的值是不一样的
    // 接下来进行一个判断，根据判断的值标记不同的tag
    const type = fiber.type;
    if (isStr(type)) {
        fiber.tag = HostComponent
    } else if (isFn(type)) {
        // 这里会有两种情况，一种是函数组件一种是类组件
        if (type.pototype.isReactComponent) {
            // 如果有这个属性说明是函数组件
            fiber.tag = ClassComponent
        } else {
            fiber.tag = FunctionComponent
        }
    } else if (isUndefined(type)) {
        fiber.tag = HostText;
        fiber.props = {
            children: vdom
        }
    }

    return fiber;
}


