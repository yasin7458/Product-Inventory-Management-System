var SEED_PRODUCTS = [
    {
        id: "1",
        title: "Wireless Headphones",
        price: 49.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI7WfLjhlVIUUtvw3BAf0HVIWuy17qfatkqu3CwquuVA&s=10"
    },
    {
        id: "2",
        title: "Smart Watch",
        price: 89.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZeNNKoK7v9Ka9k8ha-0BPtN3MJEoNnjlDp2KAEOB3Mw&s=10"
    },
    {
        id: "3",
        title: "Shoes",
        price: 59.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuoD_WlVBzNR_pDE4jYRLerj5UkjwkoQGwxVQdVHPMew&s=10"
    },
    {
        id: "4",
        title: "Backpack",
        price: 34.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1vTRWrHdtvBG8aC-nhnIzKY22-6o37KXEtfoO2xDSeA&s=10"
    },
    {
        id: "5",
        title: "Sunglasses",
        price: 19.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA3UGKwTui9iDWKyEUme7GG1f5eUZVBZAlc40jYwT40w&s=10"
    },
    {
        id: "6",
        title: "Bluetooth Speaker",
        price: 39.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo4MAFv14aYIuGjYAEpdbSu17ri84zmlHQWRYb17Cc0w&s=10"
    },
    {
        id: "7",
        title: "Coffee Mug",
        price: 9.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh_mpTTBwxXQbF5lfDTktp1yHq86V-VKGxC2iQpiSz3w&s=10"
    },
    {
        id: "8",
        title: "Laptop Stand",
        price: 24.99,
        image: "https://rukminim2.flixcart.com/image/800/1070/xif0q/laptop-stand/x/v/1/1-6-por-2202-portronics-original-imagzgg3k9vwybuz.jpeg?q=80"
    },
    {
        id: "9",
        title: "Table Lamp",
        price: 29.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR73xbBq0VUtPZFhzrgqVjxUQDhUjdCv-F4S-IuCTdirw&s"
    },
    {
        id: "10",
        title: "Water Bottle",
        price: 14.99,
        image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSRrWk2gCpQnjcMf1w5kLV83cLsSxx_WOU2e15fW_jPnDn79kLnkSoPorkenAoWe-t6mrWU5OiBtSZPRzW2rHXnkVpl-XJFIFhUMJtElNgGrCmILIPHTvcoyA"
    }
];

var KEY_PRODUCTS = "products";
var KEY_ADD = "addProductStorage";
var KEY_EDIT = "editProductStorage";
var KEY_DELETE = "deleteProductStorage";
var KEY_SORT = "sortStorage";
var KEY_SEARCH = "searchStorage";

var editingId;

function getStoredProducts() {
    var storedValue = localStorage.getItem(KEY_PRODUCTS);
    var products = JSON.parse(storedValue);

    if (!Array.isArray(products)) {
        products = SEED_PRODUCTS.slice();
        localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
    }

    return products;
}

