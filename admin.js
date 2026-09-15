import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.loginAdmin = async function () {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    alert("This email is not authorized.");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Login successful!");
  location.reload();
};

window.addProduct = async function () {
  const name = document.querySelector("#productName").value;
  const price = document.querySelector("#productPrice").value;
  const image = document.querySelector("#productImage").value;
  const description = document.querySelector("#productDescription").value;

  const { error } = await supabase.from("products").insert([{
    name,
    price: Number(price),
    image,
    description
  }]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Product added successfully!");
  location.reload();
};

async function loadOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const orders = document.querySelector("#orders");
  if (!orders) return;

  orders.innerHTML = data.map(order => `
    <div class="order">
      <h3>${order.customer_name}</h3>
      <p>Phone: ${order.phone}</p>
      <p>Address: ${order.address}</p>
      <p>Total: Rs. ${order.total}</p>
      <p>Status: ${order.status}</p>
    </div>
  `).join("");
}

loadOrders();
