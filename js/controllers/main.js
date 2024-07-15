import { servicesProducts } from "../services/product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");


function createCard (name, price, image, id) {
    const card = document.createElement("div");
    card.classList.add("card")

    card.innerHTML = ` 
                    <div class="img-container">
                       <img src="${image}" alt="${name}">
                    </div>

                    <div class="card-container--info">
                        <p>${name} </p>
                      <div class="card-container--value">
                        <p>${price}</p>
                        <button class="delete-button" data-id="${id}">
                            <i class="fas fa-trash-alt"></i>     
                        </button>
                      </div>
                    </div>
`;

const deleteButton = card.querySelector(".delete-button");
deleteButton.addEventListener("click", () => handleDelete(id));


productContainer.appendChild(card);
return card;
}


const handleDelete = (id) => {
  servicesProducts.deleteProduct(id)
      .then(() => {
          const card = productContainer.querySelector(`[data-id="${id}"]`).closest(".card");
          card.remove();
          console.log("Producto eliminado");
      })
      .catch((err) => console.log(err));
};



productContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
      const id = event.target.dataset.id;
      servicesProducts.deleteProduct(id)
          .then(() => {
              event.target.closest(".card").remove();
              console.log("Producto eliminado");
          })
          .catch((err) => console.log(err));
  }
});

const render = async () => {
    try {
        const listProducts = await servicesProducts.productList();
 

        if (listProducts.length === 0) {
          // Mostrar mensaje de que no hay productos
          productContainer.innerHTML = "<p>No hay productos disponibles.</p>";
      } else {
        
        listProducts.forEach(product => {
          productContainer.appendChild(createCard(
            product.name,
            product.price,
            product.image,
            product.id
          )
        )
        }) };
      } catch (error) {
        console.log(error);
    }
};

form.addEventListener("submit", (event) => {
     event.preventDefault();

     const name = document.querySelector("[data-name]").value;
     const price = document.querySelector("[data-price]").value;
     const image = document.querySelector("[data-image]").value;

     servicesProducts.createProducts(name, price, image)
     .then((res) => console.log(res))
     .catch((err) => console.log(err));

});

render();
