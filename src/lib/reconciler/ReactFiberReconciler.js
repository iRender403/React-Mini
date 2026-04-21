import { updateNode } from "../shared/utils";
import { reconcileChildren } from "./ReconcileChildFiber";

/**
 * 
 * @param {*} wip  需要处理的Fiber节点，并且确定为原生标签
 */
export function updateHostComponent(wip) {
    // 创建真实的DOM节点
    if (!wip.stateNode) {
        wip.stateNode = document.createElement(wip.type);
        // 接下来更新节点上的属性    
        updateNode(wip.stateNode, {}, wip.props);
        // 到这个部分说明这个Fiber节点的DOM节点已经创建好了，并且属性也更新好了，接下来就要生成子节点的Fiber对象了
        reconcileChildren(wip, wip.props.children);
    }
} 

/**
 * 更新文本节点
 * @param {*} wip 
 */
export function updateHostText(wip) {
    console.log(wip.props.children, "updateHostText")
    if (!wip.stateNode) {
        wip.stateNode = document.createTextNode(wip.props.children);
    }

}

/**
 * 更新函数组件
 * @param {*} wip 
 */
export function updateFunctionComponent(wip) {

    const {type, props} = wip;
    // 这个和wip组件获取的type其实就是一个函数
    const children = type(props);
    // 然后调用reconcileChildren来生成子节点的Fiber对象
    reconcileChildren(wip,children);

  
}


/**
 * 更新类组件
 * @param {*} wip 需要处理的 fiber 对象节点
 */
export function updateClassComponent(wip) {
  const { type, props } = wip;
  // 这里从当前的 wip 上面获取到的 type 是一个类
  // 那么我们就 new 一个实例出来
  const instance = new type(props);
  // 接下来我们就可以调用 render 方法，获取到它的返回值
  const children = instance.render();
  // 有了 vnode 节点之后，就调用 reconcileChildren 方法，来处理子节点
  reconcileChildren(wip, children);
}

