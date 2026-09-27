
const CART_KEY = "cart";

(function ensureCartAssets() {
    if (!document.querySelector('link[href="css/cart-modal.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "css/cart-modal.css";
        document.head.appendChild(link);
    }

    if (!document.getElementById("cart-panel")) {
        const panel = document.createElement("div");
        panel.id = "cart-panel";
        panel.className = "cart-panel";
        document.body.appendChild(panel);
    }
})();

function getCart() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
    const product = allProducts.find(function (p) {
        return p.id === Number(id);
    });
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(function (item) {
        return item.id === product.id;
    });

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            qty: 1
        });
    }

    saveCart(cart);
    renderCartBadge();
    renderCartPanel();
}

function updateQty(id, delta) {
    const cart = getCart();
    const item = cart.find(function (i) {
        return i.id === Number(id);
    });
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart(cart);
    renderCartBadge();
    renderCartPanel();
}

function removeFromCart(id) {
    const cart = getCart().filter(function (i) {
        return i.id !== Number(id);
    });
    saveCart(cart);
    renderCartBadge();
    renderCartPanel();
}

function getCartCount() {
    return getCart().reduce(function (total, item) {
        return total + item.qty;
    }, 0);
}

function getCartTotal() {
    return getCart().reduce(function (total, item) {
        return total + item.price * item.qty;
    }, 0);
}

function renderCartBadge() {
    const cartSummary = document.getElementById("cart-summary");
    if (!cartSummary) return;

    cartSummary.innerHTML =
        '<button id="btnCartToggle" class="cart-toggle" type="button">' +
        '🛒 <span class="cart-badge">' + getCartCount() + '</span>' +
        '<span class="cart-total">$' + getCartTotal().toFixed(2) + '</span>' +
        '</button>';

    document.getElementById("btnCartToggle").addEventListener("click", toggleCartPanel);
}

function toggleCartPanel() {
    const panel = document.getElementById("cart-panel");
    if (!panel) return;
    panel.classList.toggle("cart-panel--open");
}

function closeCartPanel() {
    const panel = document.getElementById("cart-panel");
    if (panel) panel.classList.remove("cart-panel--open");
}

function renderCartPanel() {
    const panel = document.getElementById("cart-panel");
    if (!panel) return;

    const cart = getCart();

    if (cart.length === 0) {
        panel.innerHTML = '<p class="cart-panel__empty">Keranjang masih kosong.</p>';
        return;
    }

    let html = '<div class="cart-panel__list">';

    cart.forEach(function (item) {
        html +=
            '<div class="cart-item" data-id="' + item.id + '">' +
            '<img class="cart-item__thumb" src="' + item.thumbnail + '" alt="' + item.title + '">' +
            '<div class="cart-item__info">' +
            '<p class="cart-item__title">' + item.title + '</p>' +
            '<p class="cart-item__price">$' + item.price + ' x ' + item.qty + '</p>' +
            '<div class="cart-item__qty">' +
            '<button class="btn-qty" data-action="dec" data-id="' + item.id + '" type="button">-</button>' +
            '<span class="cart-item__qty-value">' + item.qty + '</span>' +
            '<button class="btn-qty" data-action="inc" data-id="' + item.id + '" type="button">+</button>' +
            '</div>' +
            '</div>' +
            '<button class="btn-remove-cart" data-id="' + item.id + '" type="button">✕</button>' +
            '</div>';
    });

    html +=
        '</div>' +
        '<div class="cart-panel__footer">' +
        '<span>Total</span>' +
        '<strong>$' + getCartTotal().toFixed(2) + '</strong>' +
        '</div>';

    panel.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
    const panel = document.getElementById("cart-panel");
    if (!panel) return;

    panel.addEventListener("click", function (event) {
        const btnQty = event.target.closest(".btn-qty");
        if (btnQty) {
            updateQty(btnQty.dataset.id, btnQty.dataset.action === "inc" ? 1 : -1);
            return;
        }

        const btnRemove = event.target.closest(".btn-remove-cart");
        if (btnRemove) {
            removeFromCart(btnRemove.dataset.id);
        }
    });

    document.addEventListener("click", function (event) {
        const cartSummary = document.getElementById("cart-summary");
        if (!panel.contains(event.target) && !cartSummary.contains(event.target)) {
            closeCartPanel();
        }
    });
});

renderCartBadge();
renderCartPanel();