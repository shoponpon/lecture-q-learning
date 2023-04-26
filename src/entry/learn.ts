import { A, BOARD, CELL_TYPES, LEARNING_COUNT, R } from "../const";
import { getQAction, getRandomAction, getReward, isDraw, isWin, printBoard, updateEnv } from "../game";

const main = () => {
    /*
        number  [][][]
                [][][]
                [][][][]
    */
    const q = new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(CELL_TYPES.length)
        .fill([]).map(_ => new Array(BOARD.length)
        .fill(0).map(_ => Math.random()
        ))))))))));

    for (let i = 0; i < LEARNING_COUNT; i++){
        let isFinish = false;
        let current = [...BOARD];
        let s:typeof current = [];
        let next: typeof current = [];
        let action: number | undefined;
        // 先行後攻はランダム
        let isLearningAgentTurn = Math.random() > 0.5;
        // 学習エージェントとランダムエージェントが共に行動した後に学習を行う
        while(!isFinish) {
            // 学習エージェントのターン
            if (isLearningAgentTurn) {
                // 学習用に状態を退避
                s = [...current];
                action = getQAction(current, q);
                next = updateEnv(current, action, "black");
            // ランダムエージェントのターン
            } else {
                const randomAction = getRandomAction(current);
                next = updateEnv(current, randomAction, "white");

                const reward = getReward(next);
                if (isDraw(next) || isWin(next, "black") || isWin(next, "white")) isFinish = true;
                
                // 学習エージェントのactionが記録されていたら（初回のみundefinedになる）
                if (action) {
                    // 学習(Qを更新)
                    q[CELL_TYPES.indexOf(s[0])][CELL_TYPES.indexOf(s[1])][CELL_TYPES.indexOf(s[2])]
                     [CELL_TYPES.indexOf(s[3])][CELL_TYPES.indexOf(s[4])][CELL_TYPES.indexOf(s[5])]
                     [CELL_TYPES.indexOf(s[6])][CELL_TYPES.indexOf(s[7])][CELL_TYPES.indexOf(s[8])][action] += 
                        A * (
                            reward +
                            R * Math.max(
                                ...q[CELL_TYPES.indexOf(next[0])][CELL_TYPES.indexOf(next[1])][CELL_TYPES.indexOf(next[2])]
                                    [CELL_TYPES.indexOf(next[3])][CELL_TYPES.indexOf(next[4])][CELL_TYPES.indexOf(next[5])]
                                    [CELL_TYPES.indexOf(next[6])][CELL_TYPES.indexOf(next[7])][CELL_TYPES.indexOf(next[8])]
                            ) -
                            q[CELL_TYPES.indexOf(s[0])][CELL_TYPES.indexOf(s[1])][CELL_TYPES.indexOf(s[2])]
                             [CELL_TYPES.indexOf(s[3])][CELL_TYPES.indexOf(s[4])][CELL_TYPES.indexOf(s[5])]
                             [CELL_TYPES.indexOf(s[6])][CELL_TYPES.indexOf(s[7])][CELL_TYPES.indexOf(s[8])][action]
                        );
                }
            }

            // debug用
            // console.log(`[${isLearningAgentTurn ? "学習エージェント" : "ランダムエージェント"}のターン]`);
            // console.log(`[${isLearningAgentTurn ? "Learning Agent" : "Random Agent"}]${action} -> ${isLearningAgentTurn ? "⚫️" : "⚪️"}`);
            // printBoard(current);
            // debug用ここまで

            current = next;
            // ターン切り替え
            isLearningAgentTurn = !isLearningAgentTurn;
        }
    }
    console.log(JSON.stringify(q));
}

main();
