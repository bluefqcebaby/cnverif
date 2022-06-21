'use strict'

function testWebP(callback) {

  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

  if (support == true) {
    document.querySelector('body').classList.add('webp');
  } else {
    document.querySelector('body').classList.add('no-webp');
  }
});

const body = document.querySelector('body');
let iter = 0;
//Всплывающее меню
const menus = document.querySelectorAll('#menu');
if (menus.length > 0) {
  for (let i = 0; i < menus.length; i++) {
    let item = menus[i];
    item.addEventListener('click', (e) => {
      if (e.target.closest('#men')) {
        let badItemChilds = Array.from(item.childNodes);
        let itemChilds = badItemChilds.filter(elem => !(elem.classList == undefined));
        for (let j = 0; j < itemChilds.length; j++) {
          let child = itemChilds[j];
          let childClass = child.classList;
          if (childClass.contains('dropdown__menu')) {
            childClass.toggle('dropdown__menu-open');
            body.addEventListener('click', (e) => {
              if (!e.target.closest('.dropdown__menu') && !e.target.closest('.header__menu-cont')){
                childClass.remove('dropdown__menu-open');
              } 
            })
          }
        }
      }
      if (e.target.closest('#lang')) {
        console.log('Привет, должно открыться меню')
        let badItemChilds = Array.from(item.childNodes);
        let itemChilds = badItemChilds.filter(elem => !(elem.classList == undefined))
        console.log(itemChilds)
        for (let j = 0; j < itemChilds.length; j++) {
          let child = itemChilds[j];
          let childClass = child.classList
          if (childClass.contains('dropdown__lang')) {
            childClass.toggle('lang-open')
            body.addEventListener('click', (e) => {
              if (!e.target.closest('.dropdown__lang') && (!e.target.closest('.header__menu-cont'))){
                childClass.remove('lang-open');
              } 
            })
          }
        }
      }
    })
  }
}


//Конец всплывающего меню 

const popupLinks = document.querySelectorAll('.popup__open');
const html = document.querySelector('html');
if (popupLinks.length > 0) {
  for (let item = 0; item < popupLinks.length; item++) {
    const popupLink = popupLinks[item];
    popupLink.addEventListener('click', (e) => {
      e.preventDefault();
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const popupToOpen = document.querySelector('.' + popupName);
      popupOpen(popupToOpen, popupName);
    })
  }
}

function popupOpen(popup, name) {
  let activePopup = document.querySelector('.popup-open')
  if (activePopup) {
    activePopup.classList.remove('popup-open');
  }
  popup.classList.add('popup-open')
  body.style.overflow = 'hidden';
  html.style.overflow = 'hidden';
  popup.addEventListener('click', (e) => {
    if (e.target.classList.contains('close') || !e.target.closest('.' + name + '-container')) { //Свои классы поставить!!!
      popup.classList.remove('popup-open');
      body.style.overflow = 'auto';
      html.style.overflow = 'auto';
    }
  });
};

//Форма

const bigForm = document.querySelector('#bform');
const popupForm = document.querySelector('#pform');
const smallForm = document.querySelector('#sform');
const formFiles = document.querySelector('.feedback__form__file-input');
    //Получаем элемент где будет отображаться инфа о загруженных файлах
const formPreview = document.querySelector('.feedback__form__files-preview');
let filesArr = [];
if (bigForm) {
  formsWork(bigForm, true, 'sendmail.php')
}
if (popupForm) {
  formsWork(popupForm, false, 'sendmail-small.php')
}
if (smallForm) {
  formsWork(smallForm, false, 'sendmail-popup.php')
}

