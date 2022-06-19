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

getElements();