// ================================================
// ORANG 2 — Data Produk, Search, Filter, Sort, Load More
// Kontrak tim:
//   - Data global: allProducts
//   - Grid produk: #product-grid
//   - Kartu produk: <article class="product-card" data-id="{id}">
//   - Tombol keranjang: <button class="btn-add-cart" data-id="{id}">
// Alur data: allProducts -> filter -> search -> sort -> slice -> render
// ================================================

// Data mentah dari API
let allProducts = [];

// State kontrol tampilan
let currentCategory = "all";
let currentKeyword = "";
let currentSort = "default";
let itemsToShow = 10;

const ITEMS_PER_PAGE = 10;

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("cariProduk");
const categorySelect = document.getElementById("pilihKategori");
const sortSelect = document.getElementById("pilihUrutan");
const loadMoreBtn = document.getElementById("tombolLoadMore");
const resetFilterBtn = document.getElementById("tombolResetFilter");

// ------------------------------------------------
// FETCH PRODUK
// ------------------------------------------------
async function fetchProducts() {
    try {
        productGrid.innerHTML = "<p class=\"grid-status\">Memuat produk...</p>";

        const response = await fetch("https://dummyjson.com/products?limit=0");
        const data = await response.json();

        allProducts = data.products;

        populateCategoryOptions();
        render();

    } catch (error) {
        console.log("Gagal mengambil produk", error);
        productGrid.innerHTML =
            "<p class=\"grid-status grid-status--error\">Gagal memuat produk. Coba refresh halaman.</p>";
    }
}

// ------------------------------------------------
// PIPELINE: filter -> search -> sort
// ------------------------------------------------
function getVisibleProducts() {
    let result = allProducts;

    // 1. filter kategori
    if (currentCategory !== "all") {
        result = result.filter(function (produk) {
            return produk.category === currentCategory;
        });
    }

    // 2. search keyword
    if (currentKeyword !== "") {
        const keyword = currentKeyword.toLowerCase();
        result = result.filter(function (produk) {
            return produk.title.toLowerCase().includes(keyword);
        });
    }

    // 3. sort (pakai slice supaya tidak mengubah urutan asli allProducts)
    result = result.slice();

    if (currentSort === "hargaMurah") {
        result.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (currentSort === "hargaMahal") {
        result.sort(function (a, b) {
            return b.price - a.price;
        });
    } else if (currentSort === "rating") {
        result.sort(function (a, b) {
            return b.rating - a.rating;
        });
    }

    return result;
}

// ------------------------------------------------
// RENDER KARTU PRODUK
// ------------------------------------------------
function render() {
    const visible = getVisibleProducts();
    const toRender = visible.slice(0, itemsToShow);

    productGrid.innerHTML = "";

    if (toRender.length === 0) {
        productGrid.innerHTML = "<p class=\"grid-status\">Tidak ada produk yang cocok.</p>";
        loadMoreBtn.style.display = "none";
        return;
    }

    toRender.forEach(function (product) {
        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.id = product.id;

        card.innerHTML = `
            <img class="product-card__thumb" src="${product.thumbnail}" alt="${product.title}">
            <div class="product-card__body">
                <h3 class="product-card__title">${product.title}</h3>
                <p class="product-card__price">
                    $${product.price}
                    ${product.discountPercentage > 0
                        ? `<span class="product-card__discount">-${product.discountPercentage}%</span>`
                        : ""}
                </p>
                <p class="product-card__rating">⭐ ${product.rating}</p>
                <p class="product-card__category">${product.category}</p>
                <button class="btn-add-cart" data-id="${product.id}">
                    Tambah Keranjang
                </button>
            </div>
        `;

        productGrid.appendChild(card);
    });

    // Sembunyikan tombol Load More kalau semua produk sudah tampil
    loadMoreBtn.style.display = itemsToShow >= visible.length ? "none" : "inline-block";
}

// ------------------------------------------------
// ISI DROPDOWN KATEGORI DARI DATA (bukan hardcode, tanpa Set)
// ------------------------------------------------
function populateCategoryOptions() {
    const categories = [];

    for (let i = 0; i < allProducts.length; i++) {
        const kategori = allProducts[i].category;

        if (!categories.includes(kategori)) {
            categories.push(kategori);
        }
    }

    categories.sort();

    categories.forEach(function (category) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// ------------------------------------------------
// DEBOUNCE (closure) UNTUK SEARCH REAL-TIME
// ------------------------------------------------
function debounce(fungsi, waktu) {
    let timer;

    return function () {
        clearTimeout(timer);

        timer = setTimeout(function () {
            fungsi();
        }, waktu);
    };
}

// ------------------------------------------------
// EVENT LISTENERS
// ------------------------------------------------
searchInput.addEventListener(
    "input",
    debounce(function () {
        currentKeyword = searchInput.value;
        itemsToShow = ITEMS_PER_PAGE; // reset pagination tiap kali search berubah
        render();
    }, 500)
);

categorySelect.addEventListener("change", function () {
    const kategoriDipilih = categorySelect.value;
    currentCategory = kategoriDipilih === "semua" ? "all" : kategoriDipilih;
    itemsToShow = ITEMS_PER_PAGE;
    render();
});

sortSelect.addEventListener("change", function () {
    currentSort = sortSelect.value;
    render();
});

loadMoreBtn.addEventListener("click", function () {
    itemsToShow += ITEMS_PER_PAGE;
    render();
});

// Bonus (nilai plus Orang 2): tombol reset filter
if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", function () {
        currentCategory = "all";
        currentKeyword = "";
        currentSort = "default";
        itemsToShow = ITEMS_PER_PAGE;

        searchInput.value = "";
        categorySelect.value = "semua";
        sortSelect.value = "default";

        render();
    });
}

// ------------------------------------------------
// JALANKAN
// ------------------------------------------------
fetchProducts();
