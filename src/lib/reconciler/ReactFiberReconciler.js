import { updateNode } from "../shared/utils";
import { reconclieChildren } from "./ReconcileChildFiber";



/**
 * 
 * @param {*} wip  需要处理的Fiber节点，并且确定为原生标签
 */
export function updateHostComponent(wip) {
    // 创建真实的DOM节点
    if (!wip.stateNode) {
        wip.stateNode = document.createElement(wip.type);
    }

    // 接下来更新节点上的属性    
    updateNode(wip.stateNode, {}, wip.props);
    // 到这个部分说明这个Fiber节点的DOM节点已经创建好了，并且属性也更新好了，接下来就要生成子节点的Fiber对象了
    reconclieChildren(wip, wip.props.children);
}

export function updateHostText(wip) {
    console.log(wip.props.children,"updateHostText")
    if (!wip.stateNode) {
        wip.stateNode = document.createTextNode(wip.props.children);
    }
    
}