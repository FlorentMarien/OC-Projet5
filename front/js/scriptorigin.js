// Product
function getIdProductPage(){
    const id = window.location.search;
    // slice retire 4 premiers caractère
    // URL?id=415b7cacb65d43b2b5c1ff70f3393ad1
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
    // Ajout du produit, page product
    getProductById(getIdProductPage()).then((result) => {                     
        //Ajout de l'image
        let img = document.createElement("img");
        img.src= result.imageUrl;
        img.alt= result.altTxt;
        document.getElementsByClassName("item__img")[0].appendChild(img);
        //Titre
        document
        .getElementById("title")
        .textContent=result.name;
        //Prix
        document
        .getElementById("price")
        .textContent=result.price;
        //Description
        document
        .getElementById("description")
        .textContent=result.description;
        //Reset color
        document
        .getElementById("colors")
        .innerHTML="";
        //Ajout select color
        for (const iterator of result.colors) {
            let color = document.createElement("option");
            color.value=iterator;
            color.textContent=iterator;
            document.getElementById("colors").appendChild(color);
        }
    });
    clickaddProduct();
}
function animationaddToCart(msg,i){
    // i=0 Message Bleu // i=1 Message Rouge
    if(i==0) document.getElementById("animation__container__notification").style.backgroundColor="#2c3e50";
    else if(i==1) document.getElementById("animation__container__notification").style.backgroundColor="darkred";
    
    document.getElementById("animation__container__notification").firstChild.innerHTML=msg;
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
let productClient={
    'id':getIdProductPage(),
    'color':document.getElementById("colors").value,
    'quantity':document.getElementById("quantity").value
};
let productStorage;
let verif=0;
    //Verification de la quantité saisie par l'utilisateur
    if(productClient.quantity==0) animationaddToCart("La quantité saisie est invalide",1);
    if(productClient.quantity>100) animationaddToCart("La quantité saisie est supérieur à 100",1);
    if(productClient.quantity>0 && productClient.quantity<=100){
        // Test pour voir si l'élément est déjà enregistré   
        for(i=0;i<localStorage.length;i++){
            productStorage=localStorage.getItem(i);
            productStorage=JSON.parse(productStorage);
            if(productClient.id==productStorage.id && productClient.color==productStorage.color){
                //Si quantity saisie par l'utilisateur + quantity déjà enregistré > 100
                if((parseInt(productStorage.quantity)+parseInt(productClient.quantity))>100){
                    productClient.quantity=100;
                    localStorage.setItem(i,JSON.stringify(productClient));
                    i=localStorage.length+1;
                    animationaddToCart("Article limité à 100 exemplaires",1);
                }
                //Sinon ajoute normalement
                else{
                    productClient.quantity=parseInt(productStorage.quantity)+parseInt(productClient.quantity);
                    localStorage.setItem(i,JSON.stringify(productClient));
                    i=localStorage.length+1;
                    animationaddToCart("Ajout de la quantité",0);
                }
                verif++;
            }
        }
        //Si verif == 0 = non detecter dans le stockage
        if(verif==0){
            localStorage.setItem(localStorage.length,JSON.stringify(productClient));
            animationaddToCart("Votre article a bien été ajouté",0);
        }
    }
}
function clickaddProduct(){
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
    let i=0;
    for(i=0;i<localStorage.length;i++){
        let product = JSON.parse(localStorage.getItem(i));
        //Modification de la valeur quantité avec celle du selecteur
        if(product.quantity!=document.getElementsByClassName("itemQuantity")[i].value){
            //Ajout avec modification
            if(document.getElementsByClassName("itemQuantity")[i].value==0){
                alertOnchangeProductCart(0);
            }
            else{
                if(document.getElementsByClassName("itemQuantity")[i].value>100){
                    alertOnchangeProductCart(1);
                }
                else product.quantity=document.getElementsByClassName("itemQuantity")[i].value;
                
                localStorage.setItem(i,JSON.stringify(product));
                //Animation et Modifie le paragraphe associe
                animationonchangeproductCart(i);
            }
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
function confirmDeleteProductCart() {
    //Alert pour confirmer suppresion de l'article page panier
    let text = "Souhaitez vous vraiment supprimer l'article ?";
    if (confirm(text) == true){
      return true;
    } 
    else{
      return false;
    }
}
function alertOnchangeProductCart(i) {
    //Alert // 0= =0 // 1= >100
    const text = ["La quantité saisie est incorrect","La quantité saisie doit être inférieur à 100"];
    alert(text[i]);

}
function deleteProductCart(){
    //Dernier element du tableau Y+1 pour le 0
    //Y = position de l'élement supprimer
    if(confirmDeleteProductCart()==true){
        let y=0;
        let productHtml={
            dataId:this.closest("article").attributes["data-id"].value,
            dataColor:this.closest("article").attributes["data-color"].value
        }
        for(i=0;i<localStorage.length;i++){
            let product = JSON.parse(localStorage.getItem(i));
            if(product.id==productHtml.dataId && product.color==productHtml.dataColor){
                y=i;
                console.log(y);
            }
        }
        refreshStoragePanier(y);
    }
}
function refreshStoragePanier(y){
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
    if(/[^a-zA-ZÀ-ÿ -"']/.test(arrayFormulaire.firstName) || arrayFormulaire.firstName==""){
        document.getElementById("firstNameErrorMsg").innerHTML="Problème avec la saisie de votre Nom";
        verif++;
    }
    else{
        document.getElementById("firstNameErrorMsg").innerHTML="";   
    }
    if(/[^a-zA-ZÀ-ÿ -"']/.test(arrayFormulaire.lastName) || arrayFormulaire.lastName==""){
        document.getElementById("lastNameErrorMsg").innerHTML="Problème avec la saisie de votre Prenom";
        verif++;
    }
    else{
        document.getElementById("lastNameErrorMsg").innerHTML="";
    }
    if(arrayFormulaire.address==""){
        document.getElementById("addressErrorMsg").innerHTML="Problème avec la saisie de votre adresse";
        verif++;
    }
    else{
        document.getElementById("addressErrorMsg").innerHTML="";
    }
    if(/[^A-Za-zÀ-ÿ -"']/.test(arrayFormulaire.city)|| arrayFormulaire.city==""){
        document.getElementById("cityErrorMsg").innerHTML="Problème avec la saisie de votre ville";
        verif++;
    }
    else{
        document.getElementById("cityErrorMsg").innerHTML="";
    }
    if(!/[@]/.test(arrayFormulaire.email) || arrayFormulaire.email==""){
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