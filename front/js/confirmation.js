const params = (new URL(document.location)).searchParams;
const orderId = params.get("order-id");
document.getElementById("orderId").textContent=orderId;