function initProducts() {

    if (!localStorage.getItem(KEY_PRODUCTS)) {
        localStorage.setItem(KEY_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    } else {
        getStoredProducts();
    }

    if (!localStorage.getItem(KEY_ADD)) {
        localStorage.setItem(KEY_ADD, JSON.stringify(null));
    }
    if (!localStorage.getItem(KEY_EDIT)) {
        localStorage.setItem(KEY_EDIT, JSON.stringify(null));
    }
    if (!localStorage.getItem(KEY_DELETE)) {
        localStorage.setItem(KEY_DELETE, JSON.stringify(null));
    }
    if (!localStorage.getItem(KEY_SORT)) {
        localStorage.setItem(KEY_SORT, JSON.stringify({ preference: "", result: SEED_PRODUCTS }));
    }
    if (!localStorage.getItem(KEY_SEARCH)) {
        localStorage.setItem(KEY_SEARCH, "");
    }
}

function sortProducts(parameter) {
    var savedSortRaw = localStorage.getItem(KEY_SORT);
    var savedSort;

    if (savedSortRaw) {
        savedSort = JSON.parse(savedSortRaw);
    } else {
        savedSort = {};
    }

    var preference;

    if (savedSort.preference) {
        preference = savedSort.preference;
    } else {
        preference = "";
    }

    if (parameter !== undefined) {
        preference = parameter;
    }

    var dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.value = preference;
    }

    var products = getStoredProducts();
    var sorted = products.slice();

    if (preference === "Price : Low to High") {
        sorted.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (preference === "Price : High to Low") {
        sorted.sort(function (a, b) {
            return b.price - a.price;
        });
    }

    localStorage.setItem(KEY_SORT, JSON.stringify({ preference: preference, result: sorted }));

    addProductToList();
}

function addProductToList() {
    var grid = document.querySelector("#grid");
    var emptyState = document.querySelector("#emptyState");
    var countLabel = document.querySelector("#countLabel");

    var sortDataRaw = localStorage.getItem(KEY_SORT);
    var sortData;

    if (sortDataRaw) {
        sortData = JSON.parse(sortDataRaw);
    } else {
        sortData = { result: [] };
    }

    var products;
    if (Array.isArray(sortData.result)) {
        products = sortData.result;
    } else {
        products = [];
    }

    grid.innerHTML = "";

    if (products.length === 0) {
        emptyState.style.display = "block";
        grid.style.display = "none";
    } else {
        emptyState.style.display = "none";
        grid.style.display = "grid";
    }

    if (products.length === 1) {
        countLabel.innerText = products.length + " product";
    } else {
        countLabel.innerText = products.length + " products";
    }

    for (var i = 0; i < products.length; i++) {
        var element = products[i];

        var div = document.createElement("div");
        div.className = "tag-card";
        div.id = element.id;

        var img = document.createElement("img");
        img.src = element.image;
        img.alt = element.title;

        var h3 = document.createElement("h3");
        h3.className = "tag-title";
        h3.append(element.title);

        var h5 = document.createElement("h5");
        h5.className = "tag-price";
        h5.append("$" + element.price);

        var actions = document.createElement("div");
        actions.className = "tag-actions";

        var editBtn = document.createElement("button");
        editBtn.className = "icon-btn edit-btn";
        editBtn.innerText = "Edit";

        var deleteBtn = document.createElement("button");
        deleteBtn.className = "icon-btn delete-btn";
        deleteBtn.innerText = "Delete";

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(h5);
        div.appendChild(actions);

        grid.appendChild(div);
    }

    applyStoredSearch();
}

function openForm(mode, product) {
    var overlay = document.querySelector("#formOverlay");
    var formTitle = document.querySelector("#formTitle");
    var saveBtn = document.querySelector("#saveBtn");

    document.querySelector("#titleError").classList.remove("show");
    document.querySelector("#priceError").classList.remove("show");

    if (mode === "edit" && product) {
        editingId = product.id;
        formTitle.innerText = "Edit Product";
        saveBtn.innerText = "Save Changes";
        document.querySelector("#titleInput").value = product.title;
        document.querySelector("#priceInput").value = product.price;
        document.querySelector("#imageInput").value = product.image;
    } else {
        editingId = null;
        formTitle.innerText = "New Product";
        saveBtn.innerText = "Add Product";
        document.querySelector("#titleInput").value = "";
        document.querySelector("#priceInput").value = "";
        document.querySelector("#imageInput").value = "";
    }

    overlay.classList.add("open");
    document.querySelector("#titleInput").focus();
}

function closeForm() {
    document.querySelector("#formOverlay").classList.remove("open");
    editingId = null;
}

function validateForm() {
    var titleInput = document.querySelector("#titleInput");
    var priceInput = document.querySelector("#priceInput");
    var titleError = document.querySelector("#titleError");
    var priceError = document.querySelector("#priceError");

    var title = titleInput.value.trim();
    var price = parseFloat(priceInput.value);

    var valid = true;

    if (!title) {
        titleError.classList.add("show");
        valid = false;
    } else {
        titleError.classList.remove("show");
    }

    if (isNaN(price) || price <= 0) {
        priceError.classList.add("show");
        valid = false;
    } else {
        priceError.classList.remove("show");
    }

    return valid;
}

function addProduct() {
    var isValid = validateForm();
    if (!isValid) {
        return;
    }

    var title = document.querySelector("#titleInput").value.trim();
    var price = parseFloat(document.querySelector("#priceInput").value);
    var image = document.querySelector("#imageInput").value.trim();

    var roundedPrice = parseInt(price * 100) / 100;

    var products = getStoredProducts();

    var formattedProduct = {
        id: (products.length).toString(),
        title: title,
        price: roundedPrice,
        image: image
    };

    products.push(formattedProduct);
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));

    localStorage.setItem(KEY_ADD, JSON.stringify(formattedProduct));

    closeForm();
    sortProducts();
}

