/* =========================================================
   BOOKSHOP MANAGEMENT SYSTEM
   HTML + CSS + JavaScript + LocalStorage
========================================================= */


/* =========================================================
   APP START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

    setupNotifications();

    setupAdmin();

});


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {

    books: "bookshop_books",

    sales: "bookshop_sales",

    customers: "bookshop_customers",

    settings: "bookshop_settings",

    admin: "bookshop_admin",

    adminPassword: "bookshop_admin_password",

    adminShop: "bookshop_admin_shop"

};


/* =========================================================
   APP STATE
========================================================= */

let books =
    loadData(STORAGE_KEYS.books, []);

let sales =
    loadData(STORAGE_KEYS.sales, []);

let customers =
    loadData(STORAGE_KEYS.customers, []);

let settings =
    loadData(STORAGE_KEYS.settings, {

        name: "",

        phone: "",

        address: ""

    });


/* =========================================================
   INITIALIZE APP
========================================================= */

function initializeApp() {

    setupNavigation();

    setupMobileMenu();

    setupModals();

    setupBookEvents();

    setupSaleEvents();

    setupCustomerEvents();

    setupSettingsEvents();

    renderAll();

    loadSettings();


    const currentPage =
        window.location.hash.replace("#", "");


    if (
        currentPage &&
        document.getElementById(currentPage)
    ) {

        showPage(currentPage);

    } else {

        showPage("dashboard");

    }

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadData(key, defaultValue) {

    try {

        const data =
            localStorage.getItem(key);


        if (!data) {

            return defaultValue;

        }


        return JSON.parse(data);

    } catch (error) {

        console.error(
            `Error loading ${key}:`,
            error
        );

        return defaultValue;

    }

}


function saveData(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            `Error saving ${key}:`,
            error
        );

        showToast(
            "Could not save data."
        );

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();


            const page =
                link.dataset.page;


            if (page) {

                showPage(page);

            }

        });

    });


    const viewAllButton =
        document.querySelector(".text-btn");


    if (viewAllButton) {

        viewAllButton.addEventListener(
            "click",
            () => {

                showPage("sales");

            }
        );

    }

}


function showPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    const navLinks =
        document.querySelectorAll(".nav-link");


    pages.forEach(page => {

        page.classList.remove("active");

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(pageName);


    if (!selectedPage) {

        return;

    }


    selectedPage.classList.add("active");


    const selectedLink =
        document.querySelector(
            `.nav-link[data-page="${pageName}"]`
        );


    if (selectedLink) {

        selectedLink.classList.add("active");

    }


    const pageTitles = {

        dashboard: {

            title: "Dashboard",

            subtitle:
                "Overview of your book shop"

        },

        books: {

            title: "Books",

            subtitle:
                "Manage your book inventory."

        },

        sales: {

            title: "Sales",

            subtitle:
                "Manage your shop transactions."

        },

        customers: {

            title: "Customers",

            subtitle:
                "Manage your customers."

        },

        reports: {

            title: "Reports",

            subtitle:
                "View your shop performance."

        },

        settings: {

            title: "Settings",

            subtitle:
                "Manage your shop information."

        }

    };


    const pageInfo =
        pageTitles[pageName];


    if (pageInfo) {

        const pageTitle =
            document.getElementById("pageTitle");

        const pageSubtitle =
            document.getElementById("pageSubtitle");


        if (pageTitle) {

            pageTitle.textContent =
                pageInfo.title;

        }


        if (pageSubtitle) {

            pageSubtitle.textContent =
                pageInfo.subtitle;

        }

    }


    window.location.hash =
        pageName;


    const sidebar =
        document.querySelector(".sidebar");


    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const mobileMenu =
        document.getElementById("mobileMenu");

    const sidebar =
        document.querySelector(".sidebar");


    if (!mobileMenu || !sidebar) {

        return;

    }


    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }
    );

}


/* =========================================================
   MODALS
========================================================= */

function setupModals() {

    const closeButtons =
        document.querySelectorAll(
            ".close-modal"
        );


    closeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modalId =
                    button.dataset.modal;


                if (modalId) {

                    closeModal(modalId);

                }

            }
        );

    });


    const modalOverlays =
        document.querySelectorAll(
            ".modal-overlay"
        );


    modalOverlays.forEach(overlay => {

        overlay.addEventListener(
            "click",
            () => {

                const modal =
                    overlay.closest(".modal");


                if (modal) {

                    closeModal(modal.id);

                }

            }
        );

    });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                document
                    .querySelectorAll(
                        ".modal.active"
                    )
                    .forEach(modal => {

                        closeModal(modal.id);

                    });

            }

        }
    );

}


function openModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (!modal) {

        return;

    }


    modal.classList.add("active");

}


function closeModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (!modal) {

        return;

    }


    modal.classList.remove("active");

}


/* =========================================================
   BOOK EVENTS
========================================================= */

