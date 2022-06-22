// Product
function getIdProductPage(){
    let id = window.location.search;
    // slice retire 4 premiers caractère
    return id.slice(4);
}
async function getProductById(id){
    return await fetch("http://localhost:3000/api/products/"+id)
    .then(function(res) {
    if (res.ok) {
        return res.json();
    }
    })
    .then(function(result) {
        return result;
    })
    .catch(function(err) {
    // Une erreur est survenue
    });
}
function changeProduct(){
//Verification si l'id n'est pas déjà enregistré

    getProductById(getIdProductPage()).then((result) => {                     
        //Ajout de l'image
        document
        .getElementsByClassName("item__img")[0]
        .innerHTML="<img src=\""+result.imageUrl+"\" alt=\""+result.altTxt+"\">";
        //Titre
        document
        .getElementById("title")
        .innerHTML=result.name;
        //Prix
        document
        .getElementById("price")
        .innerHTML=result.price;
        //Description
        document
        .getElementById("description")
        .innerHTML=result.description;
        //Select color
        //Reset color
        document
        .getElementById("colors")
        .innerHTML="";
        for (const iterator of result.colors) {
            document
            .getElementById("colors")
            .innerHTML+="<option value=\""+iterator+"\">"+iterator+"</option>";
        }
    });
    clickaddToCart();
}
function addToCart(){
document.getElementById("animation__container__notification").classList.toggle("animation");
document.getElementById("addToCart").disabled="true";
document.getElementById("addToCart").style.opacity="0.7";
window.setTimeout( function(){
    document.getElementById("animation__container__notification").classList.remove("animation");
    document.getElementById("addToCart").disabled="";
    document.getElementById("addToCart").style.opacity="1";
} , 3000);

let id=getIdProductPage();
let color=document.getElementById("colors").value;
let quantity=document.getElementById("quantity").value;
let productClient={'id':id,'color':color,'quantity':quantity};
let productStorage;
let verif={
    similarIdColor:0,
    possimilarIdColor:0,
    similarId:0,
    possimilarId:0
}
    for(i=0;i<localStorage.length;i++){
        productStorage=localStorage.getItem(i);
        productStorage=JSON.parse(productStorage);
        if((productClient.id==productStorage.id) && (productClient.color==productStorage.color)){
            console.log("Produit de même couleur déjà ajouté, ajout de la quantité");
            
            let x=parseInt(productStorage.quantity,10);
            let tampon=parseInt(productClient.quantity,10) + x;
            productClient.quantity=tampon;
            localStorage.setItem(i,JSON.stringify(productClient));

            verif.similarIdColor++;
            verif.posIdColor=i;
            i=localStorage.length+1;
        }
        else if(productClient.id==productStorage.id){
            verif.similarId++;
            verif.possimilarId=i;
        }
    }
    if(verif.similarIdColor==0 && verif.similarId!=0){
        console.log("Produit de couleur différente déjà ajouté, ajout de la couleur via l'id");
        localStorage.setItem(localStorage.length,JSON.stringify(productClient));
    }
    else if(verif.similarIdColor==0 && verif.similarId==0){
        console.log("Ajout du produit");
        localStorage.setItem(localStorage.length,JSON.stringify(productClient));
    }
}
function clickaddToCart(){
    document.getElementById("addToCart").addEventListener("click",addToCart);
}
//
// Cart
async function getCart(){
    let product;
    let stockageapiproduct=[];
    
    // addProductCart(product.id,product,i);
    for (i=0 ; i<localStorage.length ;i++){
        let verif=0;
        product=JSON.parse(localStorage.getItem(i));
        for(y=0 ; y<stockageapiproduct.length;y++){
            if(stockageapiproduct[y]._id==product.id){
                writeArticleCart(stockageapiproduct[y],product);
                verif++;
                y=stockageapiproduct.length;
            }
        }
        if(verif==0){
            await getProductById(product.id).then((apiproduct) => {
                stockageapiproduct.push(apiproduct);
                writeArticleCart(apiproduct,product); 
            });
        }  
    }
    addEventCart();
    refreshPanier();
}
function writeArticleCart(apiproduct,product){
    document.getElementById("cart__items").innerHTML+=
            "<article class=\"cart__item\" data-id=\""+product.id+"\" data-color=\""+product.color+"\">"+
                "<div class=\"cart__item__img\">"+
                    "<img src=\""+apiproduct.imageUrl+"\" alt=\""+apiproduct.altTxt+"\">"+
                "</div>"+
                "<div class=\"cart__item__content\">"+
                    "<div class=\"cart__item__content__description\">"+
                    "<h2>"+apiproduct.name+"</h2>"+
                    "<p>"+product.color+"</p>"+
                    "<p>"+apiproduct.price+" €</p>"+
                "</div>"+
                "<div class=\"cart__item__content__settings\">"+
                    "<div class=\"cart__item__content__settings__quantity\">"+
                        "<p>Qté : "+product.quantity+"</p>"+
                      "<input type=\"number\" class=\"itemQuantity\" name=\"itemQuantity\" min=\"1\" max=\"100\" value=\""+product.quantity+"\">"+
                    "</div>"+
                    "<div class=\"cart__item__content__settings__delete\">"+
                      "<p class=\"deleteItem\">Supprimer</p>"+
                    "</div>"+
                "</div>"+
                "</div>"+
            "</article>";
}
function addEventCart(){
    document.getElementById("order").addEventListener("click", getFormulaire);
    for(i=0;i<localStorage.length;i++){
        document.getElementsByClassName("itemQuantity")[i].addEventListener("change", onchangeProductCart);
        document.getElementsByClassName("deleteItem")[i].addEventListener("click", deleteProductCart);
    }
}
function onchangeProductCart(){
    //Recuperation de l'item du stockage
    //animationonchangeproductCart();
    let i=0;
    for(i=0;i<localStorage.length;i++){
        let product = JSON.parse(localStorage.getItem(i));
        //Modification de la valeur quantité avec celle du selecteur
        if(product.quantity!=document.getElementsByClassName("itemQuantity")[i].value){
            //Ajout avec modification
            product.quantity=document.getElementsByClassName("itemQuantity")[i].value;
            localStorage.setItem(i,JSON.stringify(product));
            //Animation et Modifie le paragraphe associe
            animationonchangeproductCart(i);
        }
    }
    
    refreshPanier();
}
function animationonchangeproductCart(i){
    //Ajout du logo de chargement
    document.getElementsByClassName("cart__item__content__settings__quantity")[i].firstChild.innerHTML="<i class=\"fa-solid fa-spinner\"></i>";
    //Ajout de l'animation
    document.getElementsByClassName("cart__item__content__settings__quantity")[i].firstChild.firstChild.classList.toggle("animationchangequantity");
    //Blocage de l'input
    document.getElementsByClassName("itemQuantity")[i].disabled="disabled";
    window.setTimeout(function (){
        document.getElementsByClassName("cart__item__content__settings__quantity")[i].firstChild.innerHTML="Qté : "+document.getElementsByClassName("itemQuantity")[i].value;
        document.getElementsByClassName("itemQuantity")[i].disabled="";
    },1500);
}
function deleteProductCart(){
    //Dernier element du tableau Y+1 pour le 0
    //Y = position de l'élement supprimer
    let y=0;
    let productHtml={
        dataId:this.parentNode.parentNode.parentNode.parentNode.attributes["data-id"].value,
        dataColor:this.parentNode.parentNode.parentNode.parentNode.attributes["data-color"].value
    }

    console.log(productHtml.dataId);
    
    for(i=0;i<localStorage.length;i++){
        let product = JSON.parse(localStorage.getItem(i));
        if(product.id==productHtml.dataId && product.color==productHtml.dataColor){
            y=i;
            console.log(y);
        }
    }
    if(localStorage.length==y+1){
        console.log("Problème dernière ligne:"+y+" / Supression")
        localStorage.removeItem(y);
    }
    else{
        let product;
        let message;
        console.log("Probleme ligne: "+y);
        for (i=y;i<localStorage.length;i++){
            
            if(localStorage.getItem(i+1)!=null ){
                message=i+1;
                console.log("Modification de la ligne: "+i+" avec la ligne: "+message);
                product = JSON.parse(localStorage.getItem(i+1));
                localStorage.setItem(i,JSON.stringify(product));
            }
            else{
                localStorage.removeItem(i);
                console.log("Suppression ligne "+i);
                i=localStorage.length+1;
            }
        }
    }
    animationSupression(y);
    refreshPanier();
}

