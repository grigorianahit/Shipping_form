function getCountries() {
    let req = new XMLHttpRequest();
    req.open("GET", "https://restcountries.eu/rest/v2/all", true);
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = this.responseText;
            data = JSON.parse(data);
            setCountries(data);
        }
    };
}

function setCountries(countryList) {
    let select = document.querySelector('[name= "recipient-country"]');
    for (let i = 0; i < countryList.length; i++) {
        let o = document.createElement("option");
        o.innerText = countryList[i].name;
        o.value = countryList[i].name;
        select.appendChild(o);
    }
    let bSel = document.querySelector('[name= "billing-country"]');
    bSel.parentElement.replaceChild(select.cloneNode(true), bSel);
}

getCountries();

let geo = document.querySelector('.geo_svg');
geo.addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (res) {
            let req = new XMLHttpRequest();
            req.open("GET", "https://api.opencagedata.com/geocode/v1/json?q=" + res.coords.latitude + "+" + res.coords.longitude + "&key=8d5aa59cf26941a899237e89d6c22fd9&pretty=1", true);
            req.send();
            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let data = this.responseText;
                    data = JSON.parse(data);
                    setCity(data);
                }
            };
        })
    }
});

function setCity(data) {
    console.log(data);
    let city = document.querySelector('#shipping-city');
    city.value = data.results[0].components.city;
    let country = data.results[0].components.country;
    document.querySelector('[value="' + country + '"]').selected = true;
}

let validate = {
    fullName: function (ev) {
        let v = this.value;
        if (v.length == 0) {
            return;
        }
        v = v[v.length - 1].codePointAt(0);
        if (!((v >= 65 && v <= 90) ||
            (v >= 97 && v <= 122) ||
            (v == 32 || v == 39 || v == 45))) {
            this.value = this.value.slice(0, -1);
        }
    },
    zip: function (ev) {
        let v = this.value;
        if (v.length == 0) {
            return;
        }
        v = v[v.length - 1].codePointAt(0);
        if (!((v >= 48 && v <= 57))) {
            this.value = this.value.slice(0, -1);
        }
    },
};

let formSwitches = document.querySelectorAll('[data-form]');
for (let i = 0; i < formSwitches.length; i++) {
    formSwitches[i].addEventListener('click', switchForm);
}

let btn = document.querySelector('.form-btn');
btn.addEventListener('click', function () {
    let form = this.closest('.form-item');
    let inputs = form.querySelectorAll('.input-required');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length === 0) {
            inputs[i].classList.add('input-invalid');
        } else {
            inputs[i].classList.remove('input-invalid');
            let msg = inputs[i].closest('.req-field').querySelector('.input-message');
            if (msg) {
                msg.classList.remove('show');
            }
        }
    }
    let invalid = document.querySelector('.input-invalid');
    if (invalid) {
        invalid.focus();
        let msg = invalid.closest('.req-field').querySelector('.input-message');
        if (msg) {
            msg.classList.add('show');
        }
    } else {
        switchForm(null, form.nextElementSibling);
    }
});

let copyInfo = document.querySelector('.copy-info');
copyInfo.addEventListener('click', function () {
    let sameText = document.querySelectorAll('.same');
    let pasteText = document.querySelectorAll('.paste');
    for (let i = 0; i < sameText.length; i++) {
            pasteText[i].value = sameText[i].value;
    }
});

let fn = document.querySelectorAll('.name');
for (let i = 0; i < fn.length; i++) {
    fn[i].addEventListener('input', validate.fullName);
}

let zv = document.querySelectorAll('.numbers');
for (let i = 0; i < zv.length; i++) {
    zv[i].addEventListener('input', validate.zip);
}

let bill = document.querySelector('.billing-btn');
bill.addEventListener('click', function () {
    let form = this.closest('.form-item');
    switchForm(null, form.nextElementSibling);
});

let sbm = document.querySelector('.btn-submit');
sbm.addEventListener('click', function () {
    let shop = document.querySelector('.shop');
    let opa = document.querySelector('.order_summary');
    let thanks = document.querySelector('.thanks');
    let confirm = document.querySelector('.confirm-email');
    let estimate = document.querySelector('.estimate');
    confirm.innerText = document.querySelector('[name="email"]').value;
    thanks.classList.remove('hidden');
    shop.classList.add('hidden');
    opa.classList.add('opa');
    let current = new Date();
    current.setDate(current.getDate() + 30);
    estimate.innerText = current;

});

let print = document.querySelector('.print');
print.addEventListener('click', function () {
    window.print();
});

function switchForm(ev, fObj) {
    let forms = document.querySelectorAll('.forms-inputs>div');
    for (let i = 0; i < forms.length; i++) {
        forms[i].classList.add('hidden');
    }
    let form = null;
    if (fObj) {
        form = fObj;
    } else {
        let formClass = ev.target.getAttribute('data-form');
        form = document.querySelector('.' + formClass);
    }
    if (form) {
        form.classList.remove('hidden');
    }
}




