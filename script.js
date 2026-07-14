// SEARCH FUNCTIONcard.dataset.price || "";

console.log("JS Loaded");
let allImages = [];
const searchInput = document.querySelector(".search-box input");
searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    document
    .querySelectorAll("#productsContainer .card")
    .forEach(card => {

        const title = card.querySelector("h3")
        .textContent
        .toLowerCase();

        card.style.display =
        title.includes(value)
        ? "block"
        : "none";

    });

});
/* =========================
        CART SYSTEM
 =========================*/

let cartCount = 0;
const cartCounter =
document.querySelector(".cart-count");


const modal = document.getElementById("productModal");
const closeBtn = document.querySelector(".close-btn");

const modalTitle =
document.getElementById("modalTitle");

const modalPrice =
document.getElementById("modalPrice");

const modalImage =
document.getElementById("modalImage");
const thumbnailContainer =
document.getElementById("thumbnailContainer");
const imagePreview =
document.getElementById("imagePreview");

const previewImg =
document.getElementById("previewImg");
let previewImages = [];
let previewIndex = 0;

const prevPreview =
document.getElementById("prevPreview");

const nextPreview =
document.getElementById("nextPreview");
const closePreview =
document.getElementById("closePreview");
const sellerContact =
document.getElementById("sellerContact");
const sellerName =
document.getElementById("sellerName");
const productDescription =
document.getElementById("productDescription");
document.addEventListener("click", (e) => {

    if(e.target.classList.contains("details-btn")) {

        const card = e.target.parentElement;

        modal.dataset.id =
        card.dataset.id;

        modalTitle.textContent =
        card.querySelector("h3").textContent;

        modalPrice.textContent =
        card.querySelector(".price").textContent;

        const images =
card.dataset.images
? card.dataset.images.split(",")
: [];
previewImages = images;
if(images.length > 0){

   modalImage.src =
images[0].trim();

}else{

    modalImage.src =
    card.querySelector("img").src;

}

thumbnailContainer.innerHTML = "";

images.forEach(img => {

    thumbnailContainer.innerHTML += `
        <img
       src="${img}"
        class="thumb"
        style="width:60px;height:60px;cursor:pointer;margin:5px;">
    `;

});
        sellerName.textContent =
"Seller: " + (card.dataset.username || "Unknown");
        sellerContact.textContent =
"Contact: " + (card.dataset.contact || "Not Available");

productDescription.textContent =
"Description: " + (card.dataset.description || "No Description");

        modal.style.display = "flex";

    }

});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});
const cartLink =
document.querySelector(".cart-link");

const cartSidebar =
document.querySelector(".cart-sidebar");

const closeCart =
document.querySelector(".close-cart");

const cartItems =
document.querySelector(".cart-items");

const totalPrice =
document.getElementById("totalPrice");

let total = 0;
cartLink.addEventListener("click",(e)=>{
    e.preventDefault();
    cartSidebar.classList.add("active");
});
closeCart.addEventListener("click",()=>{
    cartSidebar.classList.remove("active");
});
const buyBtn =
document.querySelector(".buy-btn");

buyBtn.addEventListener("click", () => {

    alert(
        "✅ Thank you for shopping on CampusKart!"
    );

});
addToCartBtn.addEventListener(
    "click",
    async () => {

        const userEmail =
        localStorage.getItem("userEmail");
        if(!userEmail){
            alert("Please Login First");
            return;
        }
        const productId =
        modal.dataset.id;
        try{
            const response =
            await fetch(
                "/cart",
                {
                    method: "POST",
                    headers:{
                        "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify({
                        user_email: userEmail,
                        product_id: productId
                    })
                }
            );
          const data =
await response.json();

alert(data.message);

await loadCart();
 } catch(error){
            console.log(error);
        }
    }
);
document.addEventListener("click", async (e) => {
    if(e.target.classList.contains("wishlist")) {
        const userEmail =
        localStorage.getItem("userEmail");
        if(!userEmail){
            alert("Please Login First");
            return;
        }
        const card =
        e.target.closest(".card");
        const productId =
        card.dataset.id;
        try{
            if(e.target.classList.contains("active")){

                const response =
                await fetch(
                    "/wishlist",
                    {
                        method: "DELETE",
                        headers:{
                            "Content-Type":
                            "application/json"
                        },
                        body: JSON.stringify({
                            user_email: userEmail,
                            product_id: productId
                        })
                    }
                );

                const data =
                await response.json();

                e.target.classList.remove("active");
                e.target.textContent = "🤍";

                alert(data.message);

            } else {

                const response =
                await fetch(
                    "/wishlist",
                    {
                        method: "POST",
                        headers:{
                            "Content-Type":
                            "application/json"
                        },
                        body: JSON.stringify({
                            user_email: userEmail,
                            product_id: productId
                        })
                    }
                );
                const data =
                await response.json();
                e.target.classList.add("active");
                e.target.textContent = "💚";
                alert(data.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }
});
document.querySelector('a[href="#home"]').addEventListener("click", () => {
  document.getElementById("productsContainer")
.querySelectorAll(".card")
.forEach(card => { 

        card.style.display = "block";

    });

});
document.querySelector('a[href="#favorites"]').addEventListener("click", (e) => {

    e.preventDefault();

    document.querySelectorAll(".card").forEach(card => {

        const heart = card.querySelector(".wishlist");

        card.style.display =
            heart.classList.contains("active")
            ? "block"
            : "none";

    });

    document.getElementById("items").scrollIntoView({
        behavior: "smooth"
    });

});
searchInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

        document.getElementById("items").scrollIntoView({
            behavior: "smooth"
        });

    }

});
const sellBtn =
document.getElementById("sellBtn");

