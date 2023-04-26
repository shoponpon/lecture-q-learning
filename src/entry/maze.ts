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

const START: [number, number] = [0, 1]

const GOAL: [number, number] = [7, 14]

const COUNT = 1000;

const A = 0.1;
const R = 0.9;
const E = 0.3;

const ACTIONS = [
    'up',
    'right',
    'down',
    'left'
] as const;

const getRandomAction = () => {
    return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
}

const getQAction = (qValues: number[], isRandom: boolean = true) => {
    if (isRandom && Math.random() < E) {
        return getRandomAction();
    }
    const maxQActionIndex = qValues.reduce((maxQIndex, value, index) => {
        return qValues[maxQIndex] < value ? index: maxQIndex
    }, 0);
    return ACTIONS[maxQActionIndex];
}

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

const printEnv = (turn: number, current: [number, number]) => {
    console.log(`# turn ${turn}`);
    for (let y = 0; y < MAZE.length; y++) {
        for (let x = 0; x < MAZE[y].length; x++) {
            if (current[0] === y && current[1] === x) {
                process.stdout.write("🐧")
            } else {
                process.stdout.write(MAZE[y][x] === 1? "⬜️" : "⬛️");
            }
        }
        process.stdout.write("\n");
    }
}

const main = () => {

    const q = new Array(MAZE.length)
        .fill([])
        .map(_ => new Array(MAZE[0].length)
            .fill([])
            .map(_ => new Array(ACTIONS.length)
                .fill(0)
                .map(_ => Math.random())));

    for (let i = 0; i < COUNT; i++){
        let turn = 0;
        let isGoal = false;
        let current = START;
        let reward = 0;
        while(!isGoal) {
            turn++;

            const action = getQAction(q[current[0]][current[1]]);
            const next = updateEnv(current, action);

            isGoal = next[0] === GOAL[0] && next[1] === GOAL[1];
            reward = (isGoal ? 100: 0)
                        
            // updateQValue
            q[current[0]][current[1]][ACTIONS.indexOf(action)] +=
                A * (
                    reward +
                    R * Math.max(...q[next[0]][next[1]]) -
                    q[current[0]][current[1]][ACTIONS.indexOf(action)]
                );
            current = next;
        }
        
        console.log(`[${i}]:total turn ${turn}, total reward ${reward}`);
    }

    // test
    let turn = 0;
    let isGoal = false;
    let current = START;
    while(!isGoal) {
        turn++;

        const action = getQAction(q[current[0]][current[1]], false);
        const next = updateEnv(current, action);
        isGoal = next[0] === GOAL[0] && next[1] === GOAL[1];
        current = next;
        printEnv(turn, current);
    }
    
}

main();
