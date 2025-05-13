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



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/getMenu', async (req, res) => {
    const {data: menu, error } = await supabase
    .from('menu')
    .select()

    if (error){
        console.error('error', error)
        return res.status(500).json({ error: error.message})
    }

    console.log('menu', menu)
    console.error('error', error)
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
app.post('/contact', async (req, res) => {
    contactForm.push(req.body)
    console.log('gn2', contactForm);

const messageObj = req.body;
    const { data, error } = await supabase 
        .from('contact_form_messages')
        .insert([
            {
                    first_name: messageObj.firstName,
                    last_name: messageObj.lastName,
                    email: messageObj.email,
                    comment: messageObj.comment,
            }
        ])

    const { data: insertedData, error: fetchError } = await supabase
    .from('contact_form_messages')
    .select()
    .eq('email', messageObj.email); // Filter by a unique field like email

if (fetchError) {
    console.error('Fetch error:', fetchError);
} else {
    console.log('Fetched data:', insertedData);
}


res.status(200).json({message: "message received successfully"})
})



app.listen(3000); 