const sellModal =
document.getElementById("sellModal");

const closeSell =
document.querySelector(".close-sell");

sellBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    sellModal.classList.add("active");

});

closeSell.addEventListener("click",()=>{

    sellModal.classList.remove("active");

});
const helpBtn =
document.getElementById("helpBtn");

const helpModal =
document.getElementById("helpModal");

const closeHelp =
document.querySelector(".close-help");

helpBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    helpModal.classList.add("active");

});

closeHelp.addEventListener("click",()=>{

    helpModal.classList.remove("active");

});

const learnBtn =
document.getElementById("learnMoreBtn");

const learnModal =
document.getElementById("learnModal");

const closeLearn =
document.querySelector(".close-learn");

learnBtn.addEventListener("click",()=>{

    learnModal.classList.add("active");

});

closeLearn.addEventListener("click",()=>{

    learnModal.classList.remove("active");

});
const loginBtn =
document.getElementById("loginBtn");

const loginModal =
document.getElementById("loginModal");

const closeLogin =
document.querySelector(".close-login");

loginBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    loginModal.classList.add("active");

});

closeLogin.addEventListener("click",()=>{

    loginModal.classList.remove("active");

});
document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName =
    document.getElementById("userName").value;

    const email =
    document.getElementById("userEmail").value;

    try {

        const response = await fetch(
            "/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: fullName,
                    email: email
                })
            }
        );

        const data = await response.json();

        localStorage.setItem(
            "userName",
            fullName
        );

        localStorage.setItem(
            "userEmail",
            email
        );

        const firstName =
        fullName.split(" ")[0];

        loginBtn.innerHTML =
        `<i class="fa-solid fa-user"></i> ${firstName}`;

        loginModal.classList.remove("active");

        alert(data.message);

    } catch(error) {

        console.log(error);
        alert("Login Error");

    }

});
const savedName =
localStorage.getItem("userName");

if(savedName){

    const firstName =
    savedName.split(" ")[0];

    loginBtn.innerHTML =
    `<i class="fa-solid fa-user"></i> ${firstName}`;

}
const themeToggle =
document.getElementById("themeToggle");

themeToggle.addEventListener("click",(e)=>{

    e.preventDefault();

    document.body.classList.toggle("dark-mode");

    themeToggle.textContent =
    document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";

});
const imageInput =
document.getElementById("productImage");

imageInput.addEventListener("change", () => {

    const newFiles =
    Array.from(imageInput.files);

    allImages.push(...newFiles);

    renderImages();

});
function renderImages(){

    const container =
    document.getElementById("selectedImages");

    container.innerHTML = "";

    allImages.forEach((file,index)=>{

        const imageUrl =
        URL.createObjectURL(file);

       container.innerHTML += `
<div class="preview-box">

    <img
    src="${imageUrl}"
    class="preview-image sell-preview"
    data-src="${imageUrl}">

    <button
    type="button"
    class="remove-image"
    data-index="${index}">
        ✖
    </button>

</div>
`;
    });

}
const submitBtn =
document.querySelector(
'#sellForm button[type="submit"]'
);

const sellForm = document.getElementById("sellForm");

