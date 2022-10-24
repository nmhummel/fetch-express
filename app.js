import express from 'express';
import transactions from './data/db.js'
import { nanoid } from 'nanoid';
import moment from 'moment';

const app = express()
const transId = nanoid();
let rightNow = new moment().format();
let currentBalance = "";
let payerCompanyPoints = {};

app.listen(5000, () => {
    console.log('Big Brother is listening on port 5000')
})

app.use(express.json()) 

app.get('/transactions', (req, res) => {
  console.log("All Transactions: ", transactions)
  res.json(transactions)
})

app.get('/pointsBalance', (req, res) => {
    let allPoints = [];
    transactions.map(t => { 
      allPoints.push(t.points)
    });
    let totalPoints = allPoints.reduce((a, b) => a + b, 0).toLocaleString("en-US");
    console.log("Total Points: ", totalPoints)
    currentBalance = totalPoints;
    console.log("currentBalance", currentBalance)
    res.json(totalPoints);
})

app.get('/getAllPointBalances', (req, res) => {
    let companyTotals = {};
    for (var i = 0; i < transactions.length; i++) {
      if (companyTotals[transactions[i]['payerCompany']]) { // if 'companyTotals' has the 'payerCompany' already in {}
        companyTotals[transactions[i]['payerCompany']] += transactions[i]['points']; // add theese points to the 'payerCompany' in question
      } else {
        companyTotals[transactions[i]['payerCompany']] = transactions[i]['points']; // otherwise, add the key/value combo of 'payerCompany'/'points' 
      }
    };
    console.log("Company Totals: ", companyTotals)
    payerCompanyPoints = companyTotals;
    console.log("payerCompanyPoints", payerCompanyPoints)
    res.json(companyTotals);
})

app.post('/addTransactions', (req, res) => {
    const { payerCompany, points } = req.body;
    if (!payerCompany) {
        res.status(400).send({ error: "Please include a partner company." });
    } else if (!points) {
        res.status(400).send({ error: "Please include points value." });
    } else {
        let newTransaction = {
            id: transId,
            payerCompany: payerCompany,
            points: Number(points),
            timestamp: rightNow
        }
        transactions.push(newTransaction)
        console.log("New Transaction: ", newTransaction)
        res.status(201).send(newTransaction)
      }
})

app.patch('/spendPoints', (req, res) => {
  const {points} = req.body
  console.log("points to spend", points) // 200
  if (!points) {
    res.status(400).send({ error: "Please include how many points you wish to spend." });
  } else if (points <= 0) {
    res.status(400).send({ error: "Aww, c'mon. Give us something we can spend! Only numbers greater than 0, please." });
  } else if (points > currentBalance) {
    res.status(400).send({ error: `Whoops! It looks like you don't have enough points right now. Check your balance by going to: http://localhost:5000/pointsBalance` });
  } else {
  
    transactions.map((trans, index) => {    // go through list of transactions, [0] index being oldest transaction
      let spendingTransaction = {
        id: transId,
        payerCompany: trans.payerCompany,
        points: Number(points) * -1,
        timestamp: rightNow
      }

      if (trans.points === points) { // if the spending points are the same as the oldest transaction
        console.log("New Transaction (Spent): ", spendingTransaction)
        transactions.push(spendingTransaction) // add transaction
        res.status(201).send(spendingTransaction)
      } else if (trans.points < points) { // if the points being spent are greater than the current, mapped transaction
        transactions.push(spendingTransaction)

        if ()

      }
    /*
    Spend points using the rules above and return a list of { "payer": , "points": } for each call. ‘/spendPoints’
    Return all payer point balances. ‘/getAllPointBalances’
    */ 
    }) 
    

 
  }
})

// curl -X PATCH http://localhost:5000/spendPoints -H "Content-Type: application/json" -d "{\"points\":200}"

// To submit request via Linux shell, use curl - WORKS
// $ curl -X POST "http://localhost:5000/addTransactions" -H "Content-Type: application/json" -d "{\"payerCompany\":\"Huggies\", \"points\":645}"

// GET balance - WORKS
// curl http://localhost:5000/pointsBalance

// PUT spend
// curl -X PUT http://localhost:3000/spend -H "Content-Type: application/json" -d "{\"points\":200}"}"

// curl http://localhost:5000/getAllPointBalances







// app.get('/transactions/:transactionID', (req, res) => {
//     const id = Number(req.params.productID)
//     const transaction = transactions.find(transaction => transaction.id === id)

//         if (!transaction) {
//         return res.status(404).send('transaction not found')
//     }
//     res.json(transaction)
// })



// const friendlyDate = req.body.timestamp.format('MMMM Do YYYY, h:mm:ss a')
// const tmpData = {
//   ...transactions,
//   timestamp: friendlyDate
// }