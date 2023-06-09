import fs from "fs/promises"
import { createInterface } from "readline/promises";
import { setTimeout } from "timers/promises";
import { BOARD, CELL_TYPES } from "../const";
import { getQAction, isDraw, isWin, printBoard, updateEnv } from "../game";

const getAction = async (env: typeof CELL_TYPES[number][]) => {
    while(true){
        process.stdout.write(`⚪️をおく位置を入力してください。:`);
        
        const inputLine = () => new Promise<string>((resolve) => {
            const readline = createInterface({input: process.stdin});
            readline.on("line", line => {
                readline.close();
                resolve(line);
            });
        });
        const line = await inputLine();
        let action: number;
        try {
            action = parseInt(line);
        } catch (e) {
            continue;
        }
        if (env[action] === "none") {
            return action;
        }
        console.log('不正な値が入力されました。');
    }
}

const main = async () => {
    const fileName = process.argv[2];

    const jsonString = await fs.readFile(fileName, { encoding: "utf-8" });
    const q = JSON.parse(jsonString) as number[][][][][][][][][][];

    let isFinish = false;
    let isAgentTurn = Math.random() > 0.5;
    let current = [...BOARD];
    console.log(`${isAgentTurn ? "🤖AI[⚫️]" : "あなた[⚪️]"} の先行です。`);
    console.log("\n[GAME START!]\n");
    while(!isFinish) {
        printBoard(current);
        if (isAgentTurn) {
            // それっぽく待機時間を設定しておくと人っぽい
            console.log("[🤖AI]...");
            await setTimeout(Math.random() * 2000);

            // 探索なしで常に最適な選択肢を選択(ただし１箇所しかない場合はそこを選ぶ)
            const action = getQAction(current, q, false);
            console.log(`[🤖AI] ${action}->⚫️`)
            current = updateEnv(current, action, "black");
        } else {            
            // 標準入力からactionを取得
            const action = await getAction(current);
            console.log(`[あなた] ${action}->⚪️`)
            current = updateEnv(current, action, "white");
        }
        if (isWin(current, "black")) {
            console.log("[GAME]あなたの負けです！[OVER]");
            break;
        } else if (isWin(current, "white")) {
            console.log("[GAME]🎉🎉🎉あなたの勝ちです！🎉🎉🎉[CLEAR]");
            break;
        } else if (isDraw(current)) {
            console.log("[GAME]引き分け![OVER]");
            break;
        }
        isAgentTurn = !isAgentTurn;
    }
}

main();