function editProduct() {
    var isValid = validateForm();
    if (!isValid) {
        return;
    }

    var title = document.querySelector("#titleInput").value.trim();
    var price = parseFloat(document.querySelector("#priceInput").value);
    var image = document.querySelector("#imageInput").value.trim();

    var roundedPrice = parseFloat(price * 100) / 100;

    var products = getStoredProducts();
    var updated = [];

    for (var i = 0; i < products.length; i++) {
        var item = products[i];

        if (item.id === editingId) {
            updated.push({
                id: editingId,
                title: title,
                price: roundedPrice,
                image: image
            });
        } else {
            updated.push(item);
        }
    }

    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(updated));
    localStorage.setItem(KEY_EDIT, JSON.stringify({ id: editingId, title: title, price: roundedPrice, image: image }));

    closeForm();
    sortProducts();
}

function saveProductForm() {
    if (editingId !== null && editingId !== undefined) {
        editProduct();
    } else {
        addProduct();
    }
}

function deleteProduct(id) {
    var products = getStoredProducts();
    var deletedProduct = null;

    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            deletedProduct = products[i];
        }
    }

    var updated = [];
    for (var j = 0; j < products.length; j++) {
        if (products[j].id !== id) {
            updated.push(products[j]);
        }
    }

    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(updated));

    if (deletedProduct) {
        localStorage.setItem(KEY_DELETE, JSON.stringify(deletedProduct));
    }

    sortProducts();
}

function applyStoredSearch() {
    var searchValue = localStorage.getItem(KEY_SEARCH);
    if (!searchValue) {
        searchValue = "";
    }
    searchValue = searchValue.toLowerCase();

    var cards = document.querySelectorAll("#grid .tag-card");

    cards.forEach(function (card) {
        var text = card.innerText.toLowerCase();
        if (text.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

initProducts();

var savedSearch = localStorage.getItem(KEY_SEARCH);
if (!savedSearch) {
    savedSearch = "";
}
document.querySelector("#search").value = savedSearch;

var startSortRaw = localStorage.getItem(KEY_SORT);
var startSort;
if (startSortRaw) {
    startSort = JSON.parse(startSortRaw);
} else {
    startSort = {};
}

if (startSort.preference) {
    sortProducts(startSort.preference);
} else {
    sortProducts("");
}

document.querySelector("#sort").addEventListener("input", function (e) {
    sortProducts(e.target.value);
});

document.querySelector("#openAddBtn").addEventListener("click", function () {
    openForm("add");
});

document.querySelector("#closeFormBtn").addEventListener("click", closeForm);
document.querySelector("#cancelBtn").addEventListener("click", closeForm);
document.querySelector("#saveBtn").addEventListener("click", saveProductForm);

document.querySelector("#search").addEventListener("input", function () {
    localStorage.setItem(KEY_SEARCH, document.querySelector("#search").value);
    applyStoredSearch();
});

document.querySelector("#grid").addEventListener("click", function (e) {
    var card = e.target.closest(".tag-card");
    if (!card) return;
    var id = card.id;

    if (e.target.classList.contains("edit-btn")) {
        var products = getStoredProducts();
        var product = null;

        for (var i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                product = products[i];
            }
        }

        if (product) {
            openForm("edit", product);
        }
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteProduct(id);
    }
});