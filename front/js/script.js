//Pas d'id pour tout recuperer
getProductById("").then((result)=>{
  for (const value of result) {
    /*
      document.getElementById("items").innerHTML+=
      "<a href=\"./product.html?id="+value._id+"\">"+
        "<article>"+
          "<img src=\""+value.imageUrl+"\" alt=\""+value.altTxt+"\">"+
          "<h3 class=\"productName\">"+value.name+"</h3>"+
          "<p class=\"productDescription\">"+value.description+"</p>"+
        "</article>"+
      "</a>";
    */
    let img=document.createElement("img");
    img.src=value.imageUrl;
    img.alt=value.altTxt;
    let h3=document.createElement("h3");
    h3.className="productName";
    h3.textContent=value.name;
    let p = document.createElement("p");
    p.className="productDescription";
    p.textContent=value.description;
    let article=document.createElement("article");
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
    let a = document.createElement("a");
    a.href="./product.html?id="+value._id;
    a.appendChild(article);
    document.getElementById("items").appendChild(a);
  }
});