function setupBookEvents() {

    const addBookBtn =
        document.getElementById("addBookBtn");

    const bookForm =
        document.getElementById("bookForm");

    const bookSearch =
        document.getElementById("bookSearch");

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (addBookBtn) {

        addBookBtn.addEventListener(
            "click",
            () => {

                resetBookForm();


                const title =
                    document.getElementById(
                        "bookModalTitle"
                    );


                if (title) {

                    title.textContent =
                        "Add Book";

                }


                openModal("bookModal");

            }
        );

    }


    if (bookForm) {

        bookForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                saveBook();

            }
        );

    }


    if (bookSearch) {

        bookSearch.addEventListener(
            "input",
            () => {

                renderBooks();

            }
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            () => {

                renderBooks();

            }
        );

    }

}


/* =========================================================
   RESET BOOK FORM
========================================================= */

function resetBookForm() {

    const form =
        document.getElementById("bookForm");


    if (form) {

        form.reset();

    }


    const id =
        document.getElementById("bookId");


    if (id) {

        id.value = "";

    }

}


/* =========================================================
   SAVE BOOK
========================================================= */

function saveBook() {

    const id =
        document.getElementById("bookId").value;


    const title =
        document.getElementById("bookTitle")
            .value
            .trim();


    const author =
        document.getElementById("bookAuthor")
            .value
            .trim();


    const category =
        document.getElementById("bookCategory")
            .value
            .trim();


    const price =
        Number(
            document.getElementById("bookPrice")
                .value
        );


    const stock =
        Number(
            document.getElementById("bookStock")
                .value
        );


    if (
        !title ||
        !author ||
        !category
    ) {

        showToast(
            "Please fill all required fields."
        );

        return;

    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        showToast(
            "Please enter a valid price."
        );

        return;

    }


    if (
        !Number.isInteger(stock) ||
        stock < 0
    ) {

        showToast(
            "Please enter a valid stock quantity."
        );

        return;

    }


    /* DUPLICATE PROTECTION */

    const duplicate =
        books.find(book => {

            const sameTitle =
                String(book.title)
                    .toLowerCase()
                    ===
                title.toLowerCase();


            const sameAuthor =
                String(book.author)
                    .toLowerCase()
                    ===
                author.toLowerCase();


            const differentBook =
                String(book.id)
                    !==
                String(id);


            return (
                sameTitle &&
                sameAuthor &&
                differentBook
            );

        });


    if (duplicate) {

        showToast(
            "This book with the same author already exists."
        );

        return;

    }


    /* EDIT */

    if (id) {

        const index =
            books.findIndex(
                book =>
                    String(book.id)
                    ===
                    String(id)
            );


        if (index === -1) {

            showToast(
                "Book not found."
            );

            return;

        }


        books[index] = {

            ...books[index],

            title,

            author,

            category,

            price,

            stock

        };


        showToast(
            "Book updated successfully."
        );

    }


    /* ADD */

    else {

        books.push({

            id:
                Date.now().toString(),

            title,

            author,

            category,

            price,

            stock,

            createdAt:
                new Date().toISOString()

        });


        showToast(
            "Book added successfully."
        );

    }


    saveData(
        STORAGE_KEYS.books,
        books
    );


    renderAll();


    closeModal("bookModal");

}


/* =========================================================
   EDIT BOOK
========================================================= */

function editBook(id) {

    const book =
        books.find(
            item =>
                String(item.id)
                ===
                String(id)
        );


    if (!book) {

        showToast(
            "Book not found."
        );

        return;

    }


    document.getElementById(
        "bookId"
    ).value =
        book.id;


    document.getElementById(
        "bookTitle"
    ).value =
        book.title;


    document.getElementById(
        "bookAuthor"
    ).value =
        book.author;


    document.getElementById(
        "bookCategory"
    ).value =
        book.category;


    document.getElementById(
        "bookPrice"
    ).value =
        book.price;


    document.getElementById(
        "bookStock"
    ).value =
        book.stock;


    document.getElementById(
        "bookModalTitle"
    ).textContent =
        "Edit Book";


    openModal("bookModal");

}


/* =========================================================
   DELETE BOOK
========================================================= */

