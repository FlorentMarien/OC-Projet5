//Index
async function getElements(){
    await fetch("http://localhost:3000/api/products")
      .then(function(res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function(result) {
        
        for (const value of result) {
          document.getElementById("items").innerHTML+=
          "<a href=\"./product.html?id="+value._id+"\">"+
            "<article>"+
              "<img src=\""+value.imageUrl+"\" alt=\""+value.altTxt+"\">"+
              "<h3 class=\"productName\">"+value.name+"</h3>"+
              "<p class=\"productDescription\">"+value.description+"</p>"+
            "</article>"+
          "</a>";
        }
      })
      .catch(function(err) {
        // Une erreur est survenue
      });
}
//
// Product
function getIdProductPage(){
    let id = window.location.search;
    let tampon2="";
    tampon2=id.slice(4);
    return tampon2;
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
}
function addToCart(){
/*
var voiture = { modele : Clio, marque Renault };
localStorage.setItem('maVoiture', JSON.stringify(voiture));
*/
// ID COULEUR QUANTITE
getProductById(getIdProductPage()).then((result) => {
    let id=result._id;
    let color=document.getElementById("colors").value;
    let quantity=document.getElementById("quantity").value;
    let product={'id':id,'color':color,'quantity':quantity};
    let verif=0;
    let pos=0;
    //test for localstorage 
    let test;
    for (var i = 0; i < localStorage.length; i++) {
        test=JSON.parse(localStorage.getItem(i));
        if((test.id==id) && (test.color==color)){
            console.log("Element déjà ajouté, ajout de la quantité");
            verif++;
            pos=i;
            i=localStorage.length+1;
        }
        
    }
    if(verif==0){
        localStorage.setItem(localStorage.length,JSON.stringify(product));
        console.log("L'article n'a pas été trouvé dans la panier, ajout");
    }   
    else{
        product=localStorage.getItem(pos);
        product=JSON.parse(product);
        let x=parseInt(product.quantity,10);
        let tampon= parseInt(quantity,10) + x;
        product.quantity=tampon;
        localStorage.setItem(pos,JSON.stringify(product));
    }   
});
}
function clickaddToCart(){
    document.getElementById("addToCart").addEventListener("click",addToCart);
}
//
// Cart
async function getCart(){
    let product;
    // addProductCart(product.id,product,i);
    for (i=0 ; i<localStorage.length ;i++){
        product=JSON.parse(localStorage.getItem(i));
        await getProductById(product.id).then((apiproduct) => {
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
                      "<input type=\"number\" class=\"itemQuantity\" name=\"itemQuantity\" min=\"1\" max=\"100\" onchange=\"onchangeProductCart("+i+")\" value=\""+product.quantity+"\">"+
                    "</div>"+
                    "<div class=\"cart__item__content__settings__delete\">"+
                      "<p class=\"deleteItem\" onclick=\"deleteProductCart("+i+")\">Supprimer</p>"+
                    "</div>"+
                "</div>"+
                "</div>"+
            "</article>";
        });
    }
    refreshPanier();
    
}
function onchangeProductCart(i){
    //Recuperation de l'item du stockage
    let product = JSON.parse(localStorage.getItem(i));
    //Modification de la valeur quantité avec celle du selecteur
    product.quantity=document.getElementsByClassName("itemQuantity")[i].value;
    //Ajout avec modification
    localStorage.setItem(i,JSON.stringify(product));
    //Modifie le paragraphe associé
    document.getElementsByClassName("cart__item__content__settings__quantity")[i].firstChild.innerHTML="Qté : "+document.getElementsByClassName("itemQuantity")[i].value;
    refreshPanier();
}
function deleteProductCart(y){
    //Dernier element du tableau Y+1 pour le 0
    
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
    document.getElementsByClassName("cart__item ")[y].remove();
    refreshPanier();
}
async function refreshPanier(){
    //Modification de la valeur Onchange et Onclick
    for (i=0;i<localStorage.length;i++){
        console.log("Refresh ligne:"+i);
        document.getElementsByClassName("cart__item__content__settings__quantity")[i].lastChild.attributes["onchange"].value="onchangeProductCart("+i+")";
        document.getElementsByClassName("deleteItem")[i].attributes["onclick"].value="deleteProductCart("+i+")";
    }

    //Modification prix total panier et nombre d'article
    let allPrice=0;
    let allQuantity=0;
    
    for (i=0;i<localStorage.length;i++){
        product=JSON.parse(localStorage.getItem(i));
        console.log("MAJ prix: "+i+" Recherche product id:"+product.id);
        //refreshPriceQuantity(product,allPrice,allQuantity);
        await getProductById(product.id).then((result) => {
            allPrice+=result.price*product.quantity;
            console.log("Prix:"+allPrice);        
            allQuantity+=parseInt(product.quantity,10);
            console.log("Quantity: "+allQuantity);
        });
    }
    document.getElementById("totalQuantity").innerHTML=allQuantity;
    document.getElementById("totalPrice").innerHTML=allPrice;  
}