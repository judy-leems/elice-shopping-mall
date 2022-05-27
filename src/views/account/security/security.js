import * as Api from '/api.js';
import { onlyNumber } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const $userEmailText = document.querySelector('#userEmailText');
const $fullNameInput = document.querySelector('#fullNameInput');
const $passwordInput = document.querySelector('#passwordInput');
const $passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const $postalCodeInput = document.querySelector('#postalCodeInput');
const $address1Input = document.querySelector('#address1Input');
const $address2Input = document.querySelector('#address2Input');
const $phoneInput = document.querySelector('#phoneInput');
const $currentPasswordConfirmInput = document.querySelector(
  '#currentPasswordConfirmInput',
);
const $formInputs = document.querySelectorAll(
  '.account .input, button[data-name]',
);
const $swithCheckboxs = document.querySelectorAll('.switch');
const $modalPassword = document.querySelector('#modal-js-password');
const $postalCodeButton = document.querySelector('#postalCodeButton');
const $submitButton = document.querySelector('#submitButton');
const $submitConfirmButton = document.querySelector('#submitConfirmButton');

addAllElements();
addAllEvents();
userData();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  $swithCheckboxs.forEach((swithCheckbox) => {
    const checkbox = swithCheckbox.querySelector('input');
    checkbox.addEventListener('change', handleSwitch);
  });
  $submitButton.addEventListener('click', handleSubmit);
  $submitConfirmButton.addEventListener('click', handleUserSubmit);
  $postalCodeButton.addEventListener('click', handlePost);
}

function handlePost() {
  new daum.Postcode({
    oncomplete: function (data) {
      $postalCodeInput.value = data.zonecode;
      $address1Input.value = data.address;
      $address2Input.value = data.buildingName;
    },
  }).open();
}

async function userData() {
  try {
    const data = await Api.get('/api/users');
    $userEmailText.insertAdjacentHTML('beforeend', ` (${data.email})`);
    $fullNameInput.value = data.fullName;
    $phoneInput.value = data.phoneNumber;
    $postalCodeInput.value = data.postalCode;
    $address1Input.value = data.address1;
    $address2Input.value = data.address2;
    const isPhoneNumber = data.hasOwnProperty('phoneNumber');
    const isPostalCode = data.hasOwnProperty('postalCode');
    const isAddress1 = data.hasOwnProperty('address1');
    const isAddress2 = data.hasOwnProperty('address2');

    if (!isPhoneNumber) {
      $phoneInput.value = '';
    }

    if (!isPostalCode) {
      $postalCodeInput.value = '';
    }

    if (!isAddress1) {
      $address1Input.value = '';
    }

    if (!isAddress2) {
      $address2Input.value = '';
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleSwitch(e) {
  const checkedToggle = e.target.checked;
  const targetDataName = e.target.dataset.name;
  const targetCheckElement = document.querySelectorAll(
    `input[data-name=${targetDataName}], button[data-name=${targetDataName}]`,
  );
  targetCheckElement.forEach((input) => {
    const typeName = input.getAttribute('type');
    if (checkedToggle) {
      if (typeName !== 'checkbox') {
        input.removeAttribute('disabled');
      }
    } else {
      if (typeName !== 'checkbox') {
        input.setAttribute('disabled', '');
      }
    }
  });
}

function handleSubmit(e) {
  e.preventDefault();

  let fullName = $fullNameInput.value;
  let password = $passwordInput.value;
  let passwordConfirm = $passwordConfirmInput.value;
  let phoneNumber = onlyNumber($phoneInput.value);

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isPhoneValid = phoneNumber.length > 12;

  if (!isFullNameValid) {
    return alert('이름은 2글자 이상이어야 합니다.');
  }

  if (password.length > 0 && !isPasswordValid) {
    return alert('비밀번호는 4글자 이상이어야 합니다.');
  }

  if (password.length > 0 && !isPasswordSame) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  if (phoneNumber.length > 0 && !isPhoneValid) {
    return alert('전화번호 형식이 맞지 않습니다.');
  }

  $modalPassword.classList.add('is-active');
}

async function handleUserSubmit(e) {
  e.preventDefault();

  const fullName = $fullNameInput.value;
  const password = $passwordInput.value;
  const passwordConfirm = $passwordConfirmInput.value;
  const currentPassword = $currentPasswordConfirmInput.value;
  const postalCode = $postalCodeInput.value;
  const address1 = $address1Input.value;
  const address2 = $address2Input.value;
  const phoneNumber = onlyNumber($phoneInput.value);

  const updateData = {
    fullName,
    password,
    passwordConfirm,
    postalCode,
    address1,
    address2,
    phoneNumber,
  };

  try {
    const data = await Api.get('/api/users');
    const password = data.password;
    const isPasswordSame = password === currentPassword;

    console.log(password);
    if (password.length > 0 && !isPasswordSame) {
      return alert('비밀번호가 일치하지 않습니다.');
    }

    if (currentPassword === 'kakao') {
      return alert('kakao');
    }

    await Api.patch('/api/users', '', updateData);
    $modalPassword.classList.remove('is-active');
    $swithCheckboxs.forEach((swithCheckbox) => {
      const checkbox = swithCheckbox.querySelector('input');
      checkbox.checked = false;
    });
    $formInputs.forEach((input) => {
      input.setAttribute('disabled', '');
    });
    $currentPasswordConfirmInput.value = '';
  } catch (err) {
    console.error(err);
    alert(`${err.message}`);
  }
}
