(function ensureModalContainer() {
    if (!document.getElementById("product-modal")) {
        const modalDiv = document.createElement("div");
        modalDiv.id = "product-modal";
        modalDiv.className = "modal-overlay";
        document.body.appendChild(modalDiv);
    }
})();

function openProductModal(id) {
    const product = allProducts.find(function (p) {
        return p.id === Number(id);
    });
    if (!product) return;

    const modal = document.getElementById("product-modal");
    if (!modal) return;

    modal.innerHTML =
        '<div class="modal-box">' +
        '<button class="modal-close" id="btnCloseModal" type="button">✕</button>' +
        '<img class="modal-thumb" src="' + product.thumbnail + '" alt="' + product.title + '">' +
        '<span class="modal-category">' + product.category + '</span>' +
        '<h2 class="modal-title">' + product.title + '</h2>' +
        '<p class="modal-brand">Brand: ' + (product.brand || '-') + '</p>' +
        '<div class="modal-price-row">' +
        '<span class="modal-price">$' + product.price + '</span>' +
        '<span class="modal-rating">⭐ ' + product.rating + '</span>' +
        '</div>' +
        '<p class="modal-stock">Stok tersedia: ' + product.stock + '</p>' +
        '<p class="modal-desc">' + product.description + '</p>' +
        '<button class="btn-add-cart" id="btnModalAddCart" data-id="' + product.id + '" type="button">' +
        'Tambah ke Keranjang' +
        '</button>' +
        '</div>';

    modal.classList.add("modal-overlay--open");

    document.getElementById("btnCloseModal").addEventListener("click", closeProductModal);
    document.getElementById("btnModalAddCart").addEventListener("click", function () {
        addToCart(product.id);
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeProductModal();
        }
    });
}

function closeProductModal() {
    const modal = document.getElementById("product-modal");
    if (!modal) return;
    modal.classList.remove("modal-overlay--open");
    modal.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    productGrid.addEventListener("click", function (event) {
        const btnAddCart = event.target.closest(".btn-add-cart");
        if (btnAddCart) {
            // jangan ikut membuka modal saat tombol keranjang yang diklik
            event.stopPropagation();
            addToCart(btnAddCart.dataset.id);
            return;
        }

        const card = event.target.closest(".product-card");
        if (card) {
            openProductModal(card.dataset.id);
        }
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeProductModal();
    }
});