sellForm.addEventListener("submit", async (e) => {

    e.preventDefault();
     submitBtn.disabled = true;
    submitBtn.innerText = "Uploading Images...";
    const formData = new FormData();

    formData.append(
        "product_name",
        document.getElementById("productName").value
    );

    formData.append(
        "price",
        document.getElementById("price").value
    );
formData.append(
    "category",
    document.getElementById("category").value
);
    formData.append(
    "contact",
    document.getElementById("contact").value
);

formData.append(
    "description",
    document.getElementById("description").value
);
    formData.append(
    "user_email",
    localStorage.getItem("userEmail")
);
formData.append(
    "user_name",
    localStorage.getItem("userName")
);

allImages.forEach(image => {

    formData.append(
        "images",
        image
    );

});


    try {

        const response = await fetch(
            "/add-product",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();
        alert(data.message);
        submitBtn.disabled = false;
submitBtn.innerText = "Submit Product";
        sellForm.reset();
allImages = [];

document.getElementById(
    "selectedImages"
).innerHTML = "";
    }catch (error) {

    console.log(error);

    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Product";
        
    alert("Error adding product");

}

});
async function loadProducts() {

    try {

        const response = await fetch(
            "/products"
        );

        const products = await response.json();

        const container =
        document.getElementById(
            "productsContainer"
        );

        container.innerHTML = "";

            products.forEach(product => {

    const firstImage =
    product.images
    ? product.images.split(",")[0].trim()
    : product.image;

   const imageUrl =
firstImage
? firstImage
: "images/laptop.jpg";

    container.innerHTML += `
<div class="card"
data-id="${product.product_id}"
data-category="${product.category || ''}"
data-contact="${product.contact || ''}"
data-description="${product.description || ''}"
data-username="${product.user_name || ''}"
data-images="${product.images || ''}">

    <span class="wishlist">🤍</span>

    <img src="${imageUrl}">

    <h3>${product.product_name}</h3>

    <p class="product-category">
        ${product.category}
    </p>

    <p class="price">
        ₹${product.price}
    </p>

    <button class="details-btn">
        View Details
    </button>

</div>
`;
});
       return true; 
    } catch(error) {
        console.log(error);
    }
}
async function loadCart() {

    const userEmail =
    localStorage.getItem("userEmail");

    if(!userEmail) return;

    try {

        const response = await fetch(
            `/cart/${userEmail}`
        );

        const cartData = await response.json();

        cartItems.innerHTML = "";
        cartCount = 0;
        total = 0;
       

        cartData.forEach(item => {

            const card =
            document.querySelector(
                `.card[data-id="${item.product_id}"]`
            );

            if(!card) return;

            const productName =
            card.querySelector("h3").textContent;

            const priceText =
            card.querySelector(".price").textContent;

          

            cartCount++;

            const itemDiv =
            document.createElement("div");

            itemDiv.classList.add("cart-item");

            itemDiv.innerHTML = `
                <h4>${productName}</h4>
                <p class="item-price">${priceText}</p>
                <button class="remove-item">
                    ❌ Remove
                </button>
            `;

            cartItems.appendChild(itemDiv);
            
            itemDiv.querySelector(".remove-item")
.addEventListener("click", async () => {

    const userEmail =
    localStorage.getItem("userEmail");
    console.log("Remove clicked");
    try {

        await fetch(
            "/cart",
            {
                method: "DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    user_email: userEmail,
                    product_id: item.product_id
                })
            }
        );
        console.log("Deleted from DB");

    } catch(error){
        console.log(error);
    }

    itemDiv.remove();

    cartCount--;
    cartCounter.textContent = cartCount;

    total -= parseInt(
        priceText.replace("₹","")
    );

    totalPrice.textContent = total;

    cartItems.innerHTML = "";
    
    await loadCart();
});
            total += parseInt(
                priceText.replace("₹","")
            );

        });

        cartCounter.textContent = cartCount;
        totalPrice.textContent = total;

    } catch(error) {

        console.log(error);

    }
}

async function loadWishlist() {

    const userEmail =
    localStorage.getItem("userEmail");

    if(!userEmail) return;

    try{

        const response =
        await fetch(
            `/wishlist/${userEmail}`
        );

        const wishlistData =
        await response.json();

        wishlistData.forEach(item => {

            const card =
            document.querySelector(
                `.card[data-id="${item.product_id}"]`
            );

            if(card){

                const heart =
                card.querySelector(".wishlist");

                heart.classList.add("active");
                heart.textContent = "💚";
            }
        });
     

    }catch(error){

        console.log(error);

    }
}
async function init(){

    await loadProducts();

    
    await loadWishlist();

    await loadCart();

}