function deleteBook(id) {

    const book =
        books.find(
            item =>
                String(item.id)
                ===
                String(id)
        );


    if (!book) {

        return;

    }


    const hasSales =
        sales.some(
            sale =>
                String(sale.bookId)
                ===
                String(id)
        );


    if (hasSales) {

        showToast(
            "This book has sales history and cannot be deleted."
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete "${book.title}"?`
        );


    if (!confirmed) {

        return;

    }


    books =
        books.filter(
            item =>
                String(item.id)
                !==
                String(id)
        );


    saveData(
        STORAGE_KEYS.books,
        books
    );


    renderAll();


    showToast(
        "Book deleted successfully."
    );

}


/* =========================================================
   RENDER BOOKS
========================================================= */

function renderBooks() {

    const table =
        document.getElementById(
            "booksTable"
        );


    if (!table) {

        return;

    }


    updateCategoryFilter();


    const searchInput =
        document.getElementById(
            "bookSearch"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    let filteredBooks =
        [...books];


    if (searchTerm) {

        filteredBooks =
            filteredBooks.filter(
                book =>

                    String(book.title || "")
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    String(book.author || "")
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    String(book.category || "")
                        .toLowerCase()
                        .includes(searchTerm)
            );

    }


    if (
        selectedCategory !==
        "all"
    ) {

        filteredBooks =
            filteredBooks.filter(
                book =>
                    book.category
                    ===
                    selectedCategory
            );

    }


    if (
        filteredBooks.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >
                    No books found
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        filteredBooks.map(book => {

            let status = "";

            let statusClass = "";


            if (
                Number(book.stock)
                ===
                0
            ) {

                status =
                    "Out of Stock";

                statusClass =
                    "badge-danger";

            }

            else if (
                Number(book.stock)
                <=
                5
            ) {

                status =
                    "Low Stock";

                statusClass =
                    "badge-warning";

            }

            else {

                status =
                    "In Stock";

                statusClass =
                    "badge-success";

            }


            return `

                <tr>

                    <td>

                        <strong>
                            ${escapeHTML(
                                book.title
                            )}
                        </strong>

                    </td>


                    <td>
                        ${escapeHTML(
                            book.author
                        )}
                    </td>


                    <td>

                        <span
                            class="badge badge-info"
                        >
                            ${escapeHTML(
                                book.category
                            )}
                        </span>

                    </td>


                    <td>
                        Rs.
                        ${formatNumber(
                            book.price
                        )}
                    </td>


                    <td>
                        ${Number(
                            book.stock || 0
                        )}
                    </td>


                    <td>

                        <span
                            class="badge ${statusClass}"
                        >
                            ${status}
                        </span>

                    </td>


                    <td>

                        <div class="actions">

                            <button
                                class="icon-btn edit"
                                title="Edit"
                                onclick="editBook('${book.id}')"
                            >
                                <i
                                    class="fa-solid fa-pen"
                                ></i>
                            </button>


                            <button
                                class="icon-btn delete"
                                title="Delete"
                                onclick="deleteBook('${book.id}')"
                            >
                                <i
                                    class="fa-solid fa-trash"
                                ></i>
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function updateCategoryFilter() {

    const filter =
        document.getElementById(
            "categoryFilter"
        );


    if (!filter) {

        return;

    }


    const currentValue =
        filter.value;


    const categories = [

        ...new Set(

            books
                .map(
                    book =>
                        book.category
                )
                .filter(
                    category =>
                        category
                )

        )

    ].sort();


    filter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            filter.appendChild(
                option
            );

        }
    );


    if (
        currentValue === "all"
        ||
        categories.includes(
            currentValue
        )
    ) {

        filter.value =
            currentValue;

    }

    else {

        filter.value =
            "all";

    }

}


/* =========================================================
   SALES EVENTS
========================================================= */

function setupSaleEvents() {

    const newSaleBtn =
        document.getElementById(
            "newSaleBtn"
        );


    const saleForm =
        document.getElementById(
            "saleForm"
        );


    const saleBook =
        document.getElementById(
            "saleBook"
        );


    const saleQuantity =
        document.getElementById(
            "saleQuantity"
        );


    if (newSaleBtn) {

        newSaleBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openNewSaleModal();

            }
        );

    }


    if (saleBook) {

        saleBook.addEventListener(
            "change",
            calculateSaleTotal
        );

    }


    if (saleQuantity) {

        saleQuantity.addEventListener(
            "input",
            calculateSaleTotal
        );

    }


    if (saleForm) {

        saleForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                completeSale();

            }
        );

    }

}


/* =========================================================
   OPEN NEW SALE
========================================================= */

function openNewSaleModal() {

    if (books.length === 0) {

        showToast(
            "Please add a book before making a sale."
        );

        return;

    }


    const availableBooks =
        books.filter(
            book =>
                Number(book.stock)
                >
                0
        );


    if (
        availableBooks.length === 0
    ) {

        showToast(
            "No books are currently in stock."
        );

        return;

    }


    const saleForm =
        document.getElementById(
            "saleForm"
        );


    if (saleForm) {

        saleForm.reset();

    }


    document.getElementById(
        "saleQuantity"
    ).value =
        1;


    populateSaleBooks();

    populateSaleCustomers();

    calculateSaleTotal();

    openModal("saleModal");

}


/* =========================================================
   POPULATE SALE BOOKS
========================================================= */

