// variabels
const heroSection = document.querySelector(".hero_section");
const bannerBtn = document.querySelector(".banner_btn");
const productsContainerDOM = document.querySelector(".products_container");
let totalItemsDOM = document.querySelector(".total_items");
const cartButton = document.querySelector(".cart_btn");
const cartOverlay = document.querySelector(".cart_overlay");
const closeCartButton = document.querySelector(".close_cart_btn");
const totalDOM = document.querySelector(".total");
const cartItemsDOM = document.querySelector('.cart_items_container');

//cart

let cart = [];

let buttonsDOM = [];

let total = 0;



//getting prodcuts

class Prodcuts {
    async getProducts() {
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

        productsContainerDOM.innerHTML = result;
    }

    getAddButtons() {
        const addButtons = [...document.querySelectorAll(".buy_btn")];
        cart = JSON.parse(localStorage.getItem("cart"));
        if (cart == null) {
            cart = [];
        }

        buttonsDOM = addButtons;

        addButtons.forEach((btn) => {
            let id = btn.dataset.id;
            let inCart = cart.find((item) => item.id === id);
            let itemsInCart = cart.length;

            if (inCart) {
                btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
                btn.classList.add("btn_disabled");
                btn.style.transform = "translateX(80%)";
                totalItemsDOM.innerHTML = itemsInCart;
            } else {
                btn.addEventListener("click", (e) => {
                    btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
                    btn.classList.add("btn_disabled");
                    btn.style.transform = "translateX(90%)";
                    btn.style.background = "#3a814a";
                    let cartItem = { ...Storage.getProductId(id), amout: 1 };
                    cart = [...cart, cartItem];
                    Storage.saveToCart(cart);
                    this.setCartValues(cart);
                    this.displayCartItems(cartItem)
                });
            }
        });
        //check if local storage is empty

        //get product from products

        // display product to the cart

        //save cart in local storage

        //set cart values

        //display cart item

        //show cart
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;

        cart.map((item) => {
            tempTotal += item.price * item.amout;
            itemsTotal += item.amout;
        });

        total = tempTotal;


        
        totalItemsDOM.innerText = itemsTotal;
         totalDOM.innerHTML = Math.round(tempTotal.toFixed(2)) ;
         



       
    }

    displayCartItems(cartItem){

// should be reusable function additemtocart , we use it again , child should be appended
        cartItemsDOM.innerHTML += ` <!--Single Cart item-->
        <div class="cart_item">
           <div class="cart_item_image"><img src="${cartItem.url}" alt="" /></div>
           <div class="cart_item_info">
               <span class="title">${cartItem.title}</span>
               <span class="price">$ ${cartItem.price} </span>
               <span class="remove_item" class="${cartItem.id}">Remove</span>
           </div>
           <div class="cart_item_amount">
                       <span class="increase_amount"><i class="fa-sharp fa-solid fa-arrow-up"></i></span>
                       <span class="amount">${cartItem.amout}</span>
                       <span class="increase_amount"><i class="fa-sharp fa-solid fa-arrow-down"></i></i></span>
           </div>
       </div>
       <!--End of Single Cart item-->`
        console.log(cartItem)

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

    static saveToCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getItemsFromCart() {
        let cart = JSON.parse(localStorage.getItem("cart"));

        console.log(cart);
    }
}

// when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // shop now button , when pressed the header background will dissapear

bannerBtn.addEventListener("click", () => {
    heroSection.style.transform = "scaleY(0)";
    heroSection.style.height = "10px";



    
    const products = new Prodcuts();
    const ui = new UI();
    cartButton.addEventListener("click", function () {
        cartOverlay.style.transform = "scaleX(1)";
    });

    closeCartButton.addEventListener("click", function () {
        cartOverlay.style.transform = "scaleX(0)";
    });

    products
        .getProducts()
        .then((prodcuts) => {
            ui.displayProducts(prodcuts);

            Storage.saveProductsLocal(prodcuts);
        })
        .then(() => {
            ui.getAddButtons();
        })
        .then(() => {});
});

    
});














// test for refresh to scroll to the top
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }
