// assets/js/custom.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Custom JS loaded");

  const form = document.getElementById("contact-form");
  if (!form) {
    console.warn("contact-form not found");
    return;
  }

  const submitBtn = document.getElementById("contact-submit");
  const phoneInput = document.getElementById("phone");
  const resultsBox = document.getElementById("form-results");
  const averageBox = document.getElementById("form-average");
  const popup = document.getElementById("form-popup");

  const nameInput = form.elements["name"];
  const surnameInput = form.elements["surname"];
  const emailInput = form.elements["email"];
  const addressInput = form.elements["address"];
  const rating1Input = form.elements["rating1"];
  const rating2Input = form.elements["rating2"];
  const rating3Input = form.elements["rating3"];

  // ---------- helpers for error messages ----------
  function getErrorElement(input) {
    let err = input.nextElementSibling;
    if (!err || !err.classList || !err.classList.contains("field-error")) {
      err = document.createElement("div");
      err.className = "field-error";
      input.insertAdjacentElement("afterend", err);
    }
    return err;
  }

  function setError(input, message) {
    const err = getErrorElement(input);
    err.textContent = message;
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  }

  function clearError(input) {
    const err = getErrorElement(input);
    err.textContent = "";
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  // ---------- field validators (Task 1) ----------
  function validateNameField(input) {
    const value = input.value.trim();
    if (!value) {
      setError(input, "This field is required.");
      return false;
    }
    const nameRegex = /^[A-Za-zÀ-ž\s'-]+$/;
    if (!nameRegex.test(value)) {
      setError(input, "Only letters, spaces, - and ' allowed.");
      return false;
    }
    clearError(input);
    return true;
  }

  function validateEmailField(input) {
    const value = input.value.trim();
    if (!value) {
      setError(input, "Email is required.");
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(value)) {
      setError(input, "Please enter a valid email.");
      return false;
    }
    clearError(input);
    return true;
  }

  function validateAddressField(input) {
    const value = input.value.trim();
    if (!value) {
      setError(input, "Address is required.");
      return false;
    }
    if (value.length < 5) {
      setError(input, "Address looks too short.");
      return false;
    }
    clearError(input);
    return true;
  }

  function validateRatingField(input) {
    const num = Number(input.value);
    if (Number.isNaN(num)) {
      setError(input, "Enter a number 1–10.");
      return false;
    }
    if (num < 1 || num > 10) {
      setError(input, "Rating must be between 1 and 10.");
      return false;
    }
    clearError(input);
    return true;
  }

  function validatePhoneField(input) {
    const digits = input.value.replace(/\D/g, "");
    // expecting 3706 + 7 digits (total 11 digits)
    if (digits.length !== 11 || !digits.startsWith("3706")) {
      setError(input, "Use format like +370 6xx xxxxx.");
      return false;
    }
    clearError(input);
    return true;
  }

  // validate all fields, return true/false
  function validateAllFields() {
    const okName = validateNameField(nameInput);
    const okSurname = validateNameField(surnameInput);
    const okEmail = validateEmailField(emailInput);
    const okAddress = validateAddressField(addressInput);
    const okPhone = validatePhoneField(phoneInput);
    const okR1 = validateRatingField(rating1Input);
    const okR2 = validateRatingField(rating2Input);
    const okR3 = validateRatingField(rating3Input);
    return okName && okSurname && okEmail && okAddress && okPhone && okR1 && okR2 && okR3;
  }

  // ---------- phone masking: +370 6xx xxxxx (Task 2) ----------
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      let digits = phoneInput.value.replace(/\D/g, "");

      if (digits.startsWith("370")) {
        digits = digits.slice(3);
      }

      if (digits.length > 0 && digits[0] !== "6") {
        digits = "6" + digits.slice(1);
      }

      digits = digits.slice(0, 8); // 6xx xxxxx

      const part1 = digits.slice(0, 3);
      const part2 = digits.slice(3);

      let formatted = "+370";
      if (part1) formatted += " " + part1;
      if (part2) formatted += " " + part2;

      phoneInput.value = formatted;

      updateSubmitState();
    });
  }

  // ---------- enable/disable submit (Task 3) ----------
  function updateSubmitState() {
    if (!submitBtn) return;
    const isValid = validateAllFields();
    submitBtn.disabled = !isValid;
  }

  // real-time validation listeners (Task 1)
  nameInput.addEventListener("input", () => { validateNameField(nameInput); updateSubmitState(); });
  surnameInput.addEventListener("input", () => { validateNameField(surnameInput); updateSubmitState(); });

  emailInput.addEventListener("input", () => { validateEmailField(emailInput); updateSubmitState(); });
  addressInput.addEventListener("input", () => { validateAddressField(addressInput); updateSubmitState(); });

  rating1Input.addEventListener("input", () => { validateRatingField(rating1Input); updateSubmitState(); });
  rating2Input.addEventListener("input", () => { validateRatingField(rating2Input); updateSubmitState(); });
  rating3Input.addEventListener("input", () => { validateRatingField(rating3Input); updateSubmitState(); });

  if (phoneInput) {
    phoneInput.addEventListener("blur", () => { validatePhoneField(phoneInput); updateSubmitState(); });
  }

  updateSubmitState(); // initial state

  // ---------- submit handler (Task 4, 6) ----------
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateAllFields()) {
      // show errors, do not proceed
      return;
    }

    const data = {
      name: nameInput.value.trim(),
      surname: surnameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      rating1: Number(rating1Input.value),
      rating2: Number(rating2Input.value),
      rating3: Number(rating3Input.value),
    };

    console.log("Contact form data:", data);

    // display below form
    let box = resultsBox;
    if (!box) {
      box = document.createElement("div");
      box.id = "form-results";
      box.className = "mt-4";
      form.insertAdjacentElement("afterend", box);
    }

    box.innerHTML = `
      <p><em>Name:</em> ${data.name}</p>
      <p><em>Surname:</em> ${data.surname}</p>
      <p><em>Email:</em> ${data.email}</p>
      <p><em>Phone number:</em> ${data.phone}</p>
      <p><em>Address:</em> ${data.address}</p>
      <p><em>Content quality:</em> ${data.rating1}</p>
      <p><em>Design:</em> ${data.rating2}</p>
      <p><em>Usability:</em> ${data.rating3}</p>
    `;

    // average + colour code (Task 6)
    const avg = (data.rating1 + data.rating2 + data.rating3) / 3;
    if (averageBox) {
      let color;
      if (avg <= 4) {
        color = "red";
      } else if (avg <= 7) {
        color = "orange";
      } else {
        color = "green";
      }

      averageBox.textContent = `${data.name} ${data.surname}: ${avg.toFixed(1)}`;
      averageBox.style.color = color;
    }

    // success popup
    if (popup) {
      popup.classList.add("show");
      setTimeout(() => {
        popup.classList.remove("show");
      }, 2200);
    }
  });
});