function populateSaleBooks() {

    const select =
        document.getElementById(
            "saleBook"
        );


    if (!select) {

        return;

    }


    const availableBooks =
        books.filter(
            book =>
                Number(book.stock)
                >
                0
        );


    select.innerHTML = `

        <option value="">
            Select a book
        </option>

    `;


    availableBooks.forEach(
        book => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                book.id;


            option.textContent =
                `${book.title} — Rs. ${formatNumber(book.price)} — Stock: ${book.stock}`;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   POPULATE CUSTOMERS
========================================================= */

function populateSaleCustomers() {

    const select =
        document.getElementById(
            "saleCustomer"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Walk-in Customer
        </option>

    `;


    customers.forEach(
        customer => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                customer.id;


            option.textContent =
                customer.name;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   CALCULATE SALE TOTAL
========================================================= */

function calculateSaleTotal() {

    const bookSelect =
        document.getElementById(
            "saleBook"
        );


    const quantityInput =
        document.getElementById(
            "saleQuantity"
        );


    const totalElement =
        document.getElementById(
            "saleTotal"
        );


    if (
        !bookSelect ||
        !quantityInput ||
        !totalElement
    ) {

        return;

    }


    const bookId =
        bookSelect.value;


    const quantity =
        Number(
            quantityInput.value
        )
        ||
        0;


    const book =
        books.find(
            item =>
                String(item.id)
                ===
                String(bookId)
        );


    if (
        !book ||
        quantity <= 0
    ) {

        totalElement.textContent =
            "Rs. 0";

        return;

    }


    const total =
        Number(book.price)
        *
        quantity;


    totalElement.textContent =
        `Rs. ${formatNumber(total)}`;

}


/* =========================================================
   COMPLETE SALE
========================================================= */

function completeSale() {

    const bookId =
        document.getElementById(
            "saleBook"
        ).value;


    const customerId =
        document.getElementById(
            "saleCustomer"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "saleQuantity"
            ).value
        );


    if (!bookId) {

        showToast(
            "Please select a book."
        );

        return;

    }


    if (
        !Number.isInteger(quantity)
        ||
        quantity < 1
    ) {

        showToast(
            "Please enter a valid quantity."
        );

        return;

    }


    const book =
        books.find(
            item =>
                String(item.id)
                ===
                String(bookId)
        );


    if (!book) {

        showToast(
            "Selected book was not found."
        );

        return;

    }


    if (
        Number(book.stock)
        <
        quantity
    ) {

        showToast(
            `Only ${book.stock} copies are available.`
        );

        return;

    }


    let customer =
        null;


    if (customerId) {

        customer =
            customers.find(
                item =>
                    String(item.id)
                    ===
                    String(customerId)
            );


        if (!customer) {

            showToast(
                "Selected customer was not found."
            );

            return;

        }

    }


    const total =
        Number(book.price)
        *
        quantity;


    /* REDUCE STOCK */

    book.stock =
        Number(book.stock)
        -
        quantity;


    /* CREATE SALE */

    const newSale = {

        id:
            Date.now().toString(),

        bookId:
            book.id,

        bookTitle:
            book.title,

        customerId:
            customer
                ? customer.id
                : "",

        customerName:
            customer
                ? customer.name
                : "Walk-in Customer",

        quantity,

        price:
            Number(book.price),

        total,

        date:
            new Date().toISOString()

    };


    sales.unshift(
        newSale
    );


    /* UPDATE CUSTOMER */

    if (customer) {

        customer.totalPurchases =
            Number(
                customer.totalPurchases
                ||
                0
            )
            +
            total;

    }


    /* SAVE */

    saveData(
        STORAGE_KEYS.books,
        books
    );


    saveData(
        STORAGE_KEYS.sales,
        sales
    );


    saveData(
        STORAGE_KEYS.customers,
        customers
    );


    renderAll();


    closeModal(
        "saleModal"
    );


    showToast(
        "Sale completed successfully."
    );

}


/* =========================================================
   RENDER SALES
========================================================= */

function renderSales() {

    const table =
        document.getElementById(
            "salesTable"
        );


    if (!table) {

        return;

    }


    const totalTransactions =
        document.getElementById(
            "totalTransactions"
        );


    const totalRevenue =
        document.getElementById(
            "totalRevenue"
        );


    const booksSold =
        document.getElementById(
            "booksSold"
        );


    const revenue =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const soldBooks =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.quantity || 0
                ),
            0
        );


    if (totalTransactions) {

        totalTransactions.textContent =
            sales.length;

    }


    if (totalRevenue) {

        totalRevenue.textContent =
            `Rs. ${formatNumber(
                revenue
            )}`;

    }


    if (booksSold) {

        booksSold.textContent =
            soldBooks;

    }


    if (
        sales.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    No sales found
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        sales.map(
            sale => `

                <tr>

                    <td>

                        <strong>
                            ${escapeHTML(
                                sale.bookTitle
                            )}
                        </strong>

                    </td>


                    <td>
                        ${escapeHTML(
                            sale.customerName
                        )}
                    </td>


                    <td>
                        ${sale.quantity}
                    </td>


                    <td>
                        Rs.
                        ${formatNumber(
                            sale.total
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            sale.date
                        )}
                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   CUSTOMER EVENTS
========================================================= */

function setupCustomerEvents() {

    const addCustomerBtn =
        document.getElementById(
            "addCustomerBtn"
        );


    const customerForm =
        document.getElementById(
            "customerForm"
        );


    if (addCustomerBtn) {

        addCustomerBtn.addEventListener(
            "click",
            () => {

                resetCustomerForm();

                openModal(
                    "customerModal"
                );

            }
        );

    }


    if (customerForm) {

        customerForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                saveCustomer();

            }
        );

    }

}


/* =========================================================
   RESET CUSTOMER
========================================================= */

function resetCustomerForm() {

    const form =
        document.getElementById(
            "customerForm"
        );


    if (form) {

        form.reset();

    }


    const id =
        document.getElementById(
            "customerId"
        );


    if (id) {

        id.value = "";

    }

}


/* =========================================================
   SAVE CUSTOMER
========================================================= */

function saveCustomer() {

    const id =
        document.getElementById(
            "customerId"
        ).value;


    const name =
        document.getElementById(
            "customerName"
        ).value.trim();


    const phone =
        document.getElementById(
            "customerPhone"
        ).value.trim();


    const email =
        document.getElementById(
            "customerEmail"
        ).value.trim();


    if (!name) {

        showToast(
            "Please enter customer name."
        );

        return;

    }


    if (id) {

        const index =
            customers.findIndex(
                customer =>
                    String(customer.id)
                    ===
                    String(id)
            );


        if (index === -1) {

            showToast(
                "Customer not found."
            );

            return;

        }


        customers[index].name =
            name;

        customers[index].phone =
            phone;

        customers[index].email =
            email;


        showToast(
            "Customer updated successfully."
        );

    }

    else {

        customers.push({

            id:
                Date.now().toString(),

            name,

            phone,

            email,

            totalPurchases:
                0,

            createdAt:
                new Date().toISOString()

        });


        showToast(
            "Customer added successfully."
        );

    }


    saveData(
        STORAGE_KEYS.customers,
        customers
    );


    renderAll();


    closeModal(
        "customerModal"
    );

}


/* =========================================================
   EDIT CUSTOMER
========================================================= */

function editCustomer(id) {

    const customer =
        customers.find(
            item =>
                String(item.id)
                ===
                String(id)
        );


    if (!customer) {

        showToast(
            "Customer not found."
        );

        return;

    }


    document.getElementById(
        "customerId"
    ).value =
        customer.id;


    document.getElementById(
        "customerName"
    ).value =
        customer.name;


    document.getElementById(
        "customerPhone"
    ).value =
        customer.phone || "";


    document.getElementById(
        "customerEmail"
    ).value =
        customer.email || "";


    openModal(
        "customerModal"
    );

}


/* =========================================================
   DELETE CUSTOMER
========================================================= */

function deleteCustomer(id) {

    const customer =
        customers.find(
            item =>
                String(item.id)
                ===
                String(id)
        );


    if (!customer) {

        return;

    }


    const hasSales =
        sales.some(
            sale =>
                String(
                    sale.customerId
                )
                ===
                String(id)
        );


    if (hasSales) {

        showToast(
            "This customer has sales history and cannot be deleted."
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete "${customer.name}"?`
        );


    if (!confirmed) {

        return;

    }


    customers =
        customers.filter(
            item =>
                String(item.id)
                !==
                String(id)
        );


    saveData(
        STORAGE_KEYS.customers,
        customers
    );


    renderAll();


    showToast(
        "Customer deleted successfully."
    );

}


/* =========================================================
   RENDER CUSTOMERS
========================================================= */

function renderCustomers() {

    const table =
        document.getElementById(
            "customersTable"
        );


    if (!table) {

        return;

    }


    if (
        customers.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    No customers found
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        customers.map(
            customer => `

                <tr>

                    <td>

                        <strong>
                            ${escapeHTML(
                                customer.name
                            )}
                        </strong>

                    </td>


                    <td>
                        ${escapeHTML(
                            customer.phone
                            ||
                            "-"
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            customer.email
                            ||
                            "-"
                        )}
                    </td>


                    <td>
                        Rs.
                        ${formatNumber(
                            customer.totalPurchases
                            ||
                            0
                        )}
                    </td>


                    <td>

                        <div class="actions">

                            <button
                                class="icon-btn edit"
                                title="Edit"
                                onclick="editCustomer('${customer.id}')"
                            >
                                <i
                                    class="fa-solid fa-pen"
                                ></i>
                            </button>


                            <button
                                class="icon-btn delete"
                                title="Delete"
                                onclick="deleteCustomer('${customer.id}')"
                            >
                                <i
                                    class="fa-solid fa-trash"
                                ></i>
                            </button>

                        </div>

                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const totalBooks =
        document.getElementById(
            "totalBooks"
        );


    const totalStock =
        document.getElementById(
            "totalStock"
        );


    const todaySales =
        document.getElementById(
            "todaySales"
        );


    const todayRevenue =
        document.getElementById(
            "todayRevenue"
        );


    const stock =
        books.reduce(
            (sum, book) =>
                sum +
                Number(
                    book.stock || 0
                ),
            0
        );


    const today =
        getTodayDate();


    const todaysSales =
        sales.filter(
            sale =>
                formatDateForComparison(
                    sale.date
                )
                ===
                today
        );


    const revenue =
        todaysSales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    if (totalBooks) {

        totalBooks.textContent =
            books.length;

    }


    if (totalStock) {

        totalStock.textContent =
            stock;

    }


    if (todaySales) {

        todaySales.textContent =
            todaysSales.length;

    }


    if (todayRevenue) {

        todayRevenue.textContent =
            `Rs. ${formatNumber(
                revenue
            )}`;

    }


    renderRecentSales();

    renderLowStock();

}


/* =========================================================
   RECENT SALES
========================================================= */

function renderRecentSales() {

    const table =
        document.getElementById(
            "recentSalesTable"
        );


    if (!table) {

        return;

    }


    const recentSales =
        sales.slice(0, 5);


    if (
        recentSales.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    No sales yet
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        recentSales.map(
            sale => `

                <tr>

                    <td>
                        ${escapeHTML(
                            sale.bookTitle
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            sale.customerName
                        )}
                    </td>


                    <td>
                        ${sale.quantity}
                    </td>


                    <td>
                        Rs.
                        ${formatNumber(
                            sale.total
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            sale.date
                        )}
                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   LOW STOCK
========================================================= */

function renderLowStock() {

    const list =
        document.getElementById(
            "lowStockList"
        );


    if (!list) {

        return;

    }


    const lowStockBooks =
        books.filter(
            book =>
                Number(book.stock)
                <=
                5
        );


    if (
        lowStockBooks.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">
                No low-stock books
            </div>

        `;

        return;

    }


    list.innerHTML =
        lowStockBooks.map(
            book => `

                <div
                    class="low-stock-item"
                >

                    <strong>
                        ${escapeHTML(
                            book.title
                        )}
                    </strong>

                    <span>
                        ${book.stock} left
                    </span>

                </div>

            `
        ).join("");

}


/* =========================================================
   REPORTS
========================================================= */

function renderReports() {

    const todayRevenueElement =
        document.getElementById(
            "reportTodayRevenue"
        );


    const totalRevenueElement =
        document.getElementById(
            "reportTotalRevenue"
        );


    const booksSoldElement =
        document.getElementById(
            "reportBooksSold"
        );


    const reportContent =
        document.getElementById(
            "reportContent"
        );


    const today =
        getTodayDate();


    const todaysSales =
        sales.filter(
            sale =>
                formatDateForComparison(
                    sale.date
                )
                ===
                today
        );


    const todayRevenue =
        todaysSales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const totalRevenue =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const totalBooksSold =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.quantity || 0
                ),
            0
        );


    if (todayRevenueElement) {

        todayRevenueElement.textContent =
            `Rs. ${formatNumber(
                todayRevenue
            )}`;

    }


    if (totalRevenueElement) {

        totalRevenueElement.textContent =
            `Rs. ${formatNumber(
                totalRevenue
            )}`;

    }


    if (booksSoldElement) {

        booksSoldElement.textContent =
            totalBooksSold;

    }


    if (!reportContent) {

        return;

    }


    if (
        sales.length === 0
    ) {

        reportContent.innerHTML = `

            <div class="empty-state">
                No report data available
            </div>

        `;

        return;

    }


    const bookSales = {};


    sales.forEach(
        sale => {

            if (
                !bookSales[
                    sale.bookTitle
                ]
            ) {

                bookSales[
                    sale.bookTitle
                ] = 0;

            }


            bookSales[
                sale.bookTitle
            ] +=
                Number(
                    sale.quantity || 0
                );

        }
    );


    const sortedBooks =
        Object.entries(
            bookSales
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 5);


    reportContent.innerHTML = `

        <div>

            <h4
                style="margin-bottom:15px;"
            >
                Top Selling Books
            </h4>


            ${sortedBooks.map(
                ([title, quantity]) => `

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            padding:12px 0;
                            border-bottom:1px solid #e5e7eb;
                        "
                    >

                        <span>
                            ${escapeHTML(
                                title
                            )}
                        </span>


                        <strong>
                            ${quantity} sold
                        </strong>

                    </div>

                `
            ).join("")}

        </div>

    `;

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettingsEvents() {

    const form =
        document.getElementById(
            "settingsForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            settings = {

                name:
                    document.getElementById(
                        "shopName"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "shopPhone"
                    ).value.trim(),

                address:
                    document.getElementById(
                        "shopAddress"
                    ).value.trim()

            };


            saveData(
                STORAGE_KEYS.settings,
                settings
            );


            showToast(
                "Settings saved successfully."
            );

        }
    );

}


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadSettings() {

    const shopName =
        document.getElementById(
            "shopName"
        );


    const shopPhone =
        document.getElementById(
            "shopPhone"
        );


    const shopAddress =
        document.getElementById(
            "shopAddress"
        );


    if (shopName) {

        shopName.value =
            settings.name || "";

    }


    if (shopPhone) {

        shopPhone.value =
            settings.phone || "";

    }


    if (shopAddress) {

        shopAddress.value =
            settings.address || "";

    }

}


/* =========================================================
   ADMIN PANEL
========================================================= */

function setupAdmin() {

    const adminInfo =
        document.getElementById(
            "adminInfo"
        );


    if (!adminInfo) {

        return;

    }


    /* -----------------------------------------
       OPEN ADMIN PANEL
    ----------------------------------------- */

    adminInfo.addEventListener(
        "click",
        () => {

            loadAdminData();

            openModal(
                "adminModal"
            );

        }
    );


    /* -----------------------------------------
       SAVE ADMIN PROFILE
    ----------------------------------------- */

    const saveAdminProfile =
        document.getElementById(
            "saveAdminProfile"
        );


    if (saveAdminProfile) {

        saveAdminProfile.addEventListener(
            "click",
            () => {

                const adminName =
                    document.getElementById(
                        "adminName"
                    );


                const adminEmail =
                    document.getElementById(
                        "adminEmail"
                    );


                const adminPhone =
                    document.getElementById(
                        "adminPhone"
                    );


                if (
                    !adminName ||
                    !adminEmail ||
                    !adminPhone
                ) {

                    return;

                }


                const adminData = {

                    name:
                        adminName.value.trim(),

                    email:
                        adminEmail.value.trim(),

                    phone:
                        adminPhone.value.trim()

                };


                if (!adminData.name) {

                    showToast(
                        "Please enter admin name."
                    );

                    return;

                }


                saveData(
                    STORAGE_KEYS.admin,
                    adminData
                );


                updateAdminDisplay(
                    adminData
                );


                showToast(
                    "Admin profile saved successfully."
                );

            }
        );

    }


    /* -----------------------------------------
       CHANGE PASSWORD
    ----------------------------------------- */

    const changePasswordBtn =
        document.getElementById(
            "changePasswordBtn"
        );


    if (changePasswordBtn) {

        changePasswordBtn.addEventListener(
            "click",
            () => {

                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    ).value;


                const newPassword =
                    document.getElementById(
                        "newPassword"
                    ).value;


                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    ).value;


                const savedPassword =
                    localStorage.getItem(
                        STORAGE_KEYS.adminPassword
                    );


                /* --------------------------------
                   FIRST TIME PASSWORD
                -------------------------------- */

                if (!savedPassword) {

                    if (!newPassword) {

                        showToast(
                            "Please enter a new password."
                        );

                        return;

                    }


                    if (
                        newPassword.length < 6
                    ) {

                        showToast(
                            "Password must be at least 6 characters."
                        );

                        return;

                    }


                    if (
                        newPassword !==
                        confirmPassword
                    ) {

                        showToast(
                            "New passwords do not match."
                        );

                        return;

                    }


                    localStorage.setItem(
                        STORAGE_KEYS.adminPassword,
                        newPassword
                    );


                    clearPasswordFields();


                    showToast(
                        "Password created successfully."
                    );


                    return;

                }


                /* --------------------------------
                   CHECK OLD PASSWORD
                -------------------------------- */

                if (
                    currentPassword !==
                    savedPassword
                ) {

                    showToast(
                        "Current password is incorrect."
                    );

                    return;

                }


                /* --------------------------------
                   VALIDATE NEW PASSWORD
                -------------------------------- */

                if (!newPassword) {

                    showToast(
                        "Please enter a new password."
                    );

                    return;

                }


                if (
                    newPassword.length < 6
                ) {

                    showToast(
                        "Password must be at least 6 characters."
                    );

                    return;

                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    showToast(
                        "New passwords do not match."
                    );

                    return;

                }


                /* --------------------------------
                   SAVE NEW PASSWORD
                -------------------------------- */

                localStorage.setItem(
                    STORAGE_KEYS.adminPassword,
                    newPassword
                );


                clearPasswordFields();


                showToast(
                    "Password changed successfully."
                );

            }
        );

    }


    /* -----------------------------------------
       SAVE SHOP INFORMATION
    ----------------------------------------- */

    const saveAdminShop =
        document.getElementById(
            "saveAdminShop"
        );


    if (saveAdminShop) {

        saveAdminShop.addEventListener(
            "click",
            () => {

                const shopName =
                    document.getElementById(
                        "adminShopName"
                    );


                const shopPhone =
                    document.getElementById(
                        "adminShopPhone"
                    );


                const shopAddress =
                    document.getElementById(
                        "adminShopAddress"
                    );


                if (
                    !shopName ||
                    !shopPhone ||
                    !shopAddress
                ) {

                    return;

                }


                const shopData = {

                    name:
                        shopName.value.trim(),

                    phone:
                        shopPhone.value.trim(),

                    address:
                        shopAddress.value.trim()

                };


                if (!shopData.name) {

                    showToast(
                        "Please enter shop name."
                    );

                    return;

                }


                saveData(
                    STORAGE_KEYS.adminShop,
                    shopData
                );


                /* Also update normal Settings */

                settings = {

                    name:
                        shopData.name,

                    phone:
                        shopData.phone,

                    address:
                        shopData.address

                };


                saveData(
                    STORAGE_KEYS.settings,
                    settings
                );


                loadSettings();


                showToast(
                    "Shop information saved successfully."
                );

            }
        );

    }


    /* -----------------------------------------
       LOAD EXISTING ADMIN DISPLAY
    ----------------------------------------- */

    const savedAdmin =
        loadData(
            STORAGE_KEYS.admin,
            null
        );


    if (savedAdmin) {

        updateAdminDisplay(
            savedAdmin
        );

    }

}


