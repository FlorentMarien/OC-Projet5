//Index
function getElements(){
    fetch("http://localhost:3000/api/products")
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
function getProductById(id){
    return fetch("http://localhost:3000/api/products/"+id)
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
    console.log(result);
    let id=result._id;
    let color=document.getElementById("colors").value;
    let quantity=document.getElementById("quantity").value;
    let product={'id':id,'color':color,'quantity':quantity};
    let verif=0;
    let pos=0;
    //test for localstorage 
    let test;
    for (var i = 0; i < localStorage.length; i++) {
        test=localStorage.getItem(i);
        
        test=JSON.parse(test);
        if((test.id==id) && (test.color==color)){
            verif++;
            pos=i;
            i=localStorage.length+1;
        }
    }
    if(verif==0){
        localStorage.setItem(localStorage.length,JSON.stringify(product));
    }   
    else{
        console.log("test:"+localStorage.getItem(pos)+" / Pos:"+pos);
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
function getCart(){
    let product;
    
    for (i=0 ; i<localStorage.length ;i++){
        product=JSON.parse(localStorage.getItem(i));
        getProductById(product.id).then((apiproduct) => {
        document.getElementById("cart__items").innerHTML=
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
        });
    }
}