function animationSupression(y){
    document.getElementsByClassName("cart__item")[y].classList.toggle("animationcachesupression");
    
    window.setTimeout( function(){
        document.getElementsByClassName("cart__item")[y].remove();
        //Supression du block
    } , 1500);
}
async function refreshPanier(){
    //Modification prix total panier et nombre d'article
    let allPrice=0;
    let allQuantity=0;
    
    for (i=0;i<localStorage.length;i++){
        product=JSON.parse(localStorage.getItem(i));
        await getProductById(product.id).then((result) => {
            allPrice+=result.price*product.quantity; 
            allQuantity+=parseInt(product.quantity,10);
        });
    }
    document.getElementById("totalQuantity").innerHTML=allQuantity;
    document.getElementById("totalPrice").innerHTML=allPrice;  
}
function getFormulaire(e){
    e.preventDefault();
    let product;
    let arrayCart=new Array;
    let arrayFormulaire=new Object;
    arrayFormulaire.firstName=document.getElementById("firstName").value;
    arrayFormulaire.lastName=document.getElementById("lastName").value;
    arrayFormulaire.address=document.getElementById("address").value;
    arrayFormulaire.city=document.getElementById("city").value;
    arrayFormulaire.email=document.getElementById("email").value;
    for(i=0;i<localStorage.length;i++){
        product=JSON.parse(localStorage.getItem(i));
        arrayCart.push(product.id);
    }
    sendCart(arrayFormulaire,arrayCart).then((result)=>{
        localStorage.clear();
        window.location="http://127.0.0.1:5500/front/html/confirmation.html?id="+result.orderId;
    });
}
async function sendCart(objectFormulaire,arrayCart){
    const orderData = {
        contact: objectFormulaire,
        products: arrayCart
    }
    return await fetch("http://localhost:3000/api/products/order",{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(orderData)
      })
      .then(function(res) { 
        if (res.ok) {
          return res.json();
        }
      })
      .then(function(result) {
        return result;
      })
      .catch(function(err) {
        // Une erreur est survenue
      });
}