/* =========================================================
   LOAD ADMIN DATA
========================================================= */

function loadAdminData() {

    /* -----------------------------------------
       ADMIN PROFILE
    ----------------------------------------- */

    const savedAdmin =
        loadData(
            STORAGE_KEYS.admin,
            null
        );


    const adminName =
        document.getElementById(
            "adminName"
        );


    const adminEmail =
        document.getElementById(
            "adminEmail"
        );


    const adminPhone =
        document.getElementById(
            "adminPhone"
        );


    if (savedAdmin) {

        if (adminName) {

            adminName.value =
                savedAdmin.name || "";

        }


        if (adminEmail) {

            adminEmail.value =
                savedAdmin.email || "";

        }


        if (adminPhone) {

            adminPhone.value =
                savedAdmin.phone || "";

        }

    }

    else {

        if (adminName) {

            adminName.value =
                "Admin";

        }


        if (adminEmail) {

            adminEmail.value =
                "";

        }


        if (adminPhone) {

            adminPhone.value =
                "";

        }

    }


    /* -----------------------------------------
       SHOP INFORMATION
    ----------------------------------------- */

    const savedShop =
        loadData(
            STORAGE_KEYS.adminShop,
            null
        );


    const adminShopName =
        document.getElementById(
            "adminShopName"
        );


    const adminShopPhone =
        document.getElementById(
            "adminShopPhone"
        );


    const adminShopAddress =
        document.getElementById(
            "adminShopAddress"
        );


    if (savedShop) {

        if (adminShopName) {

            adminShopName.value =
                savedShop.name || "";

        }


        if (adminShopPhone) {

            adminShopPhone.value =
                savedShop.phone || "";

        }


        if (adminShopAddress) {

            adminShopAddress.value =
                savedShop.address || "";

        }

    }

    else {

        /* Use existing Settings if
           Admin Shop Information
           has not been saved yet */

        if (adminShopName) {

            adminShopName.value =
                settings.name || "";

        }


        if (adminShopPhone) {

            adminShopPhone.value =
                settings.phone || "";

        }


        if (adminShopAddress) {

            adminShopAddress.value =
                settings.address || "";

        }

    }


    /* -----------------------------------------
       CLEAR PASSWORD FIELDS
    ----------------------------------------- */

    clearPasswordFields();

}


