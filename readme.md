## setup

以下をコピペしてコマンドを叩こう。

```
yarn && yarn build
```

## work 1 めいろ

以下のコマンドを実行することで迷路探索するためのプログラムが動く。

```
node dist/entry/maze.js
```

## work 2 みつならべ

まずは以下のコマンドを叩こう。

```
node dist/entry/learn.js > q.json
```

次に以下のコマンドを実行することで引数に与えたqのテーブルを持ったAIと対戦ができるぞ。

```
node dist/entry/play.js q.json
```
