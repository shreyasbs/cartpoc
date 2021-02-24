let itemsInCart;
notificationButtonDisplay();
let cartItemLength = 0;

//document.getElementById('itemCartBtag').innerHTML = cartItemLength;

//hosted path
var api = "https://shreyasbs.github.io/cartpoc/";
let dataFromJson;
//this method is to hide the notification on load of the page
function notificationButtonDisplay() {
    document.getElementById('btnItemAddNotification').style.display = "none";
}



//this method is to fetch the json file. Using Fetch API to read json data from file.
//JSON shared in the email was not in correct format, so used corrected json file named data.json
//running this on 
fetch(api + "data.json")
    .then(response => {
        response.json().then(body => {
            this.dataFromJson = body.items;
            this.makeList(body.items);
            this.initializeCartTable();
            console.log(body);
        });
    })
    .then(data => console.log(data));

//method to load the html for displaying the html for the json data.
function makeList(listData) {
    //gets the number of items in the json data
    let numberOfListItems = listData.length;

    //creates class=left-box div
    var mainContainer = document.getElementsByClassName('left-box');

    for (let i = 0; i < numberOfListItems; i++) {
        //creates class=item div
        let listContainer = document.createElement('div');
        listContainer.className = "item";

        //creates class=tag div
        let tagContainer = document.createElement('div');
        tagContainer.className = "tag";
        //assigns value from json to html
        tagContainer.innerHTML = listData[i].discount + '% off';

        //creates class=img div
        let imgContainer = document.createElement('div');
        imgContainer.className = "img";

        //creates img tag
        let imgTag = document.createElement('img');
        //assigns value to image src
        imgTag.src = listData[i].image;

        //adds imgTag to div img
        imgContainer.appendChild(imgTag);

        //creates class=Add-box div
        let addBoxContainer = document.createElement('div');
        addBoxContainer.className = 'Add-box';

        //creates h4 tag
        let h4Tag = document.createElement('h4');
        h4Tag.innerText = listData[i].name;

        //creates class=price div
        let priceContainer = document.createElement('div');
        priceContainer.className = 'price';
        priceContainer.innerText = '$' + listData[i].price.actual + ', ';
        //creates b tag
        let boldTag = document.createElement('b');
        boldTag.innerText = '$' + listData[i].price.display;

        //adds b tag to div price
        priceContainer.appendChild(boldTag);

        //creates addtocart button
        let addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add To Cart';

        //adds event click to the button
        addToCartButton.onclick = function () {
            addToCartClicked(i);
        };

        //adds h4Tag,elements inside div price & addtocart button
        addBoxContainer.append(h4Tag, priceContainer, addToCartButton);

        //adds div tag,div img, div add-box to div price
        listContainer.append(tagContainer, imgContainer, addBoxContainer);

        //adds div item to div left-box
        mainContainer[0].appendChild(listContainer);

    }
}

//method to update item count in cart and total tables
function updateItemLength() {
    this.cartItemLength = this.itemsInCart.length;
    document.getElementById('cartTotalBTag').innerHTML = this.cartItemLength;
}


//method when add to cart button is clicked
function addToCartClicked(index) {
    if (!this.itemsInCart) {
        this.itemsInCart = [];
    }
    var itemsPresent = this.itemsInCart.filter(x => x.name === this.dataFromJson[index].name);
    //notification to inform if item already exist 
    if (itemsPresent.length > 0) {
        document.getElementById('btnItemAddNotification').style.display = "block";
        document.getElementById('btnItemAddNotification').innerText = this.dataFromJson[index].name + ' already in cart';
    } else {
        this.itemsInCart.push(this.dataFromJson[index]);

        document.getElementById('btnItemAddNotification').style.display = "block";
        document.getElementById('btnItemAddNotification').innerText = this.dataFromJson[index].name + ' added to cart';

    }
//method to hide the notification after 2 sec
    setTimeout(function () {
        this.notificationButtonDisplay();
    }, 2000);
//updated item count
    updateItemLength();
    //refreshes table every time an item is added
    removeTable();
    //creates a table with thead and tbody
    initializeCartTable();
    //builds the items cart 
    buildCartTable();
    //builds the total table
    updateTotalTable();

    //this is used to add item count after table is created as the header of table needs to be initialized first
    this.cartItemLength = this.itemsInCart.length;
    document.getElementById('itemCartBtag').innerHTML = 'Item' +  this.cartItemLength;
}

