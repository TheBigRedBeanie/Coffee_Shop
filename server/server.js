const express = require('express');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();
const supabase = require('./db')

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// user
const user = { username: 'jon', password: 'pass123' };


// menu
const menu = [
    {
        name: 'Americano',
        price: 2.5,
        type: 'hot',
    },
    { name: 'Latte', price: 3.0, type: 'hot' },
    { name: 'Cappuccino', price: 3.5, type: 'hot' },
    { name: 'Frozen Americano', price: 4.5, type: 'cold' },
    { name: 'Frozen Latte', price: 2.5, type: 'cold' },
    { name: 'Pup Cup', price: 0, type: 'cold' },
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/getMenu', (req, res) => {
    console.log('gn2 /getMenu');
    // reach out to db to get the menu
    res.json(menu);
});


app.post('/login', async (req, res) => {
    console.log('gn2 /login', req.body)
    const username = req.body.username
    const password = req.body.password
    console.log('username', username)
    console.log('password', password)
    const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
    });
    if (error) {
        console.error('Signin error', error);
        return res.status(401).json({ error: error.message });
    }
    res.status(200).json({message: 'Success'})
})


const orderArray = [];
app.post('/checkout', (req, res) => {
    console.log('gn2 /checkout', req.body)
    if(!req.body || req.body.length < 1){
        res.status(400).json({ message: "At least one item required for order" });
    }
    const order = req.body;
    console.log('order', order)
    //put order in orderArray
    orderArray.push(order);
    console.log('orderArray', orderArray)
    const confirmationNumber = '234jw2hjo2o2';
    res.status(200).json({message: "Order Process Successfully", confirmationNumber: confirmationNumber})
})

const contactForm = [];
app.post('/contact', (req, res) => {
    contactForm.push(req.body)
    console.log('gn2', contactForm);
})


app.listen(3000); 