init();
async function loadMyProducts() {

    console.log("My Products Clicked");

    const userEmail =
    localStorage.getItem("userEmail");

    if(!userEmail){
        alert("Please Login First");
        return;
    }

    try {

        const response = await fetch(
            `/my-products/${userEmail}`
        );

        const products =
        await response.json();

        console.log(products);

        const container =
        document.getElementById("productsContainer");

        container.innerHTML = "";

        if(products.length === 0){

            container.innerHTML = `
                <h2 style="text-align:center">
                    No Products Found
                </h2>
            `;

            return;
        }

      products.forEach(product => {
const firstImage =
product.images
? product.images.split(",")[0].trim()
: product.image;

const imageUrl =
firstImage
? firstImage
: "images/laptop.jpg";
       
    container.innerHTML += `
    <div class="card"
    data-id="${product.product_id}"
    data-price="${product.price}"
    data-contact="${product.contact || ''}"
    data-description="${product.description || ''}"
    data-username="${product.user_name || ''}"
    data-images="${product.images || ''}">

        <span class="wishlist">🤍</span>

        <img src="${imageUrl}">

        <h3>${product.product_name}</h3>

        <p class="price">
            ₹${product.price}
        </p>

        <button class="details-btn">
            View Details
        </button>

        <button class="edit-btn">
            Edit
        </button>

        <button class="delete-btn">
            🗑 Delete Product
        </button>

    </div>
    `;
}); 
        document.getElementById("items").scrollIntoView({
    behavior: "smooth"
});
    } catch(error){
        console.log(error);
    }
}
document
.getElementById("myProductsBtn")
.addEventListener("click", async (e) => {
    e.preventDefault();
    await loadMyProducts();
});
document.addEventListener("click", async (e) => {
     if(e.target.classList.contains("edit-btn")){
        
    const card =
    e.target.closest(".card");

    currentProductId =
    card.dataset.id;

    editPrice.value =
    card.dataset.price || "";

    editContact.value =
    card.dataset.contact || "";

    editDescription.value =
    card.dataset.description || "";

    editModal.style.display =
    "flex";
}
    if(e.target.classList.contains("delete-btn")){

        const confirmDelete =
        confirm("Are you sure?");

        if(!confirmDelete) return;

        const card =
        e.target.closest(".card");

        const productId =
        card.dataset.id;

        try{

            const response =
            await fetch(
                `/product/${productId}`,
                {
                    method: "DELETE"
                }
            );

            const data =
            await response.json();

            alert(data.message);
            card.remove();

        }catch(error){

            console.log(error);

            alert("Delete Failed");
        }
    }
});
modalImage.addEventListener("click",()=>{

    previewImg.src =
    modalImage.src;

    imagePreview.style.display =
    "flex";

});
closePreview.addEventListener("click",()=>{

    imagePreview.style.display =
    "none";

});
imagePreview.addEventListener("click",(e)=>{

    if(e.target === imagePreview){

        imagePreview.style.display =
        "none";

    }

});
document
.querySelectorAll(".category")
.forEach(category => {

    category.addEventListener("click", () => {

       const selected =
            category.dataset.category;
        document
        .querySelectorAll(".card")
        .forEach(card => {
            
            if(
                selected === "All" ||
                card.dataset.category === selected
            ){

                card.style.display =
                "block";

            }else{

                card.style.display =
                "none";

            }

        });

    });

});
const editModal =
document.getElementById("editModal");
const closeEdit =
document.querySelector(".close-edit");
const editPrice =
document.getElementById("editPrice");

const editContact =
document.getElementById("editContact");

const editDescription =
document.getElementById("editDescription");

const updateBtn =
document.getElementById("updateBtn");
let currentProductId = null;
closeEdit.addEventListener("click",()=>{

    editModal.style.display = "none";

});
updateBtn.addEventListener(
    "click",
    async () => {

        try{

            const response =
            await fetch(
                `/product/${currentProductId}`,
                {
                    method: "PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        price:
                        editPrice.value,

                        contact:
                        editContact.value,

                        description:
                        editDescription.value

                    })
                }
            );

            const data =
            await response.json();

            alert(data.message);

            editModal.style.display =
            "none";

            loadMyProducts();

        }catch(error){

            console.log(error);

            alert("Update Failed");

        }

    }
);
document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("thumb")){
        if(e.target.classList.contains("thumb")){

    previewIndex =
    Array.from(
        document.querySelectorAll(".thumb")
    ).indexOf(e.target);

    modalImage.src = e.target.src;

}
      

    }

});
document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("remove-image")){

        const index =
        Number(e.target.dataset.index);

        allImages.splice(index,1);

        renderImages();

    }

});
document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("sell-preview")){

        previewImg.src =
        e.target.dataset.src;

        imagePreview.style.display =
        "flex";

    }

});
nextPreview.addEventListener("click",()=>{

    if(previewImages.length === 0) return;

    previewIndex =
    (previewIndex + 1)
    % previewImages.length;

    previewImg.src =
    previewImages[previewIndex].trim();

});
prevPreview.addEventListener("click",()=>{

    if(previewImages.length === 0) return;

    previewIndex =
    (previewIndex - 1 + previewImages.length)
    % previewImages.length;
previewImg.src =
previewImages[previewIndex].trim();
});