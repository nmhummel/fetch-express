import express from 'express';
import transactions from './data/db.js'
import { nanoid } from 'nanoid';
import Moment from 'moment';

const app = express()

const transId = nanoid();
let now = new Moment();
let convert = now.format('MMMM Do YYYY, h:mm:ss a')

// const newTransaction = {
//     id: transId,
//     payerCompany: "",
//     points: Number(""),
//     timestamp: convert
// };  

app.listen(5000, () => {
    console.log('Big Brother is listening on port 5000')
})

app.use(express.json()) // parse json body content
// The app.use(express.json) is a middleware that take JSON content and creates related req.body properties. (ex. req.body.name and req.body.price)

app.get('/transactions', (req, res) => {
    res.json(transactions)
})

app.get('/pointsBalance', (req, res) => {
    let allPoints = [];
    transactions.map(t => { 
      allPoints.push(t.points)
    })
    let totalPoints = allPoints.reduce((a, b) => a + b, 0).toLocaleString("en-US")
    console.log("AP", totalPoints)
    res.json(totalPoints);
})

app.get('/getAllPointBalances', (req, res) => {
    let balances = {};
    for (var i = 0; i < transactions.length; i++) {
      if (balances[transactions[i]['payerCompany']]) {
        balances[transactions[i]['payerCompany']] += transactions[i]['points']
      } else {
        balances[transactions[i]['payerCompany']] = transactions[i]['points']
      }
    }
    console.log("balances", balances)
    res.json(balances)
})

app.post('/addTransactions', (req, res) => {
    let { payerCompany, points } = req.body;
    if (!payerCompany) {
        res.status(400).json({ error: "Please include a partner company." });
    } else if (!points) {
        res.status(400).json({ error: "Please include points value." });
    } else {
        let newTransaction = {
            id: transId,
            payerCompany: "payerCompany",
            points: Number(points),
            timestamp: convert
        }
        products.push(newTransaction)
        res.status(201).json(newTransaction)
      }
})

app.patch('/spendPoints', (req, res) => {
    // ● Spend points using the rules above and return a list of { "payer": , "points": } for each call. ‘/spendPoints’
    let {points} = req.body

})


// app.get('/transactions/:transactionID', (req, res) => {
//     const id = Number(req.params.productID)
//     const transaction = transactions.find(transaction => transaction.id === id)

//         if (!transaction) {
//         return res.status(404).send('transaction not found')
//     }
//     res.json(transaction)
// })