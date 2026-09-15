import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const container = document.querySelector("#products");
  if (!container) return;

  container.innerHTML = data.map(product => `
    <div class="product-card">
      <img src="${product.image || "logo.png"}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Rs. ${product.price}</p>
      <button onclick='addToCart(${JSON.stringify(product)})'>
        Add to Bag
      </button>
    </div>
  `).join("");
}

let cart = JSON.parse(localStorage.getItem("bimuCart") || "[]");

window.addToCart = function(product) {
  cart.push(product);
  localStorage.setItem("bimuCart", JSON.stringify(cart));
  alert("Added to bag 🛍️");
};

loadProducts();
