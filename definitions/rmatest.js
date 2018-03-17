const RMA = require('rakutenma');
const fs = require('fs');

const rma = new RMA(JSON.parse(fs.readFileSync('./node_modules/rakutenma/model_ja.json')), 1024, 0.007812);
rma.featset = RMA.default_featset_ja;
rma.hash_func = RMA.create_hash_func(15);

const tokens = rma.tokenize('彼は新しい仕事できっと成功するだろう。');

console.log(tokens);