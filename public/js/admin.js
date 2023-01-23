const btn = document.querySelector(".delete");
const deleteMsg = document.querySelector(".delete-msg");
const csrf = document.querySelector(".token").value;
const productId = document.querySelector(".id").value;

const deleteProduct = () => {
  fetch(`/admin/delete-product/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((resutl) => {
      return resutl.json();
    })
    .then((data) => {
      console.log(data);
      deleteMsg.innerHTML = data.message;
      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 2000);
    })
    .catch((err) => console.log(err));
};
