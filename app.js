import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let cart = JSON.parse(localStorage.getItem("bimuCart") || "[]");

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
      <button onclick='addToCart(${JSON.stringify(product)})'>Add to Bag</button>
    </div>
  `).join("");
}

window.addToCart = function(product) {
  cart.push(product);
  localStorage.setItem("bimuCart", JSON.stringify(cart));
  alert("Added to bag 🛍️");
};

window.placeOrder = async function(customerName, phone, address) {
  if (!cart.length) {
    alert("Your bag is empty.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const { error } = await supabase.from("orders").insert([{
    customer_name: customerName,
    phone: phone,
    address: address,
    items: cart,
    total: total,
    status: "new"
  }]);

  if (error) {
    console.error(error);
    alert("Order could not be placed.");
    return;
  }

  cart = [];
  localStorage.removeItem("bimuCart");
  alert("Order placed successfully ❤️");
};

loadProducts();
