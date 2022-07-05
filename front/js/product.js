const params = (new URL(document.location)).searchParams;
const productId = params.get("id");

// Ajout du produit, page product
getProductById(productId).then((result) => {                     
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
    document.getElementById("addToCart").addEventListener("click",addToCart);
});

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
        'id':productId,
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
                break;
            }
        }
        //Si verif == 0 = non detecter dans le stockage
        if(verif==0){
            localStorage.setItem(localStorage.length,JSON.stringify(productClient));
            animationaddToCart("Votre article a bien été ajouté",0);
        }
    }
}