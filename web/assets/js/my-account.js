// Initialize Awesome Notifications
const notifier = new AWN({
    position: "top-right" // Set position to top-right
});

var modelList;
async function loadDetailsForAddProduct() {

    const response = await fetch("LoadDetailsForAddProduct");

    loadPurchaseHistory();
    loadOrderHistory();

    if (response.ok) {
        const json = await response.json();
        const brandList = json.brandList;
        modelList = json.modelList;
        const productConditionsList = json.productConditionsList;
        const productStatusesList = json.productStatusesList;

        loadSelectors("select-model", modelList, ["id", "name"]);
        loadSelectors("select-brand", brandList, ["id", "name"]);
        loadSelectors("select-condition", productConditionsList, ["id", "name"]);
        loadSelectors("select-status", productStatusesList, ["id", "name"]);
    } else {
        notifier.alert("Server Error Please Try Again Later");
    }
}

function loadSelectors(selector, dataList, properties) {

    let selectTag = document.getElementById(selector);

    dataList.forEach(data => {
        const option = document.createElement("option");
        option.innerHTML = data[properties[1]];
        option.value = data[properties[0]];
        selectTag.appendChild(option);
    });
}

function updateModels() {

    let modelSelectTag = document.getElementById("select-model");
    modelSelectTag.length = 1;
    let selectedBrandId = document.getElementById("select-brand").value;
    modelList.forEach(model => {
        if (model.brand.id == selectedBrandId) {
            let optionTag = document.createElement("option");
            optionTag.value = model.id;
            optionTag.innerHTML = model.name;
            modelSelectTag.appendChild(optionTag);
        }
    });
}

async function addProduct() {

    var formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("brand", document.getElementById("select-brand").value);
    formData.append("model", document.getElementById("select-model").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("qty", document.getElementById("qty").value);
    formData.append("condition", document.getElementById("select-condition").value);
    formData.append("status", document.getElementById("select-status").value);
    formData.append("image1", document.getElementById("image1").files[0]);
    formData.append("image2", document.getElementById("image2").files[0]);
    formData.append("image3", document.getElementById("image3").files[0]);



    const response = await fetch("AddProduct", {
        method: "POST",
        body: formData
    }
    );

    if (response.ok) {
        const json = await response.json();
        if (json.success) {
            notifier.success("Product Addedd Successfully");
            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            document.getElementById("select-brand").value = "Select";
            document.getElementById("select-model").value = "Select";
            document.getElementById("price").value = "";
            document.getElementById("qty").value = "";
            document.getElementById("select-condition").value = "Select";
            document.getElementById("select-status").value = "Select";
            document.getElementById("image1").value = "";
            document.getElementById("image2").value = "";
            document.getElementById("image3").value = "";
        } else {
            notifier.warning(json.message);
        }
    } else {
        notifier.alert("Server Error Please Try Again Later");
    }
}

async function updatePassword() {
    let currentPassword = document.getElementById("currentPassword").value;
    let newPassword = document.getElementById("newPassword").value;

    var formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);

    const response = await fetch("UpdateUserPassword", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        const json = await response.json();
        if (json.success) {
            console.log("hello");

            notifier.success(json.message);
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
        } else {
            notifier.warning(json.message);
        }

    } else {
        notifier.alert("Server Error");
    }
}
const purchase_Order = document.getElementById("purchaseOrder");
async  function loadPurchaseHistory() {
    const response = await fetch("LoadPurchaseHistory");

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        if (json.success) {

            const purchase_Order_Container = document.getElementById("purchaseOrderContainer");
            purchase_Order_Container.innerHTML = "";

            json.purchaseOrderList.forEach(purchaseItem => {
                let purchase_Order_Clone = purchase_Order.cloneNode(true);

                purchase_Order_Clone.querySelector("#p-product").innerHTML = purchaseItem.product.title;
                purchase_Order_Clone.querySelector("#p-qty").innerHTML = purchaseItem.qty;
                purchase_Order_Clone.querySelector("#p-date").innerHTML = purchaseItem.order.datetime;
                purchase_Order_Clone.querySelector("#p-seller").innerHTML = purchaseItem.product.user.username;
                purchase_Order_Clone.querySelector("#p-price").innerHTML = purchaseItem.product.price * purchaseItem.qty;

                purchase_Order_Container.appendChild(purchase_Order_Clone);
            });

        } else {
            notifier.warning(json.message);
        }

    } else {
        notifier.alert("Server Error");
    }
}

const orderItem = document.getElementById("orderItem");
async  function loadOrderHistory() {
    const response = await fetch("LoadOrdersHistory");

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        if (json.success) {

            const order_Item_Container = document.getElementById("orderItemContainer");
            order_Item_Container.innerHTML = "";

            json.orderList.forEach(order_Item => {
                let orderItem_Clone = orderItem.cloneNode(true);

                orderItem_Clone.querySelector("#o-product").innerHTML = order_Item.product.title;
                orderItem_Clone.querySelector("#o-qty").innerHTML = order_Item.qty;
                orderItem_Clone.querySelector("#o-date").innerHTML = order_Item.order.datetime;
                orderItem_Clone.querySelector("#o-address").innerHTML = order_Item.order.address.line1;
                orderItem_Clone.querySelector("#o-status").innerHTML = order_Item.order_status.name;
                orderItem_Clone.querySelector("#o-price").innerHTML = order_Item.product.price * order_Item.qty;

                order_Item_Container.appendChild(orderItem_Clone);
            });

        } else {
            notifier.warning(json.message);
        }

    } else {
        notifier.alert("Server Error");
    }
}

async function signOut() {
    const response = await fetch("SignOut");
    if (response.ok) {
        window.location = "login.html";
    }
}
