// Initialize the current card index to 1
let currentCard = 1;

// Define the order in which the cards (questions/pages) will be displayed
let cardOrder = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16];

// Flags to ensure event listeners are attached only once
let pkListenerAttached = false;
let kpListenerAttached = false;

// Object to store the user's selections throughout the form
const userSelections = {
  accountingPackage: null, // Selected accounting package
  hrPackage: null, // Selected HR package
  accountingTypeSelection: null, // Selected accounting type
  selectedInnaOption: false, // Indicates if "Inna" was selected
};

// Arrays to store available package types and packages by type
let availablePackageTypes = [];
let availablePackagesByType = {};

// Wait for the DOM to fully load before executing scripts
document.addEventListener("DOMContentLoaded", function () {
  // Display the first card
  showCard(currentCard);

  // Get references to the "Yes" and "No" options for the employee question
  const employeesYes = document.getElementById("employeesYes");
  const employeesNo = document.getElementById("employeesNo");

  // Attach change event listeners if the elements exist
  if (employeesYes) {
    employeesYes.addEventListener("change", handleEmployeeChange);
  }

  if (employeesNo) {
    employeesNo.addEventListener("change", handleEmployeeChange);
  }

  // Get the form element
  const form = document.getElementById("surveyForm");

  // Check if the form exists before attaching the event listener
  if (form) {
    form.addEventListener("submit", async function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Store a reference to the loading spinner
      const spinner = document.getElementById("loading-spinner");

      // Show the loading spinner if it exists
      if (spinner) {
        spinner.style.display = "block";
      }

      // Remove 'required' attributes from hidden inputs before submission
      removeRequiredFromHiddenInputs();

      // Update user selections with the HR package
      userSelections.hrPackage = getHRPackage();

      // Collect form data
      const formData = new FormData(form);

      try {
        // Send form data to the server using Fetch API
        const response = await fetch("https://formspree.io/f/xpwzvzon", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Form submission failed: ${response.statusText}`);
        }

        const data = await response.json();

        // On success, clear the form and show success message
        form.innerHTML = "";
        displayPurchaseButtons();
      } catch (error) {
        // Display an error message if submission fails
        form.innerHTML =
          '<div class="submission-message">Wystąpił problem z przesłaniem formularza. Prosimy spróbować ponownie później lub zgłosić błąd przesyłając wiadomość na czacie w prawym dolnym rogu.</div>';
        console.error("Form submission error:", error);
      } finally {
        // Hide the loading spinner after form submission completes
        if (spinner) {
          spinner.style.display = "none";
        }
      }
    });
  }
});

// Function to handle changes in the employee question (Yes/No)
function handleEmployeeChange() {
  // If "Yes" is selected, add conditional cards related to employees
  if (this.id === "employeesYes" && this.checked) {
    addConditionalCards();
  }
  // If "No" is selected, remove those conditional cards
  else if (this.id === "employeesNo" && this.checked) {
    removeConditionalCards();
  }
}

// Function to display the current card based on the index 'n'
function showCard(n) {
  const cards = document.querySelectorAll(".card");

  // Hide all cards initially
  cards.forEach(function (card) {
    card.classList.remove("card-active");
  });

  // Get the current card's ID and element
  const currentCardId = "card-" + cardOrder[n - 1];
  const currentCardElement = document.getElementById(currentCardId);

  if (currentCardElement) {
    // Show the current card
    currentCardElement.classList.add("card-active");

    // Initialize specific cards with additional logic
    if (currentCardId === "card-3") {
      initializeAccountingTypeCard();
    }

    if (currentCardId === "card-14" && !pkListenerAttached) {
      initializeDocumentsPKCard();
    }

    if (currentCardId === "card-15" && !kpListenerAttached) {
      initializeDocumentsKPIRCard();
    }

    if (currentCardId === "card-13") {
      displayPackages();
      attachHRPackageListeners();
    }
    if (currentCardId === "card-17") {
      initializeDocumentsSACard();
    }
  }
}

// Function to initialize the accounting type selection card
function initializeAccountingTypeCard() {
  const accountingOptions = document.getElementsByName("Forma księgowości");
  const businessTypeContainer = document.getElementById(
    "businessTypeContainer"
  );
  const businessTypeSelect = document.getElementById("businessType");

  // Get the currently selected accounting type
  const selectedOption = document.querySelector(
    'input[name="Forma księgowości"]:checked'
  );
  if (selectedOption) {
    userSelections.accountingTypeSelection = selectedOption.value;
    // Show/hide business type select based on selection
    if (selectedOption.id === "fullAccounting") {
      businessTypeContainer.style.display = "block";
      businessTypeSelect.setAttribute("required", "required");
    } else {
      businessTypeContainer.style.display = "none";
      businessTypeSelect.removeAttribute("required");
    }
  }

  // Update the description based on the selection
  updateMentzenBezVatDescription();

  // Attach change event listeners to accounting options
  accountingOptions.forEach((option) => {
    option.addEventListener("change", function () {
      userSelections.accountingTypeSelection = this.value;
      // Show/hide business type select based on selection
      if (this.id === "fullAccounting") {
        businessTypeContainer.style.display = "block";
        businessTypeSelect.setAttribute("required", "required");
      } else {
        businessTypeContainer.style.display = "none";
        businessTypeSelect.removeAttribute("required");
        businessTypeSelect.value = ""; // Reset selection when hidden
      }
      updateMentzenBezVatDescription();
    });
  });

  // Add change event listener for business type
  if (businessTypeSelect) {
    businessTypeSelect.addEventListener("change", function () {
      if (userSelections.accountingTypeSelection === "Pełna księgowość") {
        adjustCardsAfterAccountingType();
        currentCard = cardOrder.indexOf(3) + 1;
        showCard(currentCard);
      }
    });
  }
}

// Function to initialize the documents selection for full accounting (PK)
function initializeDocumentsPKCard() {
  const documentsPKSelect = document.getElementById("documents_PK");
  const documentsPKOtherInput = document.getElementById("documents_PK_other");

  if (documentsPKSelect) {
    // Attach change event listener to update description and user selections
    documentsPKSelect.addEventListener("change", function () {
      if (this.value === "Inna") {
        // Show the input field
        documentsPKOtherInput.style.display = "block";
        documentsPKOtherInput.setAttribute("required", "required");
        userSelections.accountingPackage = null;
        userSelections.selectedInnaOption = true;
      } else {
        // Hide the input field
        documentsPKOtherInput.style.display = "none";
        documentsPKOtherInput.removeAttribute("required");
        userSelections.accountingPackage = getAccountingPackage(
          "pk",
          this.value
        );
        userSelections.selectedInnaOption = false;
      }

      updateDescriptionPK(this.value);
    });
    pkListenerAttached = true; // Set flag to true to avoid re-attaching
  }
}

// Function to initialize the documents selection for simplified accounting (KPIR)
function initializeDocumentsKPIRCard() {
  const documentsKPIRSelect = document.getElementById(
    "documents_KPIR_RyczaltzVAT"
  );
  const documentsKPIROtherInput = document.getElementById(
    "documents_KPIR_other"
  );

  if (documentsKPIRSelect) {
    // Attach change event listener to update description and user selections
    documentsKPIRSelect.addEventListener("change", function () {
      if (this.value === "Inna") {
        // Show the input field
        documentsKPIROtherInput.style.display = "block";
        documentsKPIROtherInput.setAttribute("required", "required");
        userSelections.accountingPackage = null;
        userSelections.selectedInnaOption = true;
      } else {
        // Hide the input field
        documentsKPIROtherInput.style.display = "none";
        documentsKPIROtherInput.removeAttribute("required");
        userSelections.accountingPackage = getAccountingPackage(
          "kp",
          this.value
        );
        userSelections.selectedInnaOption = false;
      }

      updateDescriptionKPIR(this.value);
    });
    kpListenerAttached = true; // Set flag to true to avoid re-attaching
  }
}

// Function to initialize the documents selection for SA/PSA accounting
function initializeDocumentsSACard() {
  const documentsSASelect = document.getElementById("documents_SA");
  const documentsSAOtherInput = document.getElementById("documents_SA_other");

  if (documentsSASelect) {
    documentsSASelect.addEventListener("change", function () {
      if (this.value === "Inna") {
        documentsSAOtherInput.style.display = "block";
        documentsSAOtherInput.setAttribute("required", "required");
        userSelections.accountingPackage = null;
        userSelections.selectedInnaOption = true;
      } else {
        documentsSAOtherInput.style.display = "none";
        documentsSAOtherInput.removeAttribute("required");
        userSelections.accountingPackage = getAccountingPackage(
          "sa",
          this.value
        );
        userSelections.selectedInnaOption = false;
      }

      updateDescriptionSA(this.value);
    });
  }
}

// Function to attach event listeners to HR package options
function attachHRPackageListeners() {
  const hrOptions = document.getElementsByName("Obsługa kadrowo-płacowa");
  hrOptions.forEach((option) => {
    option.addEventListener("change", function () {
      userSelections.hrPackage = getHRPackage();
    });
  });
}

// Function to update the description for "Mentzen bez VAT" package
function updateMentzenBezVatDescription() {
  const descriptionDiv = document.getElementById("description_MentzenBezVat");
  if (
    userSelections.accountingTypeSelection ===
    "Ryczałt od przychodów ewidencjonowanych bez VAT"
  ) {
    // If the selected accounting type is "Ryczałt bez VAT", display the description
    displayMentzenBezVatDescription();
    userSelections.accountingPackage = {
      name: "Mentzen bez VAT",
      subscriptionId: 295,
    };
    userSelections.selectedInnaOption = false;
  } else {
    // Otherwise, clear the description and reset the accounting package
    if (descriptionDiv) {
      descriptionDiv.innerHTML = "";
    }
    userSelections.accountingPackage = null;
  }
}

// Function to display the detailed description of "Mentzen bez VAT" package
function displayMentzenBezVatDescription() {
  const descriptionDiv = document.getElementById("description_MentzenBezVat");
  if (descriptionDiv) {
    descriptionDiv.innerHTML = `
      <h3>Mentzen bez VAT</h3>
      <ul>
        <li>prowadzenie księgowości dla Ryczałtu bez VAT,</li>
        <li>automatyczne płatności,</li>
        <li>dostęp do platformy umożliwiającej przekazywanie dokumentów,</li>
        <li>dostęp do danych raportowych takich jak podatki, wynagrodzenia, ewidencja VAT,</li>
        <li>powiadomienia SMS o zbliżających się terminach płatności podatków itp.,</li>
        <li>dostęp do szablonów umów,</li>
        <li>wsparcie w kontrolach podatkowych,</li>
        <li>newsletter podatkowy,</li>
        <li>dostęp do webinarów.</li>
      </ul>
      <div class="Description-Recurring-Interval">
        <p>Pakiet miesięczny</p>
      </div>
      <div class="Description-Price-Container">
        <p>270 zł netto</p>
      </div>
    `;
  }
}

// Function to update the description for the selected SA package
function updateDescriptionSA(selectedValue) {
  let descriptionText = "";
  const descriptionSA = document.getElementById("description_SA");
  if (selectedValue && saPackages[selectedValue] && selectedValue !== "Inna") {
    const packageInfo = saPackages[selectedValue];
    const numberOfDocuments = packageInfo.numberOfDocuments;
    const packagePrice = packageInfo.price;

    descriptionText = `
      <h3>Potężny Mentzen ${numberOfDocuments}</h3>
      <ul>
        <li>prowadzenie księgowości Spółki akcyjnej lub Prostej spółki akcyjnej,</li>
        <li>pakiet dotyczy max. ${numberOfDocuments} faktur miesięcznie,</li>
        <li>nielimitowane konsultacje podatkowe,</li>
        <li>automatyczne płatności,</li>
        <li>dostęp do platformy umożliwiającej przekazywanie dokumentów,</li>
        <li>dostęp do danych raportowych takich jak podatki, wynagrodzenia, ewidencja VAT,</li>
        <li>powiadomienia SMS o zbliżających się terminach płatności podatków itp.,</li>
        <li>dostęp do szablonów umów,</li>
        <li>wsparcie w kontrolach podatkowych,</li>
        <li>newsletter podatkowy,</li>
        <li>dostęp do webinarów.</li>
      </ul>
      <div class="Description-Recurring-Interval">
        <p>Pakiet miesięczny</p>
      </div>
      <div class="Description-Price-Container">
        <p>${packagePrice}</p>
      </div>
    `;
  }

  if (descriptionSA) {
    descriptionSA.innerHTML = descriptionText;
  }
}

// Function to navigate to the next or previous card
function nextPrev(n) {
  const currentCardId = "card-" + cardOrder[currentCard - 1];
  const currentCardElement = document.getElementById(currentCardId);

  // Validate the current card before moving forward
  if (n === 1) {
    if (!validateForm(currentCardElement)) {
      return false;
    }
  }

  // Adjust the card order based on the accounting type selection
  if (currentCard === cardOrder.indexOf(3) + 1 && n === 1) {
    adjustCardsAfterAccountingType();
  }
  if (currentCard === cardOrder.indexOf(4) + 1 && n === -1) {
    // Remove cards 14 and 15 if going back from card 4
    cardOrder = cardOrder.filter(
      (card) => card !== 14 && card !== 15 && card !== 17
    );
    pkListenerAttached = false;
    kpListenerAttached = false;
    userSelections.accountingPackage = null;
    userSelections.selectedInnaOption = false;
  }

  // Update the current card index
  currentCard += n;

  // Ensure the current card index stays within bounds
  if (currentCard < 1) {
    currentCard = 1;
  } else if (currentCard > cardOrder.length) {
    currentCard = cardOrder.length;
  }

  // Display the new current card
  showCard(currentCard);
}

// Function to validate required fields in the current card
function validateForm(cardElement) {
  let valid = true;
  let errorMessage = "";

  // Select all required inputs, selects, and textareas in the current card
  const requiredFields = cardElement.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );

  requiredFields.forEach(function (field) {
    if (field.type === "radio") {
      // For radio buttons, check if any option is selected
      const radioGroup = cardElement.querySelectorAll(
        `input[name="${field.name}"]`
      );
      const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
      if (!isChecked) {
        valid = false;
        addInvalidClass(radioGroup);
      }
    } else if (!field.value) {
      // For other inputs, check if the value is empty
      valid = false;
      addInvalidClass([field]);
    } else {
      // For the specific inputs, check if value is at least min
      if (
        (field.id === "documents_PK_other" ||
          field.id === "documents_KPIR_other") &&
        field.style.display !== "none"
      ) {
        const minValue = parseInt(field.getAttribute("min"));
        const fieldValue = parseInt(field.value);
        if (fieldValue < minValue) {
          valid = false;
          addInvalidClass([field]);
          errorMessage = `Proszę podać wartość nie mniejszą niż ${minValue}`;
        }
      }
      // Remove 'invalid' class if the field is valid
      if (valid) {
        field.classList.remove("invalid");
      }
    }
  });

  if (!valid) {
    // Show error message if validation fails
    if (!errorMessage) {
      errorMessage = "Udziel odpowiedzi, aby kontynuować";
    }
    showErrorMessage(cardElement, errorMessage);
  } else {
    // Hide error message if validation passes
    hideErrorMessage(cardElement);
  }

  return valid;
}

// Function to add 'invalid' class to fields and attach event listeners
function addInvalidClass(elements) {
  elements.forEach((element) => {
    element.classList.add("invalid");
    element.addEventListener("input", removeInvalidClass);
    element.addEventListener("change", removeInvalidClass);
  });
}

// Function to remove 'invalid' class when the user corrects the input
function removeInvalidClass(event) {
  const element = event.target;
  element.classList.remove("invalid");
  const cardElement = element.closest(".card");
  const invalidElements = cardElement.querySelectorAll(".invalid");
  if (invalidElements.length === 0) {
    hideErrorMessage(cardElement);
  }
}

// Function to display an error message in the current card
function showErrorMessage(cardElement, message) {
  let errorMessageDiv = cardElement.querySelector(".error-message");
  if (!errorMessageDiv) {
    // Create an error message div if it doesn't exist
    errorMessageDiv = document.createElement("div");
    errorMessageDiv.classList.add("error-message");
    cardElement.insertBefore(errorMessageDiv, cardElement.firstChild);
  }
  errorMessageDiv.innerHTML = message;
  errorMessageDiv.style.display = "inline-block";
}

// Function to hide the error message in the current card
function hideErrorMessage(cardElement) {
  const errorMessageDiv = cardElement.querySelector(".error-message");
  if (errorMessageDiv) {
    errorMessageDiv.style.display = "none";
  }
}

// Function to adjust the card order after selecting an accounting type
function adjustCardsAfterAccountingType() {
  cardOrder = cardOrder.filter(
    (card) => card !== 14 && card !== 15 && card !== 17
  );

  const accountingType = document.querySelector(
    'input[name="Forma księgowości"]:checked'
  )?.value;
  const businessType = document.getElementById("businessType")?.value;

  const index = cardOrder.indexOf(3) + 1;

  // Remove 'required' attributes from inputs
  document.getElementById("documents_PK").removeAttribute("required");
  document
    .getElementById("documents_KPIR_RyczaltzVAT")
    .removeAttribute("required");
  document.getElementById("documents_SA").removeAttribute("required");

  if (accountingType === "Pełna księgowość") {
    if (["Spółka akcyjna", "Prosta spółka akcyjna"].includes(businessType)) {
      cardOrder.splice(index, 0, 17);
      document
        .getElementById("documents_SA")
        .setAttribute("required", "required");
    } else if (businessType) {
      cardOrder.splice(index, 0, 14);
      document
        .getElementById("documents_PK")
        .setAttribute("required", "required");
    }
  } else if (
    accountingType === "KPiR lub Ryczałt od przychodów ewidencjonowanych z VAT"
  ) {
    cardOrder.splice(index, 0, 15);
    document
      .getElementById("documents_KPIR_RyczaltzVAT")
      .setAttribute("required", "required");
  }
}

// Function to add conditional cards when the user has employees
function addConditionalCards() {
  if (!cardOrder.includes(12)) {
    // Insert cards 12 and 13 after card 11
    const index = cardOrder.indexOf(11) + 1;
    cardOrder.splice(index, 0, 12, 13);

    // Add 'required' attributes to inputs in cards 12 and 13
    document
      .getElementById("employeeCount")
      .setAttribute("required", "required");
    document
      .getElementById("civilContractCount")
      .setAttribute("required", "required");
    const hrOptions = document.getElementsByName("Obsługa kadrowo-płacowa");
    hrOptions.forEach((option) => {
      option.setAttribute("required", "required");
    });
  }
}

// Function to remove conditional cards when the user has no employees
function removeConditionalCards() {
  // Remove cards 12 and 13 from the card order
  cardOrder = cardOrder.filter((card) => card !== 12 && card !== 13);
  if (currentCard > cardOrder.length) {
    currentCard = cardOrder.length;
  }
  showCard(currentCard);

  // Remove 'required' attributes from inputs in cards 12 and 13
  document.getElementById("employeeCount").removeAttribute("required");
  document.getElementById("civilContractCount").removeAttribute("required");
  const hrOptions = document.getElementsByName("Obsługa kadrowo-płacowa");
  hrOptions.forEach((option) => {
    option.removeAttribute("required");
  });
}

// Function to remove 'required' attributes from hidden inputs before form submission
function removeRequiredFromHiddenInputs() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    const cardId = parseInt(card.id.replace("card-", ""));
    if (!cardOrder.includes(cardId)) {
      // Remove 'required' from inputs in cards that are not in the current card order
      const inputs = card.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        input.removeAttribute("required");
      });
    } else {
      // Remove 'required' from hidden inputs in visible cards
      const inputs = card.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        if (input.style.display === "none") {
          input.removeAttribute("required");
        }
      });
    }
  });
}

// Object containing data for full accounting (Pełna Księgowość) packages
const pkPackages = {
  "do 20 dokumentów": {
    numberOfDocuments: "20",
    price: "1380 zł netto",
    subscriptionId: 273,
  },
  "21 - 40 dokumentów": {
    numberOfDocuments: "40",
    price: "1720 zł netto",
    subscriptionId: 274,
  },
  "41 - 60 dokumentów": {
    numberOfDocuments: "60",
    price: "2070 zł netto",
    subscriptionId: 275,
  },
  "61 - 80 dokumentów": {
    numberOfDocuments: "80",
    price: "2300 zł netto",
    subscriptionId: 276,
  },
  "81 - 100 dokumentów": {
    numberOfDocuments: "100",
    price: "2530 zł netto",
    subscriptionId: 277,
  },
  "101 - 120 dokumentów": {
    numberOfDocuments: "120",
    price: "2760 zł netto",
    subscriptionId: 278,
  },
  "121 - 140 dokumentów": {
    numberOfDocuments: "140",
    price: "2990 zł netto",
    subscriptionId: 279,
  },
  "141 - 160 dokumentów": {
    numberOfDocuments: "160",
    price: "3220 zł netto",
    subscriptionId: 280,
  },
  "161 - 180 dokumentów": {
    numberOfDocuments: "180",
    price: "3450 zł netto",
    subscriptionId: 281,
  },
  Inna: {
    numberOfDocuments: "Inna",
    price: null,
    subscriptionId: null,
  },
};

// Object containing data for simplified accounting (KPiR/Ryczałt z VAT) packages
const kpPackages = {
  "do 10 dokumentów": {
    numberOfDocuments: "10",
    price: "380 zł netto",
    subscriptionId: 282,
  },
  "11-30 dokumentów": {
    numberOfDocuments: "30",
    price: "480 zł netto",
    subscriptionId: 283,
  },
  "31-50 dokumentów": {
    numberOfDocuments: "50",
    price: "580 zł netto",
    subscriptionId: 284,
  },
  "51-70 dokumentów": {
    numberOfDocuments: "70",
    price: "680 zł netto",
    subscriptionId: 285,
  },
  "71-90 dokumentów": {
    numberOfDocuments: "90",
    price: "800 zł netto",
    subscriptionId: 286,
  },
  "91-110 dokumentów": {
    numberOfDocuments: "110",
    price: "920 zł netto",
    subscriptionId: 287,
  },
  "111-130 dokumentów": {
    numberOfDocuments: "130",
    price: "1040 zł netto",
    subscriptionId: 288,
  },
  "131-150 dokumentów": {
    numberOfDocuments: "150",
    price: "1160 zł netto",
    subscriptionId: 289,
  },
  "151-170 dokumentów": {
    numberOfDocuments: "170",
    price: "1280 zł netto",
    subscriptionId: 290,
  },
  "171-190 dokumentów": {
    numberOfDocuments: "190",
    price: "1400 zł netto",
    subscriptionId: 291,
  },
  "191-210 dokumentów": {
    numberOfDocuments: "210",
    price: "1520 zł netto",
    subscriptionId: 292,
  },
  "211-230 dokumentów": {
    numberOfDocuments: "230",
    price: "1650 zł netto",
    subscriptionId: 293,
  },
  "231-250 dokumentów": {
    numberOfDocuments: "250",
    price: "1770 zł netto",
    subscriptionId: 294,
  },
  Inna: {
    numberOfDocuments: "Inna",
    price: null,
    subscriptionId: null,
  },
};

// Object containing data for SA/PSA accounting packages
const saPackages = {
  "do 20 dokumentów": {
    numberOfDocuments: "20",
    price: "2990 zł netto",
    subscriptionId: 95,
  },
  "21 - 40 dokumentów": {
    numberOfDocuments: "40",
    price: "3910 zł netto",
    subscriptionId: 96,
  },
  Inna: {
    numberOfDocuments: "Inna",
    price: null,
    subscriptionId: null,
  },
};

// Function to update the description for the selected PK package
function updateDescriptionPK(selectedValue) {
  let descriptionText = "";
  const descriptionPK = document.getElementById("description_PK");
  if (selectedValue && pkPackages[selectedValue] && selectedValue !== "Inna") {
    const packageInfo = pkPackages[selectedValue];
    const numberOfDocuments = packageInfo.numberOfDocuments;
    const packagePrice = packageInfo.price;

    // Construct the description text using template literals
    descriptionText = `
      <h3>Szeroki Mentzen ${numberOfDocuments}</h3>
      <ul>
        <li>prowadzenie księgowości w formie Ksiąg Rachunkowych,</li>
        <li>pakiet dotyczy max. ${numberOfDocuments} dokumentów miesięcznie,</li>
        <li>nielimitowane konsultacje podatkowe,</li>
        <li>automatyczne płatności,</li>
        <li>dostęp do platformy umożliwiającej przekazywanie dokumentów,</li>
        <li>dostęp do danych raportowych takich jak podatki, wynagrodzenia, ewidencja VAT,</li>
        <li>powiadomienia SMS o zbliżających się terminach płatności podatków itp.,</li>
        <li>dostęp do szablonów umów,</li>
        <li>wsparcie w kontrolach podatkowych,</li>
        <li>newsletter podatkowy,</li>
        <li>dostęp do webinarów.</li>
      </ul>
      <div class="Description-Recurring-Interval">
        <p>Pakiet miesięczny</p>
      </div>
      <div class="Description-Price-Container">
        <p>${packagePrice}</p>
      </div>
    `;
  }

  if (descriptionPK) {
    // Update the HTML content with the description
    descriptionPK.innerHTML = descriptionText;
  }
}

// Function to update the description for the selected KPIR package
function updateDescriptionKPIR(selectedValue) {
  let descriptionText = "";
  const descriptionKPIR = document.getElementById("description_KPIR");
  if (selectedValue && kpPackages[selectedValue] && selectedValue !== "Inna") {
    const packageInfo = kpPackages[selectedValue];
    const numberOfDocuments = packageInfo.numberOfDocuments;
    const packagePrice = packageInfo.price;

    // Construct the description text using template literals
    descriptionText = `
      <h3>Uproszczony Mentzen ${numberOfDocuments}</h3>
      <ul>
        <li>prowadzenie księgowości w formie Księgi Przychodów i Rozchodów lub dla Ryczałtu z VATem,</li>
        <li>pakiet dotyczy max. ${numberOfDocuments} dokumentów miesięcznie,</li>
        <li>nielimitowane konsultacje podatkowe,</li>
        <li>dostęp do platformy umożliwiającej przekazywanie dokumentów,</li>
        <li>dostęp do danych raportowych takich jak podatki, wynagrodzenia, ewidencja VAT,</li>
        <li>powiadomienia SMS o zbliżających się terminach płatności podatków itp.,</li>
        <li>dostęp do szablonów umów,</li>
        <li>wsparcie w kontrolach podatkowych,</li>
        <li>newsletter podatkowy,</li>
        <li>dostęp do webinarów.</li>
      </ul>
      <div class="Description-Recurring-Interval">
        <p>Pakiet miesięczny</p>
      </div>
      <div class="Description-Price-Container">
        <p>${packagePrice}</p>
      </div>
    `;
  }

  if (descriptionKPIR) {
    // Update the HTML content with the description
    descriptionKPIR.innerHTML = descriptionText;
  }
}

// Function to get the accounting package based on type and selected value
function getAccountingPackage(type, selectedValue) {
  if (type === "pk" && pkPackages[selectedValue] && selectedValue !== "Inna") {
    const packageInfo = pkPackages[selectedValue];
    return {
      name: `Szeroki Mentzen ${packageInfo.numberOfDocuments}`,
      subscriptionId: packageInfo.subscriptionId,
    };
  } else if (
    type === "kp" &&
    kpPackages[selectedValue] &&
    selectedValue !== "Inna"
  ) {
    const packageInfo = kpPackages[selectedValue];
    return {
      name: `Uproszczony Mentzen ${packageInfo.numberOfDocuments}`,
      subscriptionId: packageInfo.subscriptionId,
    };
  } else if (
    type === "sa" &&
    saPackages[selectedValue] &&
    selectedValue !== "Inna"
  ) {
    const packageInfo = saPackages[selectedValue];
    return {
      name: `Potężny Mentzen ${packageInfo.numberOfDocuments}`,
      subscriptionId: packageInfo.subscriptionId,
    };
  } else {
    return null;
  }
}

// Function to display available HR packages based on user inputs
function displayPackages() {
  // Get the number of employees and civil contracts from the inputs
  const employeeCount =
    parseInt(document.getElementById("employeeCount")?.value) || 0;
  const civilContractCount =
    parseInt(document.getElementById("civilContractCount")?.value) || 0;

  // Calculate totals for different package variants
  const variant1Total = employeeCount * 2 + civilContractCount;
  const variant2Total = employeeCount + civilContractCount;

  const packagesContainer = document.getElementById("packagesContainer");

  // Get packages based on the calculated totals
  const package1 = getPackageForTotal(variant1Total);
  const package2 = getPackageForTotal(variant2Total);

  const packagesToDisplay = [];
  availablePackageTypes = [];
  availablePackagesByType = {};

  // Logic to determine which packages to display based on user input
  if (!package1 && !package2) {
    packagesContainer.innerHTML =
      '<p style="margin-bottom: 20px;">W celu uzyskania indywidualnej wyceny prosimy o kontakt z działem administracji: <a href="mailto:ksiegowosc@mentzen.pl">ksiegowosc@mentzen.pl</a></p>';
    return;
  }

  if (!package1 && package2 && variant1Total > 50 && variant2Total <= 50) {
    packagesToDisplay.push({
      package: package2,
      labels: ["Pakiet płacowy"],
    });

    availablePackageTypes.push("Płace");
    availablePackagesByType["Płace"] = package2;

    packagesToDisplay.push({
      package: null,
      labels: ["Pakiet kadrowo-płacowy"],
      message:
        'W celu uzyskania indywidualnej wyceny dla pakietu kadrowo-płacowego, prosimy o kontakt z działem administracji: <a href="mailto:ksiegowosc@mentzen.pl">ksiegowosc@mentzen.pl</a>',
    });
  } else {
    if (package1 && package2 && package1.name === package2.name) {
      packagesToDisplay.push({
        package: package1,
        labels: ["Pakiet kadrowo-płacowy", "Pakiet płacowy"],
      });
      availablePackageTypes.push("Kadry i płace");
      availablePackageTypes.push("Płace");
      availablePackagesByType["Kadry i płace"] = package1;
      availablePackagesByType["Płace"] = package1;
    } else {
      if (package1) {
        packagesToDisplay.push({
          package: package1,
          labels: ["Pakiet kadrowo-płacowy"],
        });
        availablePackageTypes.push("Kadry i płace");
        availablePackagesByType["Kadry i płace"] = package1;
      }
      if (package2) {
        packagesToDisplay.push({
          package: package2,
          labels: ["Pakiet płacowy"],
        });
        availablePackageTypes.push("Płace");
        availablePackagesByType["Płace"] = package2;
      }
    }
  }

  // Generate HTML content for the packages to display
  let packagesHTML = "";

  packagesHTML += '<div class="packages-row">';

  packagesToDisplay.forEach((item) => {
    const labelsText = item.labels.join(", ");
    if (item.package) {
      packagesHTML += `
        <div class="package-name">
          <h4>${item.package.name}</h4>
          <p><strong>${labelsText}</strong></p>
          <p><strong>Cena netto:</strong> ${item.package.price} zł miesięcznie</p>
        </div>
      `;
    } else {
      packagesHTML += `
        <div class="package-name">
          <h4>${item.labels[0]}</h4>
          <p>${item.message}</p>
        </div>
      `;
    }
  });

  packagesHTML += "</div>";

  // Add a common description for the packages
  packagesHTML += `
    <div class="common-description">
      <p><strong>Pakiet płacowy obejmuje</strong> przede wszystkim comiesięczne naliczanie wynagrodzeń, przygotowywanie list wynagrodzeń, rozliczanie się z ZUS-em i Urzędem Skarbowym.</p>
      <p><strong>Pakiet kadrowo-płacowy dodatkowo obejmuje</strong> m.in. ewidencjonowanie urlopów, kontrolowanie ważności badań lekarskich i szkoleń BHP, przygotowywanie dokumentów pracowniczych niezbędnych do rozpoczęcia stosunku pracy jak i zakończenia (np. umowa o pracę, świadectwo pracy) oraz prowadzenie akt osobowych (opcjonalnie).</p>
    </div>
  `;

  packagesContainer.innerHTML = packagesHTML;

  // Attach event listeners to the HR package options
  attachHRPackageListeners();

  // Update the user selections with the HR package
  userSelections.hrPackage = getHRPackage();
}

// Function to get the appropriate package based on the total count
function getPackageForTotal(total) {
  for (const pkg of packages) {
    if (total >= pkg.min && total <= pkg.max) {
      return pkg;
    }
  }
  return null;
}

// Function to get the selected HR package based on user choice
function getHRPackage() {
  const selectedOption = document.querySelector(
    'input[name="Obsługa kadrowo-płacowa"]:checked'
  );
  if (!selectedOption) return null;

  const selectedLabel = selectedOption.value;

  if (selectedLabel === "Brak zainteresowania") {
    return null;
  }

  if (!availablePackageTypes.includes(selectedLabel)) {
    return null;
  }

  const selectedPackage = availablePackagesByType[selectedLabel];
  if (!selectedPackage) return null;

  return {
    name: selectedPackage.name,
    subscriptionId: selectedPackage.subscriptionId,
    packageType: selectedLabel,
  };
}

// Array containing data for HR packages
const packages = [
  {
    min: 1,
    max: 1,
    name: "Kadry Mentzena 1",
    price: 70,
    subscriptionId: 301,
  },
  {
    min: 2,
    max: 2,
    name: "Kadry Mentzena 2",
    price: 140,
    subscriptionId: 297,
  },
  {
    min: 3,
    max: 4,
    name: "Kadry Mentzena 3-4",
    price: 280,
    subscriptionId: 298,
  },
  {
    min: 5,
    max: 6,
    name: "Kadry Mentzena 5-6",
    price: 420,
    subscriptionId: 299,
  },
  {
    min: 7,
    max: 8,
    name: "Kadry Mentzena 7-8",
    price: 560,
    subscriptionId: 300,
  },
  {
    min: 9,
    max: 10,
    name: "Kadry Mentzena 9-10",
    price: 700,
    subscriptionId: 302,
  },
  {
    min: 11,
    max: 20,
    name: "Kadry Mentzena 11-20",
    price: 1050,
    subscriptionId: 303,
  },
  {
    min: 21,
    max: 30,
    name: "Kadry Mentzena 21-30",
    price: 1750,
    subscriptionId: 304,
  },
  {
    min: 31,
    max: 40,
    name: "Kadry Mentzena 31-40",
    price: 2450,
    subscriptionId: 305,
  },
  {
    min: 41,
    max: 50,
    name: "Kadry Mentzena 41-50",
    price: 3150,
    subscriptionId: 306,
  },
];

// Function to display purchase buttons after form submission
function displayPurchaseButtons() {
  const formContainer = document.querySelector(".Mentzen-prime-survey-wrapper");
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("submission-message");
  messageContainer.innerHTML = `
    <h2>Dziękujemy za wypełnienie ankiety!</h2>
    <p>Zostałeś dodany do listy rezerwowej. Skontaktujemy się z Tobą, gdy tylko będziemy mogli przyjąć nowych klientów.</p>
  `;
  formContainer.appendChild(messageContainer);
}
