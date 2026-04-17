/**
 * 对 fiber 对象要做的操作进行的标记
 */

// 没有任何操作
export const NoFlags = 0b00000000000000000000;
// 节点新增、插入、移动
export const Placement = 0b0000000000000000000010; // 2
// 节点更新属性
export const Update = 0b0000000000000000000100; // 4
// 删除节点
export const Deletion = 0b0000000000000000001000; // 8

/**
 * 判断参数 s 是否为字符串
 * @param {*} s 
 * @returns
 */
export function isStr(s) {
    return typeof s === "string";
}

/**
 * 判断参数 fn 是否为函数
 * @param {*} fn
 * @returns
 */
export function isFn(fn) {
    return typeof fn === "function";
}

/**
 * 判断参数 s 是否为 undefined
 * @param {*} s
 * @returns
 */
export function isUndefined(s) {
    return s === undefined;
}

/**
 * 该函数负责更新DOM节点上的属性
 * @param {*} node 真实的DOM节点
 * @param {*} preval 之前的属性对象
 * @param {*} nextval  新的属性对象
 */
export function updateNode(node, preval, nextval) {
    // 1. 对旧值得处理

    // 2. 对新值的处理

    // 1. 通过Object.keys()获取到preval对象上的所有属性的数组
    Object.keys(preval).forEach(key => {
        // 每一个fibernode的children属性会有两种情况，一种是字符串，一种是数组
        // 这段代码的意思是，如果标签内部只是一段字符串，jsx就会把当前节点的child属性当成字符串来处理
        if (key === "children") {
            if(isStr(preval[key])){
                // 进入此分支说明这个属性的值是字符串，我们需要把这个字符串从DOM节点上删除掉
                node.textContent = "";
            }
        } else if (key.slice(0, 2) === "on") {
            // 这段代码的意思是，如果属性名以on开头，说明这是一个事件属性，我们需要把事件属性上的事件监听函数给删除掉
            // 这里使用let的原因是这个eventName可能是change
            let eventName = key.slice(2).toLocaleLowerCase();
            // 如果是change事件，那么就要把它转换成input事件
            if (eventName === "change") {
                eventName = "input"
            }
            // 移除事件
            node.removeEventListener(eventName, preval[key])
        } else {
            // 进入此分支说明这是一个普通属性，我们需要把这个属性从DOM节点上删除掉
            // 检查一下新的属性对象上是否有这个属性，如果没有这个属性了说明这个属性被删除了，我们就要把这个属性从DOM节点上删除掉
            if (!(key in nextval)) {
                node[key] = "";
            }
        }

    })

    // 2. 对新值的处理
    Object.keys(nextval).forEach(key => {
        if (key === "children") {
            // 进入此分支说明这个属性是children属性，我们需要把这个属性的值设置到DOM节点上  
            if (isStr(nextval[key])) {
                node.textContent = nextval[key];
            }
        } else if (key.slice(0, 2) === "on") {
            // 这段代码的意思是，如果属性名以on开头，说明这是一个事件属性，我们需要把事件属性上的事件监听函数给添加上
            let eventName = key.slice(2).toLocaleLowerCase();
            if (eventName === "change") {
                eventName = "input"
            }
            node.addEventListener(eventName, nextval[key])
        } else {
            // 进入此分支说明这是一个普通属性，我们需要把这个属性添加到DOM节点上
            node[key] = nextval[key];
        }
    })

}