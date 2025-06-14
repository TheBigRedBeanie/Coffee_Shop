

// flag for logged in user
let loggedInUser = null;

// discount variables/objects
const validDiscount = [
    { code: 'save20', discountpct: 0.8 },
    { code: 'save50', discountpct: 0.5 },
];
let discount = 1;
let discountApplied = false;

// getting user location
function getUserLocation() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
// store the position as lat and long variables
    function showPosition(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
// log the locations into the console
        console.log("Latitude: " + lat + ", Longitude: " + long);
// call the weather API and pass the variables + api key 
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=30e061c6bbcc3707c890ba56e5b98c94&units=imperial`;
        fetch(weatherApiUrl)
            .then(response => response.json())
        .then(data => {
            console.log("Weather data:", data);
// log the response as the "data" into the console log
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
    }
    
    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
            case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
            case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
            case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        }
    }



// login
async function handleLogin(event) {
    event.preventDefault();
    const usernameElement = document.getElementById('username');
    console.log('usernameElement', usernameElement);
    const username = usernameElement.value;
    console.log('username', username);
    const passwordElement = document.getElementById('password');
    console.log('passwordElement', passwordElement);
    const password = passwordElement.value;
    console.log('password', password);

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json', // Indicate the type of data being sent
        },
        body: JSON.stringify({ // Convert your JavaScript object into a JSON string
            username: username,
            password: password
        })
    }
)

    // if (user.username !== username || user.password !== password) {
    //     alert(`username/password not found`);
    //     return;
    // } else {
    //     loggedInUser = user;
    //     console.log('loggedInUser', loggedInUser);
    // }

    let welcomeMessageElement = document.getElementById('welcome-message');
    welcomeMessageElement.innerText = `Welcome ${username}!`;
}

// create menu
function createMenu(menu){
    let ulElement = document.getElementById("menu");
    ulElement.style.listStyleType = 'none';
    if(menu && menu.length > 0){
        for (let i = 0; i < menu.length; i++) {
            const liElement = document.createElement('li')
            liElement.innerHTML = `
            <div class="menu-item">
            <span id="${menu[i].name}">${menu[i].name}</span>
            <button onclick="addToCart('${menu[i].name}', '${menu[i].price.toFixed(2)}')">Add To Cart ($${menu[i].price.toFixed(2)})</button>

            </div>
        `;
        ulElement.appendChild(liElement);
        }
    }

}

// declare cart object
const cart = [];
let totalQuantity = 0;
console.log('cart', cart.length);

// adding to cart
function addToCart(name, price){
    console.log('item in addToCart', name, price)

    price = parseFloat(price);

    // If the cart is empty, add the first item directly
    if(cart.length === 0){
        const objectToInsert = {
            drink: name,
            cost: price,
            quantity: 1
        }
        cart.push(objectToInsert)
    }
    // if cart is not empty, we need to check if the passed in item exists
    else{

        // you will see booleans created like this pretty often. it's typically called a flag.  
        let itemExists = false;

        // check if item already exists in cart. if it is then increase the quantity and set the flag to true
        // you will notice 'break'.  this is a keyword in javascript.  it breaks out of the loop.  it is used here to break out as soon if the item is found since there is no need to keep going. unlike return, which would exit the entire function, break just exits the loop
        for (let index = 0; index < cart.length; index++) {
            if(cart[index].drink === name){
                cart[index].quantity++
                itemExists = true
                break
            }
        }

        // if there are items in the cart, but this item does not exist, add it to the cart
        if(!itemExists){
            const objectToInsert = {
                drink: name,
                cost: price,
                quantity: 1
            }
            cart.push(objectToInsert)
        }
    }
    
    // call (invoke) the updateCart() function.  we orginally had the updateCart() code in the addToCart() function, but it is more readable to separate it out. 
    updateCart()

}

function updateCart() {

    // reset totalCost
    let totalCost = 0;

    // get the element that we will be appending to
    let ulElement = document.getElementById("cart-items");


     // Clear the current list before updating to prevent duplicates
     // notice here we use innerHTML instead of inner text.  this will clear all the <li>s 
    ulElement.innerHTML = '';

    // loop through the cart to create the <li>s and append them. also we will calculate total cost.
    console.log('cart', cart)
    for (let index = 0; index < cart.length; index++) {

        // calculate total cost based on cost and quantity of each item
        totalCost += cart[index].cost * cart[index].quantity

        // create <li> and fill it's innerHTML for each index of the cart array.  
        // we are also adding a button so we can remove items.
        const liElement = document.createElement('li')
        liElement.innerHTML = `
        Item: ${cart[index].drink}, Price: $${cart[index].cost.toFixed(2)}, Quantity: ${cart[index].quantity}
            <button onclick="removeQuantity(${index})">-</button><button onclick="addQuantity(${index})">+</button><button onclick="removeFromCart(${index})">Remove</button>
        `;
        
        //append the li element
        ulElement.appendChild(liElement);
        
    }

    // get the element for the total and change it's innerText to the totalCost to 2 decimal places
    let totalElement = document.getElementById('total');
    totalElement.innerText = totalCost.toFixed(2);


}

// remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}


// increase quantity
function addQuantity(index) {
    cart[index].quantity++;
    cart[index].quantityCost = cart[index].cost * cart[index].quantity;
    updateCart();
}

// decrease quantity
function removeQuantity(index) {
    if (cart[index].quantity === 1) {
        removeFromCart();
    } else {
        cart[index].quantity--;
        cart[index].quantityCost = cart[index].cost * cart[index].quantity;
        updateCart();
    }
}

// // check out
// function checkout() {
//     if (cart.length === 0) {
//         alert('your cart is empty!');
//         return;
//     }
//     alert(
//         `Thank you for your purchase, ${
//             loggedInUser && loggedInUser.username
//                 ? loggedInUser.username
//                 : 'Human'
//         }!`
//     );
//     cart.length = 0;
//     updateCart();
// }

async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    console.log('cart in checkout', cart)
    //get the cart array and pass it to server to be stored in orderArray
    const response = await fetch('http://localhost:3000/checkout', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(cart)
        })
        console.log('response', response)
    
        let responseJson = await response.json();
        console.log('responseJson', responseJson)
    
        if(!response.ok){
            alert(responseJson.message)
        }
        alert(`${responseJson.message}. Confirmation number: ${responseJson.confirmationNumber}`)
    
    cart.length = 0;
    updateCart();
}

