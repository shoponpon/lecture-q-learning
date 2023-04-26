import { CELL_TYPES, E } from "./const";

export const getRandomAction = (env: typeof CELL_TYPES[number][]) => {
    return Math.floor(Math.random() * env.length);
}

export const getQAction = (env: typeof CELL_TYPES[number][], q: number[][][][][][][][][][], isRandom: boolean = true) => {
    if (isRandom && Math.random() < E) {
        return getRandomAction(env);
    }
    const maxQActionIndex = q[CELL_TYPES.indexOf(env[0])][CELL_TYPES.indexOf(env[1])][CELL_TYPES.indexOf(env[2])]
                             [CELL_TYPES.indexOf(env[3])][CELL_TYPES.indexOf(env[4])][CELL_TYPES.indexOf(env[5])]
                             [CELL_TYPES.indexOf(env[6])][CELL_TYPES.indexOf(env[7])][CELL_TYPES.indexOf(env[8])]
        .reduce((maxQIndex, value, index) => {
            return q[CELL_TYPES.indexOf(env[0])][CELL_TYPES.indexOf(env[1])][CELL_TYPES.indexOf(env[2])]
                    [CELL_TYPES.indexOf(env[3])][CELL_TYPES.indexOf(env[4])][CELL_TYPES.indexOf(env[5])]
                    [CELL_TYPES.indexOf(env[6])][CELL_TYPES.indexOf(env[7])][CELL_TYPES.indexOf(env[8])][maxQIndex] < value ? index: maxQIndex
        }, 0);
    return maxQActionIndex;
}

export const updateEnv = (
        current: typeof CELL_TYPES[number][],
        action: number,
        cellType: typeof CELL_TYPES[number]
): typeof CELL_TYPES[number][] => {
    if (current[action] === "none") {
        current[action] = cellType;
    }
    return current;
}

export const isDraw = (env: typeof CELL_TYPES[number][]) => env.every(v => v !== "none");

export const isWin = (env: typeof CELL_TYPES[number][], cellType: typeof CELL_TYPES[number]) => {
    if (
        ((env[0] === env[1] && env[1] === env[2]) && env[0] === cellType) ||
        ((env[3] === env[4] && env[4] === env[5]) && env[3] === cellType) ||
        ((env[6] === env[7] && env[7] === env[8]) && env[6] === cellType) ||
        ((env[0] === env[3] && env[3] === env[6]) && env[0] === cellType) ||
        ((env[1] === env[4] && env[4] === env[7]) && env[1] === cellType) ||
        ((env[2] === env[5] && env[5] === env[8]) && env[2] === cellType) ||
        (
            (
                (env[0] === env[4] && env[4] === env[8]) ||
                (env[2] === env[4] && env[4] === env[6])
            ) && env[4] === cellType
        )
    ) {
        return true;
    }
    return false;
}

export const getReward = (env: typeof CELL_TYPES[number][]) => {
    // 引き分け
    if (isWin(env, "black")) {
        return 10
    } else if (isWin(env, "white")) {
        return -10
    }
    if (isDraw(env)) {
        return 10; // MEMO: ここを0にしてみた時の変化について考えてみると面白いかも...？
    }
    return 0;
}

export const printBoard = (env: typeof CELL_TYPES[number][]) => {
    const toEmoji = (s: typeof CELL_TYPES[number]) => {
        if (s === "none") return undefined
        if (s === "white") return "⚪️"
        return "⚫️"
    }

    console.log(`\t${toEmoji(env[0]) ?? 0}\t${toEmoji(env[1]) ?? 1}\t${toEmoji(env[2]) ?? 2}`)
    console.log(`\t${toEmoji(env[3]) ?? 3}\t${toEmoji(env[4]) ?? 4}\t${toEmoji(env[5]) ?? 5}`)
    console.log(`\t${toEmoji(env[6]) ?? 6}\t${toEmoji(env[7]) ?? 7}\t${toEmoji(env[8]) ?? 8}`)
}
