import CreateFiber from "../reconciler/ReactFiber";
import schedulerOnFiber from "../reconciler/ReactFiberWorkLoop";

function updataContainer(child, container) {
   const fiber = CreateFiber(child, {
        type: container.nodeName.toLowerCase(),
        stateNode: container
    })
    schedulerOnFiber(fiber);    
}

class ReactRootDOM {
    constructor(container) {
        this._container = container;
    }

    render(child) {
        updataContainer(child, this._container)
    }
}

const ReactDOM = {
    /**
     * 
     * @param {*} container 需要挂载的根节点的DOM元素 
     * @returns 返回一个对象
     */
    createRoot(container) {
        return new ReactRootDOM(container)

    }
}


const { createRoot } = ReactDOM;

export { createRoot };