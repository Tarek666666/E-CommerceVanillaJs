// variabels
const heroSection = document.querySelector(".hero_section");
const bannerBtn = document.querySelector(".banner_btn");
const productsContainerDOM = document.querySelector(".products_container");
let totalItemsDOM = document.querySelector(".total_items");
const cartButton = document.querySelector(".cart_btn");
const cartOverlay = document.querySelector(".cart_overlay");
const closeCartButton = document.querySelector(".close_cart_btn");
const totalDOM = document.querySelector(".total");
const cartItemsDOM = document.querySelector(".cart_items_container");
const clearCartBtn = document.querySelector('.clear_cart_btn');
const totalContainer = document.querySelector('.total_container');
const collectionContainer = document.querySelector('.collection_container');
//cart
let cart = [];
let buttonsDOM = [];
let total = 0;
let totalAmount = 0;
//getting prodcuts
class Prodcuts {
    async getProducts() {
        //fetching all products from json file , destructer the needed values and return those in a new object
        try {
            let fetched = await fetch("products.json");
            let result = await fetched.json();
            let prodcuts = result.items;
            prodcuts = prodcuts.map((product) => {
                const { title, price, image } = product.fields;
                const { id } = product.sys;
                const url = image.fields.file.url;
                return { id, title, price, url };
            });
            return prodcuts;
        } catch (error) {
            console.log(error);
        }
    }
}
//display products
class UI {
    //after getting the products object. display the products on the dom
    displayProducts(prodcuts) {
        
        let result = "";
        prodcuts.forEach((item) => {
            result += ` <div class="product">
            <div class="image_container">
                <img src="${item.url}" alt="" />
                <div class="buy_btn" data-id="${item.id}">
                    <i class="fa-sharp fa-solid fa-cart-plus"></i>
                </div>
            </div>
            <h1 class="product_name">${item.title}</h1>
            <h2>$ <span class="product_price">${item.price}</span></h2>
        </div>`;
        });
        productsContainerDOM.innerHTML =  result;
    }
    //after the products being added to the dom, we can select the buttons since they are already created
    // check if the item exists in the cart if so, disable buy button
    //if it doesnt exist in the cart, add eventlistener to the button , when the button is pressed, add the product to the cart
    getAddButtons() {
        const addButtons = [...document.querySelectorAll(".buy_btn")];
        buttonsDOM = addButtons;
        addButtons.forEach((btn) => {
            let id = btn.dataset.id;
            let inCart = cart.find((item) => item.id === id);
            if (inCart){
                btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
                btn.classList.add("btn_disabled");    
                btn.parentElement.parentElement.getElementsByTagName('img')[0].style.opacity = "0.3";
                }
                btn.addEventListener("click", (e) => {
                    btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
                    btn.classList.add("btn_disabled");
                    btn.parentElement.parentElement.getElementsByTagName('img')[0].style.opacity = "0.3";
                    let cartItem = { ...Storage.getProductId(id), amout: 1 };
                    clearCartBtn.classList.remove('invisible');
                    cart = [...cart, cartItem];
                    Storage.saveCartToLocal(cart);
                    this.setCartValues(cart);
                    this.addCartItems(cartItem);
                    this.showCart();
                });
        });
    }
    // do the calculation based on the items in cart, display the current price and amount in dom
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amout;
            itemsTotal += item.amout;
        });
        if(cart.length === 0){
            clearCartBtn.classList.add('invisible')
            this.hideCart();
        }
        totalItemsDOM.innerText = itemsTotal;
        totalDOM.innerHTML = parseFloat(tempTotal.toFixed(2));
    }
    // when buy button is clicked, object of the selected product is created, this function take the object and create dom element and append it to the dom
    addCartItems(cartItem) {
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("cart_item");
        itemDiv.innerHTML    = `             <div class="cart_item_image"><img src="${cartItem.url}" alt="" /></div>
                                          <div class="cart_item_info">
                                                <span class="title">${cartItem.title}</span>
                                                <span class="price">$ ${cartItem.price * cartItem.amout}  </span>
                                                <span class="remove_item" class="${cartItem.id}">Remove</span>
                                          </div>
                                          <div class="cart_item_amount">
                                                    <span class="increase_amount"><i class="fa-sharp fa-solid fa-arrow-up"></i></span>
                                                    <span class="amount">${cartItem.amout}</span>
                                                    <span class="increase_amount"><i class="fa-sharp fa-solid fa-arrow-down"></i></i></span>
                                          </div>`;
        cartItemsDOM.appendChild(itemDiv);
        itemDiv.setAttribute('data-set' , cartItem.id);
    }
    showCart() {
        cartOverlay.style.transform = "scaleX(1)";
        cartOverlay.classList.remove('invisible');
    }
    hideCart() {
        cartOverlay.style.transform = "scaleX(0)";
        cartOverlay.classList.add('invisible');
    }
    setupAPP() {
        //general setup for the app
        //force page to scroll top when refresh
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
          };
        cartButton.addEventListener("click", this.showCart);
        closeCartButton.addEventListener("click", this.hideCart);
        // shop now button , when pressed the header background will dissapear
        bannerBtn.addEventListener("click", () => {
            heroSection.style.transform = "scaleY(0)";
            heroSection.style.height = "10px";
            collectionContainer.classList.remove('invisible');
            productsContainerDOM.classList.remove('invisible');
        });
        cart = Storage.getCartItems();
        this.populateCart(cart);
        this.setCartValues(cart)
    }
    populateCart(cart) {
        cart.forEach((item) => {
                this.addCartItems(item);
        });  
    }
