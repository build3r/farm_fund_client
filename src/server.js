import express, { urlencoded, json } from 'express';
import JSONdb from 'simple-json-db';
import { Connection } from '@solana/web3.js';
import  router  from './routes/index.js';
const db = new JSONdb('./test_data.json');
const app = express();
const port = process.env.PORT || 3000;
let rpcUrl = "http://localhost:8899";
let connection = new Connection(rpcUrl, 'confirmed');
const version = connection.getVersion().then((version) => {
    console.log('Connection to cluster established:', rpcUrl, version);

}).catch((err) => {
    console.log('Error connecting to cluster:', err);
});
app.use(urlencoded({extended: true}));
app.use(json()) // To parse the incoming requests with JSON payloads
let dt = {
        "1234": 23.43,
        "5678": 12.34,
        "9012": 0.0,
};
//db.set('balances', dt);
//db.sync();
//db.set('balances', dt);
//db.sync();
router(app, connection, db);
app.listen(port, () => {  console.log('We are live on ' + port);});
