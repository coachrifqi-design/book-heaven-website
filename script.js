// ==========================================
// CONFIGURATION & GLOBAL DATA CONTAINERS
// ==========================================

// Menggunakan dua objek terpisah untuk memenuhi kriteria struktur data tingkat lanjut (Advanced)
// Objek 1: Mengelola pesan validasi kustom untuk formulir kontak
const validationRules = {
    nameMinLength: 2,
    phoneRegex: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    errorMessages: {
        nameTooShort: "Nama lengkap harus memiliki minimal 2 karakter.",
        invalidPhone: "Harap gunakan format nomor telepon yang diminta: 123-456-7890."
    }
};

// Objek 2: Status aplikasi untuk melacak data wishlist buku yang sedang aktif
const appState = {
    wishlistKey: "bookHavenWishlistData",
    activeBooks: [] // Array ini akan menampung kumpulan data objek buku
};

// ==========================================
// INITIALIZATION ROUTINE (RUNS ON LOAD)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Jalankan inisialisasi fitur wishlist jika berada di halaman catalog (products.html)
    const wishlistContainer = document.getElementById("wishlist-items");
    if (wishlistContainer) {
        setupWishlistFeature();
    }

    // Jalankan inisialisasi validasi form jika berada di halaman registrasi (contact.html)
    const registrationForm = document.querySelector("form");
    if (registrationForm) {
        setupFormValidation(registrationForm);
    }
});

// ==========================================
// FEATURE 1 & 3: WISHLIST TRACKER & STORAGE
// ==========================================

function setupWishlistFeature() {
    // Proteksi tantangan teknis: Cek apakah ada data tersimpan sebelum mendefinisikan ulang array kosong
    const savedData = localStorage.getItem(appState.wishlistKey);
    if (savedData) {
        try {
            appState.activeBooks = JSON.parse(savedData);
        } catch (e) {
            appState.activeBooks = [];
        }
    } else {
        appState.activeBooks = [];
    }

    // Render ulang tampilan antarmuka (UI) berdasarkan data memori browser yang berhasil dimuat
    updateWishlistUI();

    // Pasang event listener pada setiap tombol tambah buku yang ada di halaman catalog
    const addButtons = document.querySelectorAll(".btn-add-wishlist");
    addButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const buttonClicked = event.target;
            
            // Mengambil metadata properti dari elemen induk kartu buku
            const title = buttonClicked.getAttribute("data-title");
            const price = buttonClicked.getAttribute("data-price");

            // Membuat cetakan objek buku baru
            const bookItem = {
                id: Date.now().toString(),
                title: title,
                price: price
            };

            // Tambahkan objek baru ke dalam array penampung
            appState.activeBooks.push(bookItem);

            // Simpan perubahan state secara persisten ke dalam localStorage browser
            localStorage.setItem(appState.wishlistKey, JSON.stringify(appState.activeBooks));

            // Perbarui visual komponen halaman secara dinamis
            updateWishlistUI();
        });
    });
}

function updateWishlistUI() {
    const wishlistContainer = document.getElementById("wishlist-items");
    if (!wishlistContainer) return;

    // Bersihkan kontainer sebelum menulis ulang list elemen terbaru
    wishlistContainer.innerHTML = "";

    if (appState.activeBooks.length === 0) {
        wishlistContainer.innerHTML = "<p class='empty-msg'>Belum ada buku di wishlist kamu.</p>";
        return;
    }

    // Bangun daftar list belanjaan buku menggunakan perulangan array secara dinamis
    const ul = document.createElement("ul");
    ul.className = "wishlist-list-group";

    appState.activeBooks.forEach(book => {
        const li = document.createElement("li");
        li.className = "wishlist-item-row";
        li.innerHTML = `<strong>${book.title}</strong> - ${book.price}`;
        ul.appendChild(li);
    });

    wishlistContainer.appendChild(ul);
}

// ==========================================
// FEATURE 2: CLIENT-SIDE FORM VALIDATION
// ==========================================

function setupFormValidation(formElement) {
    formElement.addEventListener("submit", (event) => {
        // Ambil referensi elemen input teks secara langsung
        const nameInput = document.getElementById("full-name");
        const phoneInput = document.getElementById("phone");

        // Hapus sisa-sisa pesan error bawaan sebelumnya agar tidak menumpuk di layar
        clearCustomErrors();

        let isFormValid = true;

        // Cek Validasi 1: Memastikan panjang nama memenuhi aturan minimum
        if (nameInput.value.trim().length < validationRules.nameMinLength) {
            isFormValid = false;
            displayFieldError(nameInput, validationRules.errorMessages.nameTooShort);
        }

        // Cek Validasi 2: Mencocokkan nilai input telepon dengan standarisasi Regex Pattern
        if (!validationRules.phoneRegex.test(phoneInput.value.trim())) {
            isFormValid = false;
            displayFieldError(phoneInput, validationRules.errorMessages.invalidPhone);
        }

        // Jika ditemukan ketidaksesuaian input, gagalkan proses submit bawaan browser
        if (!isFormValid) {
            event.preventDefault();
        }
    });
}

function displayFieldError(inputElement, errorMessage) {
    // Membuat container teks error baru tepat di bawah field yang bermasalah
    const errorSpan = document.createElement("span");
    errorSpan.className = "field-error-msg";
    errorSpan.style.color = "#d9534f";
    errorSpan.style.fontSize = "0.85rem";
    errorSpan.style.display = "block";
    errorSpan.style.marginTop = "4px";
    errorSpan.innerText = errorMessage;

    // Masukkan elemen teks error ke dalam hirarki DOM struktur formulir
    inputElement.parentNode.appendChild(errorSpan);
    inputElement.style.borderColor = "#d9534f";
}

function clearCustomErrors() {
    const errorMessages = document.querySelectorAll(".field-error-msg");
    errorMessages.forEach(msg => msg.remove());

    const activeInputs = document.querySelectorAll("input");
    activeInputs.forEach(input => input.style.borderColor = "");
}
