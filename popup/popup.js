//get Current Tab Item
let currentBtn = document.getElementById('getCurrent');

currentBtn.addEventListener('click', async () => {
    console.log('getCurrent clicked');
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab) {
        document.getElementById('inName').value = tab.title;
        document.getElementById('inPrice').value = 0;
        document.getElementById('inURL').value = tab.url;
    }
});

//add Item in List
let addBtn = document.getElementById('inBtn');
addBtn.addEventListener('click', function () {
    let inName = document.getElementById('inName').value;
    let inPrice = document.getElementById('inPrice').value;
    let inURL = document.getElementById('inURL').value;
    itemLists = JSON.parse(localStorage.getItem('itemLists')) || [];
    // console.log(new Date().getTime())
    itemLists.unshift({
        id: new Date().getTime(),
        name: inName,
        price: inPrice,
        url: inURL,
    });
    localStorage.setItem('itemLists', JSON.stringify(itemLists));
    loopList();
    document.getElementById('inName').value = '';
    document.getElementById('inPrice').value = 0;
    document.getElementById('inURL').value = '';
});

let tableBody = document.getElementById('tableBody');

let removeDOMList = () => {
    let items = tableBody.querySelectorAll('.item');
    items.forEach((item) => {
        tableBody.removeChild(item);
    });
};

//remove all Item in List
let removeAllBtn = document.getElementById('removeAllBtn');
removeAllBtn.addEventListener('click', () => {
    removeDOMList();
    itemLists = [];
    localStorage.setItem('itemLists', JSON.stringify(itemLists));
});

//for loop list
let removeBtnArr = []
let loopList = () => {
    removeDOMList();
    itemLists = JSON.parse(localStorage.getItem('itemLists')) || [];
    console.log(itemLists);
    itemLists.map((item) => {
        let tr = document.createElement('tr');
        tr.className = 'item';
        tr.id = item.id;

        let tdName = document.createElement('td');
        let tdPrice = document.createElement('td');
        let tdUrl = document.createElement('td');
        let tdBtn = document.createElement('td');

        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = item.name;
        nameInput.className = 'list-input';
        tdName.appendChild(nameInput);

        let priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.value = item.price;
        priceInput.className = 'list-input price';
        tdPrice.appendChild(priceInput);

        let urlElement = document.createElement('a');
        urlElement.innerText = 'Buy!!!';
        urlElement.className = 'btn-primary block text-center text-xs w-full px-2';
        urlElement.href = item.url;
        urlElement.target = '_blank';
        tdUrl.appendChild(urlElement);

        let btn = document.createElement('button');
        btn.innerText = 'Remove';
        btn.className = 'btn-danger text-xs w-full removeBtn';
        tdBtn.appendChild(btn);

        tr.appendChild(tdName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdUrl);
        tr.appendChild(tdBtn);
        tableBody.appendChild(tr);
    });
    

    //remove Item in List
    //因為重新渲染，所以每次都要重新將addEventListener做綁定
    removeBtnArr = Array.from(document.getElementsByClassName('removeBtn'))
    removeBtnArr.forEach(removeBtn => {
        removeBtn.addEventListener('click', () => {
            let id = removeBtn.parentNode.parentNode.id;
            itemLists = JSON.parse(localStorage.getItem('itemLists')) || [];
            itemLists = itemLists.filter((item) => item.id != id);
            localStorage.setItem('itemLists', JSON.stringify(itemLists));
            loopList();
        });
    });
};
loopList();

//ToThousand(add '，')
const ToThousand = (num) => {
    //拿掉非數字字元(除了負號)
    num = num.toString().replace(/[^-0-9]/g, '');
    //加逗號
    num = num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

    if (num === '') {
        return 0;
    } else {
        return num;
    }
};

let allPrice = tableBody.querySelectorAll('.price');
allPrice.forEach((price) => {
    price.addEventListener('keyup', () => {
        price.value = ToThousand(price.value);
    });
});
