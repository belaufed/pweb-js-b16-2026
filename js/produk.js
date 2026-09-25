// ================================
// DATA PRODUK
// ================================

// Menyimpan semua data produk dari API
let semuaProduk = [];

// Produk yang sedang ditampilkan
let produkTampil = [];

// Jumlah produk yang muncul
let jumlahTampil = 10;

// AMBIL DATA PRODUK DARI API

async function ambilProduk() {

    try {

        const response = await fetch(
            "https://dummyjson.com/products?limit=0"
        );


        const data = await response.json();


        // simpan semua produk
        semuaProduk = data.products;


        // awalnya tampilkan semua produk
        produkTampil = semuaProduk;


        tampilkanProduk(produkTampil);


        buatKategori();


    } catch (error) {

        console.log(
            "Gagal mengambil produk",
            error
        );

    }

}

// MENAMPILKAN PRODUK

function tampilkanProduk(dataProduk) {


    const tempatProduk =
    document.getElementById(
        "product-grid"
    );


    tempatProduk.innerHTML = "";


    dataProduk
    .slice(0, jumlahTampil)
    .forEach((produk)=>{


        const kartu =
        document.createElement(
            "article"
        );


        kartu.className =
        "product-card";


        kartu.dataset.id =
        produk.id;



        kartu.innerHTML = `

            <img 
            src="${produk.thumbnail}"
            >


            <h3>
            ${produk.title}
            </h3>


            <p>
            Harga: $${produk.price}
            </p>


            <p>
            ⭐ ${produk.rating}
            </p>


            <p>
            Diskon:
            ${produk.discountPercentage}%
            </p>


            <p>
            Kategori:
            ${produk.category}
            </p>


            <button
            class="btn-add-cart"
            data-id="${produk.id}">
                Tambah Keranjang
            </button>

        `;


        tempatProduk.appendChild(kartu);


    });

}

// MEMBUAT FILTER KATEGORI

function buatKategori(){


    const dropdown =
    document.getElementById(
        "pilihKategori"
    );


    const kategori = [
        ...new Set(
            semuaProduk.map(
                (produk)=>
                produk.category
            )
        )
    ];



    kategori.forEach((item)=>{


        const option =
        document.createElement(
            "option"
        );


        option.value = item;


        option.textContent = item;


        dropdown.appendChild(option);


    });


}
// SORTING PRODUK

function urutkanProduk(
    dataProduk,
    tipeUrutan
){


    if(tipeUrutan === "hargaMurah"){


        return dataProduk.sort(
            (a,b)=>
            a.price - b.price
        );


    }



    if(tipeUrutan === "hargaMahal"){


        return dataProduk.sort(
            (a,b)=>
            b.price - a.price
        );


    }



    if(tipeUrutan === "rating"){


        return dataProduk.sort(
            (a,b)=>
            b.rating - a.rating
        );


    }



    return dataProduk;


}

// SEARCH PRODUK
function cariProduk(
    dataProduk,
    keyword
){


    return dataProduk.filter(
        (produk)=>{


            return produk.title
            .toLowerCase()
            .includes(
                keyword.toLowerCase()
            );


        }
    );


}

// DEBOUNCE SEARCH

function debounce(
    fungsi,
    waktu
){


    let timer;


    return function(){


        clearTimeout(timer);



        timer =
        setTimeout(()=>{


            fungsi();


        }, waktu);



    };


}

// JALANKAN PROGRAM

ambilProduk();

// EVENT FILTER KATEGORI

document
.getElementById("pilihKategori")
.addEventListener(
"change",
function(){


    const kategoriDipilih =
    this.value;



    if(kategoriDipilih === "semua"){


        produkTampil =
        semuaProduk;



    } else {


        produkTampil =
        semuaProduk.filter(
            (produk)=>
            produk.category === kategoriDipilih
        );


    }



    tampilkanProduk(
        produkTampil
    );


});

// EVENT SORTING

document
.getElementById("pilihUrutan")
.addEventListener(
"change",
function(){


    const urutan =
    this.value;



    produkTampil =
    urutkanProduk(
        produkTampil,
        urutan
    );



    tampilkanProduk(
        produkTampil
    );


});

// EVENT SEARCH

document
.getElementById("cariProduk")
.addEventListener(
"input",
debounce(
function(){


    const keyword =
    document
    .getElementById(
        "cariProduk"
    )
    .value;



    produkTampil =
    cariProduk(
        semuaProduk,
        keyword
    );



    tampilkanProduk(
        produkTampil
    );


},
500)

);

//load more produk
function loadMoreProduk(){


    jumlahTampil += 10;


    tampilkanProduk(
        produkTampil
    );


}

//EVENT LOAD MORE

document
.getElementById("tombolLoadMore")
.addEventListener(
"click",
function(){

    loadMoreProduk();

});
