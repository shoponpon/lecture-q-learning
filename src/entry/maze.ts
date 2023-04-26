// 今回は迷路、0が壁、1が通路)
const MAZE = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

// スタート地点(y, x)🟦
const START: [number, number] = [0, 1]

// ゴール地点(y, x)🟥
const GOAL: [number, number] = [7, 14]

// 学習回数
const COUNT = 0; // TODO: 1000くらいに増やそう

// 学習率
const A = 0.1;
// 割引率
const R = 0.9;
// 探索率
const E = 1; // TODO: 0.3くらいが多分ちょうどいいんじゃないか？

// エージェント(AI)が取れる行動
const ACTIONS = [
    'up',
    'right',
    'down',
    'left'
] as const;

// ランダムな行動を選択して返す
const getRandomAction = () => {
    return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
}

// エージェント(AI)の行動を選択
const selectQAction = (qValues: number[], isRandom: boolean = true) => {
    // 一定の確率でランダムな行動を選択(ε-greedy法)
    if (isRandom && Math.random() < E) {
        return getRandomAction();
    }

    // もっとも将来得られる報酬の期待値(Q値)の高い行動を選択
    const maxQActionIndex = qValues.reduce((maxQIndex, value, index) => {
        return qValues[maxQIndex] < value ? index: maxQIndex
    }, 0);
    return ACTIONS[maxQActionIndex];
}

// 行動を環境に反映し、最新の環境を返す
const updateEnv = (current: [number, number], action: typeof ACTIONS[number]): [number, number] => {
    const [y, x] = current;
    switch(action) {
        case "up":
            if (y > 0 && MAZE[y-1][x] === 1) return [y - 1, x];
            break;
        case "right":
            if (x < MAZE[0].length - 1 && MAZE[y][x+1] === 1) return [y, x + 1];
            break;
        case "down":
            if (y < MAZE.length -1 && MAZE[y+1][x] === 1) return [y + 1, x];
            break;
        case "left":
            if (x > 0 && MAZE[y][x - 1] === 1) return [y, x - 1];
            break;
    }
    return current;
}

// 可視化用
const printEnv = (turn: number, current: [number, number]) => {
    console.log(`# turn ${turn}`);
    for (let y = 0; y < MAZE.length; y++) {
        for (let x = 0; x < MAZE[y].length; x++) {
            if (current[0] === y && current[1] === x) {
                process.stdout.write("🐧")
            } else {
                if (y === START[0] && x === START[1]) {
                    process.stdout.write("🟦");
                } else if (y === GOAL[0] && x === GOAL[1]) {
                    process.stdout.write("🟥");
                } else {
                    process.stdout.write(MAZE[y][x] === 1? "⬜️" : "⬛️");
                }
            }
        }
        process.stdout.write("\n");
    }
}

const main = () => {
    // q[y][x][action]: Q値、方策と呼ばれるすべての状態と行動に対して将来得られる報酬の期待値を格納する配列
    const q = new Array(MAZE.length)
        .fill([]).map(_ => new Array(MAZE[0].length)
        .fill([]).map(_ => new Array(ACTIONS.length)
        .fill(0).map(_ => Math.random())));

    // 迷路を何度も解いて学習
    for (let i = 0; i < COUNT; i++){
        let isGoal = false;
        // 現在地点、今回AIが知覚できるもの
        let current = START;

        // ゴールするまで繰り返す
        while(!isGoal) {
            // 現在とるべき行動を選択
            const action = selectQAction(q[current[0]][current[1]]);
            // 行動実行！
            const next = updateEnv(current, action);

            // ゴールしたら報酬を得る
            isGoal = next[0] === GOAL[0] && next[1] === GOAL[1];
            const reward = (isGoal ? 100: 0)
                        
            // おまじない
            q[current[0]][current[1]][ACTIONS.indexOf(action)] +=
                A * (
                    reward +
                    R * Math.max(...q[next[0]][next[1]]) -
                    q[current[0]][current[1]][ACTIONS.indexOf(action)]
                );
            current = next;
        }
    }

    // 学習した結果でビジュアライズしながら迷路を探索
    let turn = 0;
    let isGoal = false;
    let current = START;
    while(!isGoal) {
        turn++;
        const action = selectQAction(q[current[0]][current[1]], true); // TODO: falseに変える
        const next = updateEnv(current, action);
        isGoal = next[0] === GOAL[0] && next[1] === GOAL[1];
        current = next;
        printEnv(turn, current);
    }
    
}

main();