//refreshes the table 
function removeTable() {
    let table = document.getElementById('itemCart');
    let thead = table.getElementsByTagName('thead')[0];
    table.removeChild(thead);
    let tbody = table.getElementsByTagName('tbody')[0];
    table.removeChild(tbody);
}

//populates the cart table 
function initializeCartTable() {
    let table = document.getElementById('itemCart');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let row = thead.insertRow(0);
    let headBtag = document.createElement('b');
    headBtag.id = 'itemCartBtag';
    headBtag.innerHTML = 'Item 0' ;
    row.insertCell(0).appendChild(headBtag);
    row.insertCell(1).innerText = 'Qty';
    row.insertCell(2).innerText = 'Price';

    table.append(thead, tbody);
}

//builds the items information in the cart table
function buildCartTable() {
    let table = document.getElementById('itemCart');
    let tbodyRef = table.getElementsByTagName('tbody')[0];
    for (let i = 0; i < this.itemsInCart.length; i++) {
        let row = tbodyRef.insertRow(0);
        let removeButtonContainer = document.createElement('button');
        removeButtonContainer.innerText = 'x';
        removeButtonContainer.onclick = function () {
            removeRow(i);
        };
        let spanContainer = document.createElement('span');
        spanContainer.innerText = this.itemsInCart[i].name;
        row.insertCell(0).append(spanContainer, removeButtonContainer);

        let quantityContainer = document.createElement('div');
        quantityContainer.className = 'qty-div';
        let minusButton = document.createElement('button');
        minusButton.innerText = '-';
        minusButton.onclick = function () { minusClick(i); };
        let qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        this.itemsInCart[i].qty !== undefined ? this.itemsInCart[i].qty : this.itemsInCart[i].qty = 1;
        qtyInput.value = this.itemsInCart[i].qty !== undefined ? this.itemsInCart[i].qty : 1;
        let plusButton = document.createElement('button');
        plusButton.innerText = '+';
        plusButton.onclick = function () { plusClick(i); };
        quantityContainer.append(minusButton, qtyInput, plusButton);

        row.insertCell(1).appendChild(quantityContainer);

        row.insertCell(2).innerHTML = this.itemsInCart[i].price.display;

    }
}

//removes the row from the cart table
function removeRow(index) {
    document.getElementById('itemCart').deleteRow(index === 0 ? 1 : index);

    this.itemsInCart.splice(index, 1);
    updateItemLength();
}
//decrements the quantity and updates the price
//NOTE: functionality has bugs, solution is to check the value of item from itemsInCart object to the table rows values and update the table row
function minusClick(index) {
    let tbodyRef = document.getElementById('itemCart').getElementsByTagName('tbody')[0];
    let row = tbodyRef.getElementsByTagName('tr');
    let rowColumns = row[index].getElementsByTagName('td');
    if (this.itemsInCart[index].qty === 1) {
        return;
    } else {
        this.itemsInCart[index].qty = this.itemsInCart[index].qty - 1;
        rowColumns[2].innerHTML = this.itemsInCart[index].price.display * this.itemsInCart[index].qty;
        rowColumns[1].getElementsByTagName('input')[0].value = this.itemsInCart[index].qty;
        this.updateTotalTable();
    }

}

//increments the quantity and updates the price
//NOTE: functionality has bugs, solution is to check the value of item from itemsInCart object to the table rows values and update the table row
function plusClick(index) {
    let tbodyRef = document.getElementById('itemCart').getElementsByTagName('tbody')[0];
    let row = tbodyRef.getElementsByTagName('tr');
    let rowColumns = row[index].getElementsByTagName('td');

    this.itemsInCart[index].qty = this.itemsInCart[index === 0 ? 0 : index - 1].qty + 1;
    rowColumns[2].innerHTML = this.itemsInCart[index].price.display * this.itemsInCart[index].qty;
    rowColumns[1].getElementsByTagName('input')[0].value = this.itemsInCart[index].qty;
    this.updateTotalTable();
}


//updates the total table based on items in the cart and discount
function updateTotalTable() {
    let price = 0;
    let discount = 0;
    for (let i = 0; i < this.itemsInCart.length; i++) {
        price += this.itemsInCart[i].price.display * this.itemsInCart[i].qty;
        discount += this.itemsInCart[i].discount;
    }
    const totalPriceAfterDiscount = ((discount / 100) * price);
    const totalCost = (price - totalPriceAfterDiscount);
    console.log(totalCost);
    document.getElementById('totalItemPrice').innerHTML = '$' + price;
    document.getElementById('totalDiscount').innerHTML = '-' + discount + '%';

    document.getElementById('totalPrice').innerHTML = '$' + totalCost;

}
