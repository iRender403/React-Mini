/**
 * doc:在React源码中，SchedulerCallback的任务有四个
 * 1. 获取当前时间
 * 2. 根据任务的优先级，和延迟时间，计算出任务的过期时间
 * 3. 根据任务的过期时间，将任务添加到任务队列中，并启动相应的调度函数
 * 4. 检查当加入延时队列的时候，定时器是否需要更新
*/

/**
 * 此文件就是任务调度器
 */
import { push, pop, peek } from './SchedulerMinHeap';
import { getCurrentTime } from '../shared/utils';

/**
 * 任务队列
 */
const taskQueue = [];

// 任务id计数器
let taskIdCounter = 1;

// 是否有剩余时间
let hasRemainingTime = true;

// 通过 MessageChannel 来模拟浏览器的 requestIdleCallback
const { port1, port2 } = new MessageChannel();

/**
 * 该函数的作用是将任务添加到任务队列中
 * @param {*} callback 是一个需要执行的任务，会在浏览器空闲的时候执行
 */
export function scheduleCallback(callback) {
    
    // 获取当前的时间
    const currentTime = getCurrentTime();

    // 接下来实现过期时间
    // 在react源码中，针对任务的执行时间，会根据任务的优先级和延迟时间，来计算出任务的过期时间
    // 会有不同的优先级，不同的延迟时间，来计算出不同的过期时间
    // 这里我们做了一个简化，使得所有的优先级都相同
    const timeout = -1;

    // 接下来我们来计算出过期时间
    const expirationTime = currentTime + timeout;

    // 接下来我们来组装一个新的任务
    const newTask = {
        id: taskIdCounter++,
        callback,
        expirationTime,
        sortIndex: expirationTime,
    }

    // 将新的任务推入到任务队列
    push(taskQueue, newTask);

    // 接下来请求调度，然后会产生一个宏任务
    port1.postMessage(null);
}

// 每次port1.postMessage(null)的时候，都会触发port2.postMessage(null);
port2.onmessage = () => {
    
    // 获取当前时间
    const currentTime = getCurrentTime();
    
    // 获取当前的任务
    let currentTask = pop(taskQueue);

    while(currentTask){
        // 当前时间大于等于任务的过期时间，说明任务可以执行
        // 如果任务的过期时间远大于当前时间，
        // 并且当前剩余的时间也不够了
        // 那么就不执行了
        if(currentTask.expirationTime> currentTime&&!hasRemainingTime){
            break;
        }

        // 如果没有进入当前的循环，说明任务可以执行
        const callback = currentTask.callback;
        currentTask.callback = null;
        // 执行对应的任务，传入剩余的时间 
        
        const taskResult = callback(currentTime-currentTask.expirationTime);
        
        if(taskResult===undefined){
            // 说明任务执行完了，才退出来的，那么就可以将此任务从任务队列中删除了
            pop(taskQueue);
            currentTask = peek(taskQueue);
        }
    }
}

