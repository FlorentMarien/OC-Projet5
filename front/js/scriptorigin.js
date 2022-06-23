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
        productQuantity();
    });
    clickaddProduct();
}
function productQuantity(){
    let product;
    let verif=0;
        for(i=0;i<localStorage.length;i++){
            product=JSON.parse(localStorage.getItem(i));
            if(product.id==getIdProductPage() && product.color==document.getElementById("colors").value){
                document.getElementById("quantity").value=product.quantity;
                verif++;
                i=localStorage.length+1;
            }
        }
        if(verif==0){
            document.getElementById("quantity").value=0;
        }
}
function animationaddToCart(i){
    // 0 Article non ajouté // 1 Article déjà enregistré // 2 Limite de 100 // 3 Valeur 0 Ajouté
    if(i==2) document.getElementById("quantity").value=100;
    if(i==3) document.getElementById("quantity").value=1;
    let arrayMessage=["Votre article a bien été ajouté","Modification de la quantité","Article limité à 100 exemplaires","Vous n'avez pas modifié le nombre d'article"]
    document.getElementById("animation__container__notification").firstChild.innerHTML=arrayMessage[i];
    document.getElementById("animation__container__notification").classList.toggle("animation");
    document.getElementById("addToCart").disabled="true";
    document.getElementById("addToCart").style.opacity="0.7";
    window.setTimeout( function(){
        document.getElementById("animation__container__notification").classList.remove("animation");
        document.getElementById("addToCart").disabled="";
        document.getElementById("addToCart").style.opacity="1";
    } , 3000);
}
function addToCart(){

//animationaddToCart();
let id=getIdProductPage();
let color=document.getElementById("colors").value;
let quantity=document.getElementById("quantity").value;
let productClient={'id':id,'color':color,'quantity':quantity};
let productStorage;
let verif=0;
    if(quantity==0) animationaddToCart(3);
    if(quantity>100) animationaddToCart(2);
    if(quantity>0 && quantity<=100){      
        for(i=0;i<localStorage.length;i++){
            productStorage=localStorage.getItem(i);
            productStorage=JSON.parse(productStorage);
            if(productClient.id==productStorage.id && productClient.color==productStorage.color){
                localStorage.setItem(i,JSON.stringify(productClient));
                i=localStorage.length+1;
                verif++;
                animationaddToCart(1)
            }
        }
        if(verif==0){
            localStorage.setItem(localStorage.length,JSON.stringify(productClient));
            animationaddToCart(0);
        }
    }
}
function clickaddProduct(){
    document.getElementById("addToCart").addEventListener("click",addToCart);
    document.getElementById("colors").addEventListener("change",productQuantity);
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
    let i=0;
    for(i=0;i<localStorage.length;i++){
        let product = JSON.parse(localStorage.getItem(i));
        //Modification de la valeur quantité avec celle du selecteur
        if(product.quantity!=document.getElementsByClassName("itemQuantity")[i].value){
            //Ajout avec modification
            if(document.getElementsByClassName("itemQuantity")[i].value>100){
                product.quantity=100;
                localStorage.setItem(i,JSON.stringify(product));
                console.log("Limite d'ajout dépassé");
            }
            else{
                product.quantity=document.getElementsByClassName("itemQuantity")[i].value;
                localStorage.setItem(i,JSON.stringify(product));
            }
            
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
        let product = JSON.parse(localStorage.getItem(i));
        document.getElementsByClassName("itemQuantity")[i].value=product.quantity;
        document.getElementsByClassName("cart__item__content__settings__quantity")[i].firstChild.innerHTML="Qté : "+product.quantity;
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
    animationPrixQuantityPanier(allQuantity,allPrice);
}
function animationPrixQuantityPanier(allQuantity,allPrice){
    //Ajout Logo 
    document.getElementById("totalQuantity").innerHTML="<i class=\"fa-solid fa-spinner\"></i>";
    document.getElementById("totalPrice").innerHTML="<i class=\"fa-solid fa-spinner\"></i>";
    //Ajout de l'animation
    document.getElementById("totalQuantity").firstChild.classList.toggle("animationchangequantity");
    document.getElementById("totalPrice").firstChild.classList.toggle("animationchangequantity");
    
    window.setTimeout(function (){
        document.getElementById("totalQuantity").innerHTML=allQuantity;
        document.getElementById("totalPrice").innerHTML=allPrice;
    },1500);
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
    if(verifformulaire(arrayFormulaire)==1){
        for(i=0;i<localStorage.length;i++){
            product=JSON.parse(localStorage.getItem(i));
            arrayCart.push(product.id);
        }
        sendCart(arrayFormulaire,arrayCart).then((result)=>{
            localStorage.clear();
            window.location="http://127.0.0.1:5500/front/html/confirmation.html?id="+result.orderId;
        });
    }
}
function verifformulaire(arrayFormulaire){
    let verif=1;
    if(/[^A-Za-z]/.test(arrayFormulaire.firstName)){
        document.getElementById("firstNameErrorMsg").innerHTML="Problème avec la saisie de votre Nom";
        verif++;
    }
    else{
        document.getElementById("firstNameErrorMsg").innerHTML="";   
    }
    if(/[^A-Za-z]/.test(arrayFormulaire.lastName)){
        document.getElementById("lastNameErrorMsg").innerHTML="Problème avec la saisie de votre Prenom";
        verif++;
    }
    else{
        document.getElementById("lastNameErrorMsg").innerHTML="";
    }
    /*if(/[^A-Za-z]/.test(arrayFormulaire.address)){
        
    }*/
    if(/[^A-Za-z]/.test(arrayFormulaire.city)){
        document.getElementById("cityErrorMsg").innerHTML="Problème avec la saisie de votre ville";
        verif++;
    }
    else{
        document.getElementById("cityErrorMsg").innerHTML="";
    }
    if(!/[@]/.test(arrayFormulaire.email)){
        document.getElementById("emailErrorMsg").innerHTML="Problème avec la saisie de votre adresse mail";
        verif++;
    }
    else{
        document.getElementById("emailErrorMsg").innerHTML="";
    }
    return verif;
    
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