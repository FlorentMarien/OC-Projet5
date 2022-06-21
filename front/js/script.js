//Pas d'id pour tout recuperer
getProductById("").then((result)=>{
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
});