/* =========================================================
   CLEAR PASSWORD FIELDS
========================================================= */

function clearPasswordFields() {

    const currentPassword =
        document.getElementById(
            "currentPassword"
        );


    const newPassword =
        document.getElementById(
            "newPassword"
        );


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );


    if (currentPassword) {

        currentPassword.value =
            "";

    }


    if (newPassword) {

        newPassword.value =
            "";

    }


    if (confirmPassword) {

        confirmPassword.value =
            "";

    }

}


/* =========================================================
   UPDATE ADMIN DISPLAY
========================================================= */

function updateAdminDisplay(adminData) {

    const adminMini =
        document.querySelector(
            ".admin-mini"
        );


    const profile =
        document.querySelector(
            ".profile"
        );


    if (adminMini) {

        const nameElement =
            adminMini.querySelector(
                "strong"
            );


        if (nameElement) {

            nameElement.textContent =
                adminData.name ||
                "Admin";

        }


        const avatar =
            adminMini.querySelector(
                ".admin-avatar"
            );


        if (avatar) {

            avatar.textContent =
                (
                    adminData.name
                    ||
                    "A"
                )
                .charAt(0)
                .toUpperCase();

        }

    }


    if (profile) {

        const nameElement =
            profile.querySelector(
                ".profile-info strong"
            );


        if (nameElement) {

            nameElement.textContent =
                adminData.name ||
                "Admin";

        }


        const avatar =
            profile.querySelector(
                ".profile-avatar"
            );


        if (avatar) {

            avatar.textContent =
                (
                    adminData.name
                    ||
                    "A"
                )
                .charAt(0)
                .toUpperCase();

        }

    }

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function setupNotifications() {

    const notificationBtn =
        document.getElementById(
            "notificationBtn"
        );


    if (!notificationBtn) {

        return;

    }


    notificationBtn.addEventListener(
        "click",
        () => {

            const lowStockBooks =
                books.filter(
                    book =>
                        Number(book.stock)
                        <=
                        3
                );


            if (
                lowStockBooks.length === 0
            ) {

                showToast(
                    "No new notifications."
                );

                return;

            }


            const names =
                lowStockBooks
                    .map(
                        book =>
                            `${book.title} (${book.stock} copies left)`
                    )
                    .join(", ");


            showToast(
                `Low stock: ${names}`
            );

        }
    );

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    renderBooks();

    renderSales();

    renderCustomers();

    renderDashboard();

    renderReports();

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer =
    null;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (
        !toast ||
        !toastMessage
    ) {

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   HELPERS
========================================================= */

function formatNumber(number) {

    return Number(
        number || 0
    ).toLocaleString(
        "en-PK"
    );

}


function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString(
        "en-PK",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


function formatDateForComparison(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return [

        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, "0"),

        String(
            date.getDate()
        ).padStart(2, "0")

    ].join("-");

}


function getTodayDate() {

    const now =
        new Date();


    return [

        now.getFullYear(),

        String(
            now.getMonth() + 1
        ).padStart(2, "0"),

        String(
            now.getDate()
        ).padStart(2, "0")

    ].join("-");

}


function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.editBook =
    editBook;

window.deleteBook =
    deleteBook;

window.editCustomer =
    editCustomer;

window.deleteCustomer =
    deleteCustomer;