// add discount
function addDiscount(event) {
    event.preventDefault();
    console.log('is the discount funciton firing?');
    const discountElement = document.getElementById('discountCode');
    const discountCode = discountElement.value;

    if (
        discountCode === validDiscount[0].code &&
        !discountApplied &&
        cart.length !== 0
    ) {
        console.log('is the save20 if firing?');
        discount = validDiscount[0].discountpct;
        discountApplied = true;
        updateCart();
        discountElement.value = '';
        return;
    } else if (
        discountCode === validDiscount[1].code &&
        !discountApplied &&
        cart.length !== 0
    ) {
        discount = validDiscount[1].discountpct;
        discountApplied = true;
        updateCart();
        discountElement.value = '';
        return;
    } else if (discountApplied) {
        alert('cannot stack discounts');
        return;
    } else if (cart.length === 0) {
        alert('add items to cart');
    } else {
        alert('invalid discount');
    }
}

// practice get route
function practiceGetRoute() {
    const response = fetch('http://localhost:3000')
    console.log('response', response)
}

// get menu from server
async function getMenuFromServer() {
    const response = await fetch('http://localhost:3000/getMenu')
    console.log('response', response);
    if(response.status != 200) {
        console.error('response error');
        return;
    }
let data = await response.json();
console.log('data', data);

createMenu(data);
}


// going to create the form on the page via javascript
function createContactform(){
    let formElement = document.createElement("form");
    formElement.style.listStyleType = 'none';
    formElement.onsubmit = submitContact;
    formElement.innerHTML = `
    <div class="contact-form">
    <label for="first-name">First Name:</label> 
    <input type="text" id="first-name" name="firstName">First Name</input><br>
    <label for="last-name">Last Name:</label> 
    <input type="text" id="last-name" name="lastName">Last Name</input> <br>
    <label for="email">Email:</label>
    <input type="test" id="email" name="email"></input> <br>
    <label for="comment">Comment:</label> 
    <textarea id="comment" name="comment"></textarea><br>
    <button type="submit">Submit</button>
    </div>
    `;

    document.body.appendChild(formElement);
}


// submitting the contact data
async function submitContact(event) {
    event.preventDefault();

    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const commentInput = document.getElementById("comment");

    const formData = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        comment: commentInput.value
    }

    const response = await fetch('http://localhost:3000/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        });

    console.log('response', response);
    if(response.status != 200) {
        console.error('response error');
            return;
    }
    let message = await response.json();
    console.log('message', message);

    console.log('clearing the fields...');
    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    commentInput.value = '';
    console.log('fields should be cleared.');

}
    // if(menu && menu.length > 0){
    //     for (let i = 0; i < menu.length; i++) {
    //         const liElement = document.createElement('li')
    //         liElement.innerHTML = `
    //         <div class="menu-item">
    //         <span id="${menu[i].name}">${menu[i].name}</span>
    //         <button onclick="addToCart('${menu[i].name}', '${menu[i].price.toFixed(2)}')">Add To Cart ($${menu[i].price.toFixed(2)})</button>

    //         </div>
    //     `;
    //     ulElement.appendChild(liElement);
    //     }
    // }




//execute upon pageload
document.addEventListener('DOMContentLoaded', function () {
    // createMenu();
    getUserLocation();
    getMenuFromServer();
    createContactform();
});
