# mini React 
这是一个mini react项目，实现的目的仅仅是能够把握react的整体流程，但是对于各种细节，例如
- scheduler中的shouldYield() => 本次仅仅使用简单的时间判断来实现，而不是记录各种任务结束，执行时间的判断
- scheduler中是否中断的判断 原本是callback任务返回的是否为函数，然后通过宏任务再次唤醒 => 本项目目前使用的是通过wipFiber是否为空来判断FiberTree是否构建完成
- workLoop也是简易的实现

原因在于，目前为止我无法直接从零开始直接“完美”的复刻React，因为他实在是太庞大了

在阅读源码和真正实现之间存在很大的挑战，比如我上面的简介，就可能存在严重的错误，但是这并不重要，我会不断的进行修正


由于之前并没有记录过程，并且期间也完成了很多工作，所以这里简单概述一下之前完成的工作情况，对于之后的流程，可以通过commits来追踪

1. const root = createRoot(document.getElementById('root')); 完成了createRoot: 在react-dom/ReactDOM.js中，实现了以下功能
   1. 创建`ReactDOM`对象，对象中添加`createRoot`->`createRoot`是一个函数，调用他会实例化一个`ReactRootDOM`的类
   2. `ReactRootDOM`中目前含有`render`这个方法，使用该方法会调用 `updataContainer` 这个函数,该函数的作用为创建根节点的Fiber对象，然后启动调度器
2. 完成了`CreateFiber`方法:"../reconciler/ReactFiber",该方法用来初始化Fiber对象

3. 接着启动调度器,当前的调度器使用`requestIdCallback`，他是原生API，用于在浏览器空闲时，执行`workLoop`方法

3. 实现`workLoop`方法，该方法会启动`performUnitOfWork`：就是构建`Wip Fiber Tree`的过程，包括`begin work，complete work`,然后是`commit`，这个只有在`wip`为空的时候才会执行，也就是wipFibertree构建完毕之后，这里的实现方式和源码中的实现方式还有有区别的

>源码中scheduler的执行任务方式是执行在 schedulerCallback中的回调函数callback，然后开始构建VDOM，本项目中的实现目前为止是直接调用commit来实现的

>源码中的中断其实是，判断callback返回的值是否为一个函数，如果是函数，说明任务中断了，然后会通知上级，上一级函数，通常是flushwork接收到workloop的信号如果为true，他就会开启一个宏队列，将这个任务在下一次渲染中继续进行

4. 完成了`performUnitOfWork`此方法的作用就是深度优先遍历FiberTree，总体流程为子->兄->兄子->父，

5. 接下来是完成beginwork，他的主要作用是根据当前节点创建下一个FiberTree

-- 这里用来记录未来该项目需要优化的部分

# 关于BeginWork : beginwork的第一个版本
当前的beginwork的实现思路和react中的实现思路大为不同

## 先了解目前所处的阶段
beginWork的调用栈: createRoot  -> render -> wip = createFiber -> schedulerOnFiber(wip) -> requestIdCallback(wip) -> wookLoop -> preformUntilOfWork -> beginWork

## 再了解beginWork所执行的事情
输入: wipFiber:根FiberNode
内部: 
1. 创建当前节点的DOM节点 (注意:在真实的React中，这一步其实是执行函数/类组件，绝对不是创建DOM节点，在beginwork阶段不涉及DOM节点的操作，那是completework的责任)
2. 更新节点属性 utils.js -> updateNode(当前节点，旧的值，新的值)
   1. 删除旧的值，删除之前事件监听
   2. 更新新的值: 将新的属性挂载到DOM节点上

## 说明

这里我感到非常费解:mini-react中，beginWork的职责完全变了🤯，这个应该是complete的责任，现在全放到beginwork上去执行了

真实的React中beginwork的主要职责应该是
1. 创建下一级的Fiber节点
2. 如果是update阶段，他会根据diffs算法，进行flags标记

算了,这里先留着,看看之后是怎么处理的吧

## 接下来要做的事情,链接FiberNode
