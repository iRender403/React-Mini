/**
 * 该文件为最小堆的实现
 * 该方法 总共有六个方法
 * 其中会暴露出三个方法
 * 1. push: 向堆中添加一个元素
 * 2. pop: 从堆中删除最小的元素
 * 3. peek: 返回堆中最小的元素，但不删除它
*/

/**
 * 返回任务队列的第一个任务
 * @param {*} heap 任务队列
 */
export function peek(heap) {
    return heap.length > 0 ? heap[0] : null;
}

/**
 * 向任务队列中添加一个任务
 * @param {*} heap 任务队列
 * @param {*} task 任务节点
 */
export function push(heap, task) {
    // 获取任务队列的长度
    const length = heap.length;
    // 将任务节点添加到任务队列的末尾
    heap.push(task);
    // 将任务节点上移到正确的位置
    siftUp(heap, task, length);
}

/**
 * 从任务队列中删除并返回最小的任务
 * @param {*} heap 任务队列
 */
export function pop(heap) {
    // 如果任务队列为空，直接返回null
    if (heap.length === 0) {
        return null;
    }
    // 取出堆顶的任务节点
    const first = heap[0];
    // 取出堆底的任务节点
    const last = heap.pop();
    // 如果当前的任务数量大于1
    if (first !== last) {
        // 将最后一个任务先放当堆顶
        heap[0] = last;
        // 由于堆顶的任务可能不是最小的任务,所以要将堆顶的任务放到正确的位置上去
        // 将堆顶的任务下移到正确的位置
        siftDown(heap, last, 0);
    }
    return first;
}

/**
 * 
 * @param {*} heap 任务队列 
 * @param {*} node 任务
 * @param {*} i 任务队列的长度
 */
function siftUp(heap, node, i) {
    let index = i;// 任务队列的个数
    while (index > 0) {
        // 获取父节点的索引,父节点的索引等于当前节点的索引减一再除以二
        // 左移动相当于乘以二，右移动相当于除以二 <<<1相当于乘2
        const parentIndex = (index - 1) >>> 1;
        const parent = heap[parentIndex];
        // 如果父节点的优先级小于等于当前节点的优先级，则说明当前节点已经在正确的位置上了，直接退出循环
        if (compare(parent, node) < 0) {
            break;
        }

        // 否则，说明当前节点的优先级高于父节点的优先级，需要将父节点下移到当前节点的位置上
        // 需要将子节点交换到父节点的位置上
        heap[index] = parent;
        heap[parentIndex] = node;
        index = parentIndex;
    }
}

/**
 * 对当前的节点进行下移操作
 * @param {*} heap 任务队列
 * @param {*} node 之前的最后一个任务，现在被放到了堆顶
 * @param {*} index 该任务的下标
 */
function siftDown(heap, node, index) {
    // 获取任务队列的长度
    const length = heap.length;
    // 获取当前队列长度的一半的索引
    const halfLength = length >>> 1;
    // 因为我们是使用的数组来存放的二叉树，因为是二叉树，要么比较左边的树，要么比较右边的树
    while (index < halfLength) {
        // 左节点
        const leftIndex = (index << 1) + 1;
        // 右节点
        const rightIndex = (index << 1) + 2;
        // 得到左右节点对应的任务
        const left = heap[leftIndex];
        const right = heap[rightIndex];


        if(compare(left, node) < 0) {
            // 如果小于零，说明左节点的优先级高于右节点的优先级
            // 接下来进行左右节点的比较，交换优先级更高的节点和当前节点的位置
            // 右边的节点可能存在缺失的情况，这样就会导致索引 
            if(compare(left, right) < 0&&rightIndex < length) {
                // 如果进入了这个分支说明左边的优先级会更高一点
                heap[index] = left;
                heap[leftIndex] = node;
                index = leftIndex;
            }else{
                // 说明右边的优先级更高一点
                heap[index] = right;
                heap[rightIndex] = node;
                index = rightIndex;
            }
        }else if (compare(right,node)<0&& rightIndex < length) {
            // 进入此分支说明右节点的优先级高于当前节点的优先级，并且右节点的索引小于任务队列的长度，说明右节点存在
                heap[index] = right;
                heap[rightIndex] = node;
                index = rightIndex;
        }else{
            // 说明当前的任务就是最小的
            return;
        }

    }
}

/**
 * 比较两个任务的优先级
 * @param {*} node1 父节点
 * @param {*} node2 子节点
 */
function compare(node1, node2) {
    // 每个任务都有一个sortIndex属性，sortIndex属性的值越小，说明任务的优先级越高
    const diff = node1.sortIndex - node2.sortIndex;
    // 如果diff的值小于0，说明node1的优先级高于node2，返回一个负数；
    // 如果diff的值大于0，说明node1的优先级低于node2，返回一个正数；
    // 如果diff的值等于0，说明node1和node2的优先级相同，返回0
    // 如果两个任务的优先级相同，则根据它们的id来比较，id较小的任务优先级更高
    return diff === 0 ? node1.id - node2.id : diff;
}
