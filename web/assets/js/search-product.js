// Initialize Awesome Notifications
const notifier = new AWN({
    position: "top-right" // Set position to top-right
});


async function loadDeatailsForSearchProduct() {

    const response = await fetch("LoadAdvancedSearch?firstResult=" + 0);

    if (response.ok) {
        const json = await response.json();

        const productList = json.productList;
        const brandList = json.brandList;
        const modelList = json.modelList;
        const ConditionsList = json.productConditionsList;
        const StatusesList = json.productStatusesList;

        loadBrands(brandList);
        loadModels(modelList);
        loadConditions(ConditionsList);
        loadAvailabilities(StatusesList);
        console.log(json);
        updateProductView(json);
    } else {
        notifier.alert("Server Error Please Try Again Later");
    }
}


const brandTag = document.getElementById("as-brand-tag");
function loadBrands(dataList) {



    let containerTag = document.getElementById("as-brand");
    containerTag.innerHTML = "";

    dataList.forEach(data => {
        let asBrandTagClone = brandTag.cloneNode(true);

        asBrandTagClone.querySelector("#as-brand-name").innerHTML = data.name;
        asBrandTagClone.querySelector("#as-brand-check").value = data.id;
        containerTag.appendChild(asBrandTagClone);
    });
}

const modelTag = document.getElementById("as-model-tag");
function loadModels(dataList) {

    let containerTag = document.getElementById("as-model");
    containerTag.innerHTML = "";


    dataList.forEach(data => {
        let asModelTagClone = modelTag.cloneNode(true);

        asModelTagClone.querySelector("#as-model-check").value = data.id;
        asModelTagClone.querySelector("#as-model-name").innerHTML = data.name;
        containerTag.appendChild(asModelTagClone);
    });
}

const conditionTag = document.getElementById("as-condition-tag");
function loadConditions(dataList) {

    let containerTag = document.getElementById("as-condition");
    containerTag.innerHTML = "";


    dataList.forEach(data => {
        let asConditionTagClone = conditionTag.cloneNode(true);

        asConditionTagClone.querySelector("#as-condition-check").value = data.id;
        asConditionTagClone.querySelector("#as-condition-name").innerHTML = data.name;
        containerTag.appendChild(asConditionTagClone);
    });
}


const availableTag = document.getElementById("as-available-tag");
function loadAvailabilities(dataList) {

    let containerTag = document.getElementById("as-available");
    containerTag.innerHTML = "";


    dataList.forEach(data => {
        let asAvailableTagClone = availableTag.cloneNode(true);

        asAvailableTagClone.querySelector("#as-available-check").value = data.id;
        asAvailableTagClone.querySelector("#as-available-name").innerHTML = data.name;
        containerTag.appendChild(asAvailableTagClone);
    });
}



async function  loadProducts(first_result) {
    
   

    let checkedBrandIds = [];
    let checkedModelIds = [];
    let checkedConditionIds = [];
    let checkedAvailableIds = [];

    let brandCheckBoxes = document.querySelectorAll("#as-brand-check"); // Select all checkboxes with this ID
    let modelCheckBoxes = document.querySelectorAll("#as-model-check"); // Select all checkboxes with this ID
    let conditionCheckBoxes = document.querySelectorAll("#as-condition-check"); // Select all checkboxes with this ID
    let availableCheckBoxes = document.querySelectorAll("#as-available-check"); // Select all checkboxes with this ID
    let simple_sort = document.getElementById("simple-sort").value;
    let search_here = document.getElementById("search-here").value;

    loadCheckBoxIds(brandCheckBoxes, checkedBrandIds);
    loadCheckBoxIds(modelCheckBoxes, checkedModelIds);
    loadCheckBoxIds(conditionCheckBoxes, checkedConditionIds);
    loadCheckBoxIds(availableCheckBoxes, checkedAvailableIds);

    var $sliderRange = $("#slider-range");
    let starting_price = $sliderRange.slider("values", 0);
    let ending_price = $sliderRange.slider("values", 1);





    var formData = new FormData();
    formData.append("checkedBrandIds", JSON.stringify(checkedBrandIds));
    formData.append("checkedModelIds", JSON.stringify(checkedModelIds));
    formData.append("checkedConditionIds", JSON.stringify(checkedConditionIds));
    formData.append("checkedAvailableIds", JSON.stringify(checkedAvailableIds));
    formData.append("starting_price", starting_price);
    formData.append("ending_price", ending_price);
    formData.append("ending_price", ending_price);
    formData.append("simple_sort", simple_sort);
    formData.append("search_here", search_here);
    formData.append("first_result", first_result);



    const response = await fetch("AdvancedSearch", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        checkedBrandIds.length = 0;
        checkedModelIds.length = 0;
        checkedConditionIds.length = 0;
        checkedAvailableIds.length = 0;

        if (json.success) {

            updateProductView(json);
        } else {
            updateProductView(json);
            notifier.warning("No Product Found");
        }

    } else {
        notifier.alert("Server Error Please Try Again Later");
    }

}

function loadCheckBoxIds(checkBoxes, checkBoxIDS) {

    checkBoxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkBoxIDS.push(checkbox.value); // Collect the value of checked and 'choose'-classed checkboxes
        }
    });
}


var st_product = document.getElementById("product");
var st_pagination_button = document.getElementById("st-pagination-button");


var currentPage = 0;

function updateProductView(json) {
    let productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    json.productList.forEach(product => {
        let product_clone = st_product.cloneNode(true);

        product_clone.querySelector("#view-product-details").href = "single-product.html?pid=" + product.id;
        product_clone.querySelector("#product-brand").innerHTML = product.model.brand.name;
        product_clone.querySelector("#product-model").innerHTML = product.title;
        product_clone.querySelector("#product-price").innerHTML = product.price;
        product_clone.querySelector("#product-img").src = "product_images/" + product.id + "/image1.png";


        productContainer.appendChild(product_clone)
    });

    //start pagination
    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";

    let product_count = json.allProductCount;
    const product_per_page = 6;

    let pages = Math.ceil(product_count / product_per_page);


    //add page buttons
    for (let i = 0; i < pages; i++) {

        console.log(i);

        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_clone.querySelector("#page-number").innerHTML = i + 1;

        st_pagination_button_clone.addEventListener("click", e => {
            currentPage = i;
            loadProducts(i * 6);
        });

        if (i === currentPage) {
            st_pagination_button_clone.className = "active";
        } else {
            st_pagination_button_clone.className = "";
        }

        st_pagination_container.appendChild(st_pagination_button_clone);
    }

}






