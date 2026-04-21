import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { commitWorker } from "./ReactFiberCommitWork";
import { scheduleCallback } from "../scheduler/Scheduler";
//  该文件负责整个React的执行流程

// 正在进行的工作，我们使用这个变量来保存正在工作的Fiber对象
let wip = null;
// 这是保存根节点的Fiber对象
let wipRoot = null;


export default function 
schedulerOnFiber(fiber) {
    wip = wipRoot = fiber;
    // 我们先使用这个来调度，之后使用scheduler来调度
    scheduleCallback(workLoop);
}

//#region 这里的实现方式和源码有很大部分不同
// 该函数会在有剩余时间的时候去执行
// function workLoop(deadline) {
//     while (wip && deadline.timeRemaining() > 0) {
//         // 进入此循环说明，有要进行处理的Fiber节点
//         // 并且有时间处理
//         performUnitOfWork()// 该方法负责处理Fiber节点

//         }

//     // 执行到这里，说明要么是执行中断了这种我们暂时不需要改要么就是执行执行结束了
//     if (!wip) {
//         // 到这里说明整个函数执行完毕了
//         // 执行结束了就要把任务提交出去
//         commitRoot();
//     }

// }

//#endregion

/**
 * 该函数会在浏览器空闲的时候执行，如果超过了该时间，那么就停止执行
 * @param {*} time  该函数会在浏览器空闲的时候执行，time是浏览器空闲的时间
 */
function workLoop(time) {
    while(wip){
        if(time<=0) return false;
        performUnitOfWork();
    }
    if(!wip && wipRoot){
        commitRoot();
    }
}

/**
 * 总共有下面的事情要做
 * 1. 处理当前的Fiber对象
 * 2. 深度优先遍历子节点，生成子节点的Fiber对象，然后进行处理
 * 3. 提交副作用
 * 4. 进行渲染 
 */
function performUnitOfWork() {
    //  如果有子节点，那么将wip更新为子节点
    beginWork(wip);
    // 如果有子节点，则处理子节点
    if (wip.children) {
        wip = wip.children;
        return;
    }

    // 如果没有下一个子节点，则执行当前子节点的compleWork方法
    completeWork(wip);

    let next = wip;
    while (next) {
        if (next.sibling) {
            wip = next.sibling
            return;
        }
        // 这一步说明也没有兄弟节点了这个时候要返回父节点
        next = next.return
         
        // 在寻找父辈节点之前先执行一下completeWork方法
        completeWork(next);
    }
    
    // 如果执行到这里说明整个Fiber树已经处理完了，说明没有节点可以处理了
    wip = null;

}

/**
 * 执行该方法的时候，说明整个节点的协调工作已经完成
 * 接下来就进入到渲染阶段
 */
function commitRoot() {
    commitWorker(wipRoot);
    // 渲染完成后将 wipRoot 置为 null
    wipRoot = null;
}