function formsWork(form, check, fileHandler) {
  form.addEventListener('submit', formSend)
  async function formSend(e) {
    e.preventDefault();
    let error = formValidate(form);
    let formData = new FormData(form);
    if (filesArr.length > 0) {
      for (let i = 0; i < filesArr.length; i++) {
        formData.append(`file_${i}`, filesArr[i]);
      }
    }
    if (error === 0) {
      form.classList.add('_sending')
      let response = await fetch(fileHandler, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        let result = await response.json();
        popupOpen(document.querySelector('.popup__thanks'), 'popup__thanks')
        console.log(result)
        if (formPreview){
          formPreview.innerHTML = '';
        }
        form.reset();
        form.classList.remove('_sending');
      } else {
        form.classList.remove('_sending');
        alert('Ошибка');
      }
    } else {
      let allErrorsInput = document.querySelectorAll('._error');
      allErrorsInput[0].scrollIntoView({block: "center", inline: "center"})
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = form.querySelectorAll('._req')
    for (let i = 0; i < formReq.length; i++) {
      const input = formReq[i];
      input.addEventListener('input', ()=>{
        input.classList.remove('_error')
      })
      formRemoveError(input);
      if (input.classList.contains('_email')) {
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else if (input.getAttribute("type") === 'checkbox' && input.checked === false){
          formAddError(input);
          error++;
      } else {
        if (input.value === "") {
          formAddError(input);
          error++;
        }
      }
    }
    return error;
  }
  if (check) {
    if (formFiles) {
      formFiles.addEventListener('change', () => {
        uploadFile(formFiles.files)
      })
    }
    function uploadFile(files) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (!(fileName(file) === 'docx' || fileName(file) === 'jpeg' || fileName(file) === 'pdf' || fileName(file) === 'jpg' || fileName(file) === 'png' || fileName === 'txt')) {
          alert('Разрешены только файлы с расширениями docx, картинки, pdf, txt')
          formFiles.value = '';
          return;
        }
        if (file.size > 3 * 1024 * 1024) {
          alert('Файл должен быть меньше 3 МБ');
          return;
        }
        if (!formPreview.innerHTML.includes(file.name)) {
          formPreview.innerHTML += `<span class='filePreview-span'>${file.name}, </span><br>`;
          filesArr.push(file);
        }
      }
    }
  }
}


function fileName(file) {
  return file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) || file.name;
}

function formAddError(input) {
  input.classList.add('_error')
}

function formRemoveError(input) {
  input.classList.remove('_error')
}

function emailTest(input) {
  return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.value);
}


//Маска на телефонные инпуты
let phoneInputs = document.querySelectorAll('input[data-tel-input]')
for (let item = 0; item < phoneInputs.length; item++) {
  let phoneInput = phoneInputs[item];
  phoneInput.addEventListener('input', onPhoneInput)
  phoneInput.addEventListener('keydown', inputBackspace)
}

function onPhoneInput(e) {
  let input = e.target;
  let inputNumbersValue = getInputNumbersValue(input);
  let formattedInput = '';
  let selectionStart = input.selectionStart;
  if (!inputNumbersValue) {
    return input.value = '+';
  }
  if (input.value.length != selectionStart) {
    if (e.data && /\D/g.test(e.data)) {
      input.value = inputNumbersValue;
    }
    return;
  }
  // if ((['+'].indexOf(inputNumbersValue[0]) > -1) && ((['7'].indexOf(inputNumbersValue[1]) > -1) || (['8'].indexOf(inputNumbersValue[1]) > -1))) {
  if ((['7'].indexOf(inputNumbersValue[0]) > -1) || (['8'].indexOf(inputNumbersValue[0]) > -1)) {
    //if ru
    let firstSymbols = '+7'
    let index = 1;
    formattedInput = firstSymbols + ' ';
    if (inputNumbersValue.length > 1) {
      formattedInput += '(' + inputNumbersValue.substring(1, 4)
    }
    if (inputNumbersValue.length > 4) {
      formattedInput += ') ' + inputNumbersValue.substring(4, 7)
    }
    if (inputNumbersValue.length > 7) {
      formattedInput += '-' + inputNumbersValue.substring(7, 9)
    }
    if (inputNumbersValue.length > 9) {
      formattedInput += '-' + inputNumbersValue.substring(9, 11)
    }
  } else {
    //if not ru
    // return input.value = ((['+'].indexOf(inputNumbersValue[0])) > -1) ? inputNumbersValue.substring(0, 16) : '+' + inputNumbersValue.substring(0, 16)
    return input.value = '+' + inputNumbersValue.substring(0, 16)
  }
  input.value = formattedInput;
}

function getInputNumbersValue(input) {
  if (input.value !== '+') return input.value.replace(/\D/g, "")
  else return
}

function inputBackspace(e) {
  let input = e.target;
  if (e.keyCode == 8 && getInputNumbersValue(input).length == 2) {
    input.value = '';
  }
}


let a = +'str';
let b = +'str';
console.log(a === b)
