const client = contentful.createClient({
    space: "t8iw9sp0ngcn",
    accessToken: "X8ocIGfar6erruc2y9Lxz5RUE2vcl5V_fZzDIgnVlvk",
    host: "preview.contentful.com"
  });

















const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//we will place all items here
let cart = [];

//buttons
let buttonsDOM = [];

// getting the products
class Products{
    async getProducts(){
        try {

            // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
            let contentful = await client.getEntries({
                content_type: "confyHouseProducts"
            });
            
            //getting entries only for our project related things

            


            // let result = await fetch('products.json')
            // let res = await result.json();


            let products = contentful.items;
            products = products.map((item) => {
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                //clean object
                return {title,price,id,image}
            })
            return products
        } catch (error) {
            console.log(error);
        }
    }
}

// display product
class UI{
    displayProducts(products){
        let result = '';
        products.forEach((product) => {
            const {id, title, price, image} = product;
            result += `
            <article class="product">
            <div class="img-container">
                <img src=${image} alt="" class="product-img">
            
            <button class="bag-btn" data-id=${id}>
                <i class="fas fa-shopping-cart"></i>
                add to bag
            </button>
            </div>

            <h3>${title}</h3>
            <h4>${price}</h4>

            </article>`

        
        });

        productsDOM.innerHTML = result;
    }

    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        //if you check it will give nodelist
        //to convert to an array use [...element]
        //now we need to loop over all buttons and get the "id"
        buttons.forEach((button) => {
            let id = button.dataset.id;
            
            //checking if item in the cart or not
            let inCart = cart.find(item => item.id === id);
            
            //if present
            //disable add to cart cant be added again
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }

            //item not in the cart
    
            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;

                //getting product from products
                let cartItem = {...Storage.getProduct(id), amount:1};
                
                //add product to the cart

                cart = [...cart, cartItem];

                //save the cart to localstorge so it can be accessible
                Storage.saveCart(cart);

                //set cart values
                this.setCartValues(cart);

                //display cart item
                this.addCartItem(cartItem);


                //show the cart
                this.showCart();
            });
            
        }); 
    }

    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;

        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })

        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item){
        
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`

        cartContent.appendChild(div);
    }


    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }

    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    setupAPP(){
        //the moment app is loaded cart
        //array will be assigned the values
        //present in local storage 
        //to our data is safe

        cart = Storage.getCart();
        //setup values upon loading the app
        this.setCartValues(cart);
        this.populateCart(cart);

        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    populateCart(cart){
        cart.forEach(item => {
            this.addCartItem(item)
        })
    }

    cartLogic(){
       clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
            //do this and it will now reference main class
       }); 

       //cart functionality : remove , add-reducce items
       //IN this case we are using event bubbling
       //everytime cart-content will be there and we will find target
       //if specific target is there we will call use on thing and same for others.

       cartContent.addEventListener('click', event => {
            //removing the item
            if(event.target.classList.contains('remove-item')){

                let removeItem = event.target;

                //we will use data set attr to remove an item
                let id = removeItem.dataset.id;

                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);

                //this will remove from the cart : we have to remove from DOM




            }

            else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;

                //get the item from cart update and push new amount

                let tempItem = cart.find(item => item.id === id);

                //now this item should have amount

                tempItem.amount = tempItem.amount + 1;

                //we are not done yet : update in localstorage and update total also
                Storage.saveCart(cart);

                this.setCartValues(cart);

                addAmount.nextElementSibling.innerText = tempItem.amount;
            }

            else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;

                let tempItem = cart.find(item => item.id === id);

               
                tempItem.amount = tempItem.amount - 1;
                
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                    
                }

              
            
                

                
            }
       })
    }

    clearCart(){
        // console.log(this);
        // this will be referencing button not the class
        let cartItems = cart.map(item => item.id);

        cartItems.forEach(id => this.removeItem(id))

        //we have cleared the array now lets remove them from dom also
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0]);
        }

        //now after clearing the whole cart I want to hide the cart as well
        this.hideCart();
    }

    

    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);

        //save latest cart
        Storage.saveCart(cart);

        //changing button text back to "add to cart"
        let button = this.getSingleButton(id);
        
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
    }

    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }

    
    
}

// local storage 
class Storage{
    //creating static method : so we can use it without creating instance of a class
    static saveProducts(products){
        //save it as a string
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }

    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []

        //if item is there return in json formate or return empty
    }
}


// events

document.addEventListener("DOMContentLoaded", () => {

    const ui = new UI();
    const products = new Products();

    //setup application
    ui.setupAPP();


    //get products
    products.getProducts().then(products => {ui.displayProducts(products)
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic(); //increase or reduce values -- clear items and all

    });

    //with above method products are displayed

    
});