//cart logic and functionalitiy
    cartLogic(){
        clearCartBtn.addEventListener('click' , ()=>{
            this.clearCart();     
        })
        cartItemsDOM.addEventListener('click' , e =>{
            let selectedItem = cart.filter(item => item.id === e.target.parentElement.parentElement.parentElement.getAttribute('data-set'));
            let itemContainer = e.target.parentElement.parentElement.parentElement;
            let tempAmount ;
         if(e.target.classList.contains('fa-arrow-up')){
            selectedItem[0].amout = selectedItem[0].amout + 1 ;
            tempAmount  = selectedItem[0].amout;
            itemContainer.querySelector('.amount').innerHTML = tempAmount;
            itemContainer.querySelector('.price').innerHTML = '$ ' +  parseFloat(tempAmount * selectedItem[0].price).toFixed(2);
            this.setCartValues(cart);
            Storage.saveCartToLocal(cart);
         }
         else if(e.target.classList.contains('fa-arrow-down')){
            selectedItem[0].amout - 1 ;
            tempAmount  = selectedItem[0].amout;
            if(tempAmount > 1){
                selectedItem[0].amout = selectedItem[0].amout - 1 ;
                tempAmount  = selectedItem[0].amout;
                itemContainer.querySelector('.amount').innerHTML = tempAmount;
                itemContainer.querySelector('.price').innerHTML = '$ ' +  parseFloat(tempAmount * selectedItem[0].price).toFixed(2);
                this.setCartValues(cart);
                Storage.saveCartToLocal(cart);
            }
            else {
                let id = selectedItem[0].id;
                // if it's the last item means the amount is 0, the item wil be removed
                // the buy button will be active again for the deleted item
                // if there is no other items in the cart then we will clear the cart and active all buttons
                selectedItem[0].amout = selectedItem[0].amout - 1 ;
                buttonsDOM[id - 1].classList.remove('btn_disabled');
                buttonsDOM[id - 1].innerHTML = `<i class="fa-sharp fa-solid fa-cart-plus"></i>`;
                buttonsDOM[id - 1].style.opacity = "1";
                buttonsDOM[id - 1].parentElement.parentElement.getElementsByTagName('img')[0].style.opacity = "1";
                this.deleteItem(id);
                Storage.saveCartToLocal(cart);
                this.setCartValues(cart);   
                cartItemsDOM.removeChild(itemContainer);
            }
         }
         else if(e.target.classList.contains('remove_item') ){
            let id = e.target.parentElement.parentElement.getAttribute('data-set');
            buttonsDOM[id - 1].classList.remove('btn_disabled');
            buttonsDOM[id - 1].innerHTML = `<i class="fa-sharp fa-solid fa-cart-plus"></i>`;
            buttonsDOM[id - 1].parentElement.parentElement.getElementsByTagName('img')[0].style.opacity = "1";
            this.deleteItem(id);
            Storage.saveCartToLocal(cart);
            this.setCartValues(cart);   
            itemContainer.removeChild(e.target.parentElement.parentElement)
         }
        })
    }
    clearCart(){       
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.deleteItem(id));
        while(cartItemsDOM.children.length>0){
            cartItemsDOM.removeChild(cartItemsDOM.children[0]);
        }
        this.setCartValues(cart);
        Storage.saveCartToLocal(cart);
        buttonsDOM.forEach(btn=> {
            btn.classList.remove('btn_disabled');
            btn.innerHTML = `<i class="fa-sharp fa-solid fa-cart-plus"></i>`
            btn.parentElement.parentElement.getElementsByTagName('img')[0].style.opacity = "1";
        })
    }
    deleteItem(id){   
        cart = cart.filter(item => item.id !== id);
    }
}
// local storage
class Storage {
    static saveProductsLocal(prodcuts) {
        localStorage.setItem("products", JSON.stringify(prodcuts));
    }
    static getProductId(id) {
        let prodcuts = JSON.parse(localStorage.getItem("products"));
        return prodcuts.find((item) => item.id === id);
    }
    static saveCartToLocal(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCartItems() {
        cart = JSON.parse(localStorage.getItem("cart"))
            ? JSON.parse(localStorage.getItem("cart"))
            : [];
        return cart;
    }
}

// when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const products = new Prodcuts();
    const ui = new UI();
    ui.setupAPP();
    products
        .getProducts()
        .then((prodcuts) => {
            ui.displayProducts(prodcuts);
            Storage.saveProductsLocal(prodcuts);
        })
        .then(() => {
            ui.cartLogic(); 
            ui.getAddButtons();
        })
        .catch((er) => {
            console.log(er)
        });
});
