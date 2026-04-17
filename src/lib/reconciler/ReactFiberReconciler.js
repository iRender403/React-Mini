import { updateNode } from "../shared/utils";

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
}