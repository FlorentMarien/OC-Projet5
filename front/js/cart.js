initPanier();
async function initPanier(){
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
    addEventListenerPanier();
    refreshPanier();
}
function writeArticleCart(apiproduct,product){
    /*
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
    */
    //Article
    let article=document.createElement("article");
    article.className="cart__item";
    article.setAttribute("data-id",product.id);
    article.setAttribute("data-color",product.color);
        //Div cart__item__img
        let article_div1=document.createElement("div");
        article_div1.className="cart__item__img";
        let article_div1_img=document.createElement("img");
        article_div1_img.src=apiproduct.imageUrl;
        article_div1_img.altTxt=apiproduct.altTxt;
        article_div1.appendChild(article_div1_img);

        //Div cart__item__content
        let article_div2=document.createElement("div");
        article_div2.className="cart__item__content";
            let article_div2_div1=document.createElement("div");
            article_div2_div1.className="cart__item__content__description";
                let article_div2_div1_h2=document.createElement("h2");
                article_div2_div1_h2.textContent=apiproduct.name;
                let article_div2_div1_p1=document.createElement("p");
                article_div2_div1_p1.textContent=product.color;
                let article_div2_div1_p2=document.createElement("p");
                article_div2_div1_p2.textContent=apiproduct.price+" €";
            article_div2_div1.appendChild(article_div2_div1_h2);
            article_div2_div1.appendChild(article_div2_div1_p1);
            article_div2_div1.appendChild(article_div2_div1_p2);

            //Div cart__item__content__settings
            let article_div2_div2=document.createElement("div");
            article_div2_div2.className="cart__item__content__settings";
                let article_div2_div2_div1 = document.createElement("div");
                article_div2_div2_div1.className="cart__item__content__settings__quantity";
                    let article_div2_div2_div1_p = document.createElement("p");
                    article_div2_div2_div1_p.textContent="Qté : "+product.quantity;
                    
                    let article_div2_div2_div1_input = document.createElement("input");
                    article_div2_div2_div1_input.type="number";
                    article_div2_div2_div1_input.className="itemQuantity";
                    article_div2_div2_div1_input.name="itemQuantity";
                    article_div2_div2_div1_input.min="1";
                    article_div2_div2_div1_input.max="100";
                    article_div2_div2_div1_input.value=product.quantity;
                    
                article_div2_div2_div1.appendChild(article_div2_div2_div1_p);
                article_div2_div2_div1.appendChild(article_div2_div2_div1_input);
                
                let article_div2_div2_div2 = document.createElement("div");
                article_div2_div2_div2.className="cart__item__content__settings__delete";
                    let article_div2_div2_div2_p = document.createElement("p");
                    article_div2_div2_div2_p.className="deleteItem";
                    article_div2_div2_div2_p.textContent="Supprimer";
                article_div2_div2_div2.appendChild(article_div2_div2_div2_p);
            article_div2_div2.appendChild(article_div2_div2_div1);
            article_div2_div2.appendChild(article_div2_div2_div2);
            
        article_div2.appendChild(article_div2_div1);
        article_div2.appendChild(article_div2_div2);
          
    article.appendChild(article_div1);
    article.appendChild(article_div2);
    
    document.getElementById("cart__items").appendChild(article);
}
function addEventListenerPanier(){
    //Ajout event bouton commander, supprimer, selecteur quantité
    document.getElementById("order").addEventListener("click", getFormulaire);

    document.getElementById("firstName").addEventListener("input", messageformulaire);
    document.getElementById("lastName").addEventListener("input", messageformulaire);
    document.getElementById("address").addEventListener("input", messageformulaire);
    document.getElementById("city").addEventListener("input", messageformulaire);
    document.getElementById("email").addEventListener("input", messageformulaire);
    
    for(i=0;i<localStorage.length;i++){
        document.getElementsByClassName("itemQuantity")[i].addEventListener("change", selectorProductCart);
        document.getElementsByClassName("deleteItem")[i].addEventListener("click", deleteProductCart);
    }
}
function selectorProductCart(){
    //Recuperation de l'item du stockage
    let i=0;
    let productHtml=getDataIdDataColor(this);
    for(i=0;i<localStorage.length;i++){
        let product = JSON.parse(localStorage.getItem(i));
        if(productHtml.dataId==product.id && productHtml.dataColor==product.color){
        //Modification de la valeur quantité avec celle du selecteur
            if(product.quantity!=document.getElementsByClassName("itemQuantity")[i].value){
                //Ajout avec modification
                if(document.getElementsByClassName("itemQuantity")[i].value==0){
                    alertOnchangeProductCart(0);
                    document.getElementsByClassName("itemQuantity")[i].value=product.quantity;
                }
                else{
                    if(document.getElementsByClassName("itemQuantity")[i].value>100){
                        alertOnchangeProductCart(1);
                        document.getElementsByClassName("itemQuantity")[i].value=product.quantity;
                    }
                    else{
                        product.quantity=document.getElementsByClassName("itemQuantity")[i].value;
                        localStorage.setItem(i,JSON.stringify(product));
                        //Animation et Modifie le paragraphe associe
                        animationonchangeproductCart(i);
                        refreshPanier();
                    }
                }
            }
        }
    }
    
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
        let productHtml=getDataIdDataColor(this);
        for(i=0;i<localStorage.length;i++){
            let product = JSON.parse(localStorage.getItem(i));
            if(product.id==productHtml.dataId && product.color==productHtml.dataColor){
                y=i;
            }
        }
        refreshStoragePanier(y);
    }
}
function getDataIdDataColor(elt){
    //Return data id - data color / For onchange and delete
    let productHtml={
        dataId:elt.closest("article").attributes["data-id"].value,
        dataColor:elt.closest("article").attributes["data-color"].value
    }
    return productHtml;
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
        document.getElementById("totalQuantity").textContent=allQuantity;
        document.getElementById("totalPrice").textContent=allPrice;
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
    //Verif formulaire retourne 1 si correct, verif si des articles sont present
    if(verifformulaire(arrayFormulaire)==1 && localStorage.length>0){
        for(i=0;i<localStorage.length;i++){
            product=JSON.parse(localStorage.getItem(i));
            arrayCart.push(product.id);
        }
        sendCart(arrayFormulaire,arrayCart).then((result)=>{
            localStorage.clear();
            window.location="http://127.0.0.1:5500/front/html/confirmation.html?order-id="+result.orderId;
        });
    }
}
function verifformulaire(arrayFormulaire){
    let verif=1;
    if(arrayFormulaire.firstName=="" || arrayFormulaire.lastName=="" || arrayFormulaire.city=="" || arrayFormulaire.address=="" || arrayFormulaire.email==""){
        //MsgError
        verif++;
    }
    else if(/[^a-zA-ZÀ-ÿ -"']/.test(arrayFormulaire.firstName)==0 && /[^a-zA-ZÀ-ÿ -"']/.test(arrayFormulaire.lastName)==0 && /[^A-Za-zÀ-ÿ -"']/.test(arrayFormulaire.city)==0 && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(arrayFormulaire.email)==1){
        
    }
    else{
        verif++;
    }
    return verif;
}
function messageformulaire(){
    //Name de l'input
    let inputName = this.attributes["name"].value;
    const input=document.getElementsByName(inputName)[0];
    switch (inputName){
        case "firstName":
            if(input.value==""){
                document.getElementById(inputName+"ErrorMsg").textContent="Vous n'avez rien saisi";
            }
            else if(/[^a-zA-ZÀ-ÿ -"']/.test(input.value)==0){
                document.getElementById(inputName+"ErrorMsg").textContent="";
            }
            else{
                document.getElementById(inputName+"ErrorMsg").textContent="Vous avez saisi des caractères invalide";
            }
            break;
        case "lastName":
            if(input.value==""){
                document.getElementById(inputName+"ErrorMsg").textContent="Vous n'avez rien saisi";
            }
            else if(/[^a-zA-ZÀ-ÿ -"']/.test(input.value)==0){
                document.getElementById(inputName+"ErrorMsg").textContent="";
            }
            else{
                document.getElementById(inputName+"ErrorMsg").textContent="Vous avez saisi des caractères invalide";
            }
            break;
        case "address":
            if(input.value==""){
                document.getElementById(inputName+"ErrorMsg").textContent="Vous n'avez rien saisi";
            }
            else{
                document.getElementById(inputName+"ErrorMsg").textContent="";
            }
            break;
        case "city":
            if(input.value==""){
                document.getElementById(inputName+"ErrorMsg").textContent="Vous n'avez rien saisi";
            }
            else{
                document.getElementById(inputName+"ErrorMsg").textContent="";
            }
            break;
        case "email":
            if(input.value==""){
                document.getElementById(inputName+"ErrorMsg").textContent="Vous n'avez rien saisi";
            }
            else if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input.value)==1){
                document.getElementById(inputName+"ErrorMsg").textContent="";
            }
            else{
                document.getElementById(inputName+"ErrorMsg").textContent="Le format de l'adresse email est incorrect";
            }
            break;
    }
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