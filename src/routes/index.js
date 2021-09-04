import { randomInt } from "crypto";
import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";
function router(app, conn, db) {
  app.get("/", function (req, res) {
    res.send("This a solana client!");
  });
/* ----------------------------------------------------------------------------------------------------------*/
  app.get("/getBalance", function (req, res) {
    let key = req.query.address;
    console.log("Key = " + req.query.address);
    let pubKey = new PublicKey(key);
    conn
      .getBalance(pubKey)
      .then((balance) => {
        console.log("balance = " + balance);
        let bal_sol = balance / LAMPORTS_PER_SOL;
        res.status(200).send({balance:bal_sol});
      })
      .catch((err) => {
        console.log("Error = " + err);
        res.send(err);
      });
  });
/* ----------------------------------------------------------------------------------------------------------*/

  app.post("/startCampaign", function (req, res) {
    var postData = req.body;
    let id = randomInt(0, 10000);
    postData.id = id;
    let data = {
      [id + ""]: postData,
    };
    console.log("Start campaign: " + JSON.stringify(postData));
    let oldData = db.get("campaigns");
    if (oldData) {
      finaldata = {
        ...oldData,
        ...data,
      };
    } else {
      finaldata = data;
    }
    console.log("finaldata: " + JSON.stringify(finaldata));

    db.set("campaigns", finaldata);
    res.send("Campaign started id = " + id);
  });
/* ----------------------------------------------------------------------------------------------------------*/

  app.get("/listCampaigns", function (req, res) {
    res.send(db.get("campaigns"));
  });
/* ----------------------------------------------------------------------------------------------------------*/

  app.get("/getTranactionDetails", function (req, res) {
    let signature = req.query.signature;
    console.log("getTranactionDetails " + signature);
    conn
      .getTransaction(signature)
      .then(function (transaction) {
        res.send(transaction);
      })
      .catch((err) => {
        res.send(err);
      });
  });

/*----------------------------------------------------------------------------------------------------------*/

  app.get("/say", function (req, res) {
    let msg = req.query.msg;

    let programId = new PublicKey(
      "EtDA8pV7D3dQfLTgxB8hFfgg2zqUJWvpu1of1E4XcALH"
    );
    let pubKey = new PublicKey("HibSTqXcPS78yyGquHrPE7YBXpZU2E73m4yrQ4wB2LmU");
    let receiver = new PublicKey(
      "DR1VXW1xBVuTjYJpwCxYficSwvsJkhbztVDPmmi2YxXx"
    );

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: pubKey, isSigner: true, isWritable: true },
        { pubkey: receiver, isSigner: false, isWritable: true },
      ],
      programId,
      data: Buffer.from(msg), // All instructions are hellos
    });
    const transaction = new Transaction().add(instruction);
    // const transaction = new Transaction().add(SystemProgram.transfer({
    //   fromPubkey: pubKey,
    //   toPubkey: receiver,
    //   lamports: LAMPORTS_PER_SOL,
    // }));
    sendAndConfirmTransaction(conn, transaction, [payer])
      .then((result) => {
        console.log("result = " + JSON.stringify(result));
        res.send(result);
      })
      .catch((err) => {
        console.log("Error = " + err);
        res.status(501).send("eroror" + err);
      });
  });
/* ----------------------------------------------------------------------------------------------------------*/

  app.post("/transfer", function (req, res) {
    console.log("transfer" + JSON.stringify(req.body));
    let senderKey = new PublicKey(req.body.from);
    let receiverKey = new PublicKey(req.body.to);
    let amount = req.body.amount * LAMPORTS_PER_SOL;
    let k = req.body.s_k;
    // let secretKey = new Keypair(Uint8Array.from(k));
    // 
    // console.log("sk = "+secretKey)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKey,
        fromPubkey: senderKey,
        toPubkey: receiverKey,
        lamports: amount,
      })
    );
    let signer = Keypair.fromSecretKey(Uint8Array.from(k));
    sendAndConfirmTransaction(conn, transaction, [signer])
      .then((result) => {
        console.log("result = " + JSON.stringify(result));
        res.send({
          signature: result
        });
      })
      .catch((err) => {
        console.log("Error = " + err);
        res.status(501).send("eroror" + err);
      });
  });
/* ----------------------------------------------------------------------------------------------------------*/

  app.post("/fundCampaign", function (req, res) {
    let id = req.body.id;
    console.log("Funding campaign: " + id, "with amount: " + req.body.amount);
    res.send(
      "Funding campaign: " +
        id +
        " with amount: " +
        req.body.amount +
        " Successful"
    );
  });
}
/* const secretkey = Uint8Array.from([
  173, 212, 194, 66, 241, 46, 249, 59, 115, 78, 97, 188, 226, 86, 130, 221, 21,
  129, 183, 137, 226, 117, 148, 90, 198, 243, 82, 29, 61, 155, 115, 92, 248, 98,
  190, 139, 6, 18, 87, 4, 190, 82, 2, 126, 32, 250, 51, 170, 61, 252, 41, 102,
  48, 9, 76, 79, 39, 60, 228, 15, 90, 153, 193, 135,
]); */
export default router;
