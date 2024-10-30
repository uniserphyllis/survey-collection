const next = document.querySelector('.btn-next');
const previous = document.querySelector('.btn-previous');
const form = document.querySelector('.slide-container');
const slides = document.querySelectorAll(".slide");
let slideNumber = 0;
const url = "ENTER GOOGLE SHEET URL HERE";
const $form = document.querySelector('form');

next.addEventListener('click', () => {
  changePosition("next");
});

previous.addEventListener('click', () => {
  changePosition("previous");
});

// 切換 slide 位置的函數
function changePosition(type) {
  if (type === "next" && slideNumber < slides.length - 1) {
    const form_valid = validateForm(slideNumber);
    if (form_valid) {
      hideError(slideNumber);
      slideNumber += 1;
    } else {
      showError(slideNumber);
    }
  } else if (type === "previous" && slideNumber > 0) {
    slideNumber -= 1;
  }

  updateSlidePosition();
  toggleButtonVisibility();
}

// 更新 slide 的位置
function updateSlidePosition() {
  const pos = slideNumber * -slides[slideNumber].offsetHeight;
  form.style.top = `${pos}px`;
}

// 切換按鈕的顯示狀態
function toggleButtonVisibility() {
  document.querySelector('.btn-next').style.display = slideNumber < slides.length - 1 ? "inline-block" : "none";
  document.querySelector('.btn-previous').style.display = slideNumber > 0 ? "inline-block" : "none";
  document.querySelector('.btn-submit').style.display = slideNumber === slides.length - 1 ? "inline-block" : "none";
}

// 驗證表單，確保所有必填項目已填寫
function validateForm(slideNumber) {
  let form_valid = true;

  // 選取當前 slide 的所有問題
  const questions = slides[slideNumber].querySelectorAll("[data-question]");

  questions.forEach(question => {
    const inputs = question.querySelectorAll("input");
    let question_valid = true;
    let radioChecked = false;
    let checkboxChecked = false;
    let otherInputRequired = false;

    const otherIds = ['role_other', 'brand_other', 'com_real_bp_other']; // 定義多個「其他」選項的 ID

    inputs.forEach(input => {
      if (input.type === "radio") {
        if (input.checked) {
          radioChecked = true;
        }
      } else if (input.type === "checkbox") {
        if (input.checked) {
          checkboxChecked = true;
        }
        // 檢查是否是「其他」選項的 checkbox，且被選中時要求填寫輸入框
        if (otherIds.includes(input.id) && input.checked) {
          otherInputRequired = true;
        }
      } else if (input.type === "email") {
        if (input.value !== "" && !validateEmail(input.value)) {
          question_valid = false;
        }
      } else if (input.type === "text") {
        if (input.classList.contains("other_text_input") && otherInputRequired && input.value.trim() === "") {
          question_valid = false;
        }
      }
    });

    if (Array.from(inputs).some(input => input.type === "radio") && !radioChecked) {
      question_valid = false;
    }

    if (Array.from(inputs).some(input => input.type === "checkbox") && (!checkboxChecked || (otherInputRequired && !question.querySelector(".other_text_input").value.trim()))) {
      question_valid = false;
    }

    if (!question_valid) {
      form_valid = false;
    }
  });

  return form_valid;
}


// 驗證 email 格式
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 顯示和隱藏錯誤消息
function showError(slideNumber) {
  const error = slides[slideNumber].querySelector(".error-message");
  if (error) error.style.display = "block";
}

function hideError(slideNumber) {
  const error = slides[slideNumber].querySelector(".error-message");
  if (error) error.style.display = "none";
}

/// 顯示或隱藏「其他」選項的輸入框
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.text_other').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const otherInput = document.querySelector(`#${this.id}_input`);
      otherInput.style.display = this.checked ? 'inline-block' : 'none';
      if (!this.checked) otherInput.value = ''; // 清空輸入框
    });
  });
});



// 最後一個輸入框控制提交按鈕狀態
const lastInput = document.getElementById('lead_tax_id_input');
if (lastInput) {
  lastInput.addEventListener('keyup', () => {
    document.querySelector('.btn-submit').disabled = lastInput.value === "";
  });
}

// 表單提交
const submit = document.querySelector('.btn-submit');
submit.addEventListener('click', function(e) {
  e.preventDefault();

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([...new FormData($form)])
  }).then(response => {
    if (response.ok) {
      // 顯示感謝填答訊息
      form.innerHTML = "<h2>Thank you! We have received your entry and will get back to you via the email provided.</h2>";

      // 2秒後跳轉到指定的頁面
      setTimeout(() => {
        window.location.href = "https://www.net-chinese.com.tw/nc/index.php/MenuLink/Index/AboutBrandProtection";
      }, 2000);
    } else {
      alert("Submission failed. Please try again.");
    }
  }).catch(() => alert("Network error. Please check your connection."));
});
