export const LEARNING_COUNT = 10000000; // 試行回数
export const A = 0.1; // 学習率
export const R = 0.9; // 割引率
export const E = 0.5; // 探索率

// マス目の種別
export const CELL_TYPES = [
    "none",
    "black",
    "white",
] as const;

// マス目
export const BOARD: typeof CELL_TYPES[number][] = [
    "none", "none", "none",
    "none", "none", "none",
    "none", "none", "none",
];
