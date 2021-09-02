import { randomInt } from "crypto";
import { PublicKey } from '@solana/web3.js';
function router(app, conn, db) {
    app.get("/", function (req, res) {
      res.send("This a solana client!");
    });
    app.get("/getBalance", function (req, res) {
      let key = req.query.key;
      console.log("Key = " + req.query.key);
      let pubKey = new PublicKey(key);
      conn.getBalance(pubKey)
      .then((balance) => {
      console.log("balance = " + balance);
      //res.send("Balance = " + db.get('balances')[key]);
        res.send("Balance = " +balance);
      }
      ).catch((err) => {
          console.log("Error = " + err);
        res.send(err);
  
      });
    });
  
    app.post("/startCampaign", function (req, res) {
      var postData = req.body;
      let id = randomInt(0, 10000);
      postData.id = id;
      let data = {
          [id+""] : postData
      }
      console.log("Start campaign: " + JSON.stringify(postData));
      let oldData = db.get('campaigns');
      if(oldData) {
      finaldata = {
          ...oldData,
          ...data
      }
      } else {
          finaldata = data;
      }
      console.log("finaldata: " + JSON.stringify(finaldata));
  
      db.set('campaigns', finaldata);
      res.send("Campaign started id = "+ id);
    });
    app.get("/listCampaigns", function(req, res) {
        res.send(db.get('campaigns'));
    });
  
    app.post("/fundCampaign", function (req, res) {
        let id = req.body.id;
        console.log("Funding campaign: " + id, "with amount: " + req.body.amount);
        res.send("Funding campaign: " + id + " with amount: " + req.body.amount+ " Successful");
    });
  };
  
export default router;