let resultData;

fetch("http://localhost:3000/data")
  .then((res) => {
    if (res.ok) return res.json();
    throw new Error("something bad happened");
  })
  .then((data) => {
    resultData = data;
    // Updatethemessage();
    console.log(resultData[1].title);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

var helpRequested = false;
var selectingCompany = false;
var selectingProduct = false;
var selectedPhoneOptionIndex = 0;
var selectedCompanyIndex = 0;
var selectedPeriod = 0;

// function Updatethemessage() {
//   if (!resultData) return; // Ensure resultData is available
//   // options.deals.message =
//   //   resultData[1].title +
//   //   resultData[1].body +
//   //   resultData[1].body2 +
//   //   resultData[1].body3;
//   options["call us"].message = resultData[1].body;
// }

const companies = [
  {
    id: 1,
    name: "Apple",
    products: [
      { name: "iPhone", price: "999 KD" },
      { name: "iPad", price: "799 KD" },
      { name: "MacBook", price: "1299 KD" },
    ],
  },
  {
    id: 2,
    name: "Samsung",
    products: [
      { name: "Galaxy S", price: "899 KD" },
      { name: "Galaxy Tab", price: "499 KD" },
      { name: "Galaxy Book", price: "1099 KD" },
    ],
  },
  {
    id: 3,
    name: "Huawei",
    products: [
      { name: "Huawei P", price: "699 KD" },
      { name: "MatePad", price: "399 KD" },
      { name: "MateBook", price: "999 KD" },
    ],
  },
  {
    id: 4,
    name: "Google",
    products: [
      { name: "Pixel", price: "799 KD" },
      { name: "Pixelbook", price: "999 KD" },
      { name: "Nest Hub", price: "299 KD" },
    ],
  },
];

const options = [
  {
    id: 1,
    name: "call us",
    selected: false,
    message: `<a href="tel:+96512345678">+965 12345678</>`,
  },
  {
    id: 2,
    name: "deals",
    selected: false,
    message: "Bot: These are the deals we have.",
  },
  {
    id: 3,
    name: "promotions",
    selected: false,
    message: "Bot: These are the promotions we have.",
  },
  {
    id: 4,
    name: "installment",
    selected: false,
    message: "Bot: Please select a company first.",
  },
];

function calculateInstallment(phoneOptionIndex, period, salary) {
  if (phoneOptionIndex < 1 || phoneOptionIndex > companies.length) {
    return "Bot: Invalid phone option.";
  }

  const selectedCompany = companies[selectedCompanyIndex];
  const products = selectedCompany.products;

  if (
    selectedPhoneOptionIndex < 0 ||
    selectedPhoneOptionIndex >= products.length
  ) {
    return "Bot: Invalid product option.";
  }

  const selectedProduct = products[selectedPhoneOptionIndex];
  const optionName = selectedProduct.name;
  const price = parseFloat(selectedProduct.price.replace(" KD", ""));
  const monthlyPayment = (price / period).toFixed(2);

  if (salary < 200) {
    return "Bot: Sorry, your salary is too low to afford any phone option.";
  }

  return `
    Bot: Option: ${optionName} <br>
    Price: ${price} KD <br>
    Monthly payment for ${period} months: ${monthlyPayment} KD\n <br>
  `;
}

document.addEventListener("keypress", handleKeyPress);

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    sendMessage();
  }
}

function sendMessage() {
  var userInput = document
    .getElementById("user-input")
    .value.trim()
    .toLowerCase();
  if (userInput === "") {
    return;
  }

  var chatBox = document.getElementById("chat-box");
  var userMessageDiv = document.createElement("div");
  userMessageDiv.className = "user-message";
  userMessageDiv.innerHTML = userInput;
  chatBox.appendChild(userMessageDiv);
  document.getElementById("user-input").value = "";

  if (!helpRequested && userInput !== "help") {
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML =
      "<strong>Bot: Please send 'help' to see the options.</strong>";
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  if (userInput === "help") {
    helpRequested = true;
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML =
      resultData[0].title +
      resultData[0].body +
      resultData[0].body2 +
      resultData[0].body3 +
      resultData[0].body4;
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  //////////////////////////////////

  if (helpRequested) {
    // Handle options if help has been requested
    var selectedOption = options.find(
      (option) => option.name === userInput && !option.selected
    );
    if (selectedOption) {
      if (userInput === "installment" || parseInt(userInput) === 4) {
        selectingCompany = true;
        var companyListMessage =
          "<strong>Bot: Please select a company:\n</strong> <br>";
        companies.forEach((company, index) => {
          companyListMessage += `${index + 1}. ${company.name}\n <br>`;
        });
        var botMessageDiv = document.createElement("div");
        botMessageDiv.className = "bot-message";
        botMessageDiv.innerHTML = companyListMessage;
        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
      } else {
        var botMessageDiv = document.createElement("div");
        botMessageDiv.className = "bot-message";
        botMessageDiv.innerHTML = selectedOption.message;
        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
      }
    }

    // If the user input is a number, select the option accordingly
    if (selectingCompany) {
      var optionIndex = parseInt(userInput);
      if (optionIndex >= 1 && optionIndex <= companies.length) {
        selectedCompanyIndex = optionIndex - 1;
        selectingCompany = false;

        // Display products of the selected company
        var selectedCompany = companies[selectedCompanyIndex];
        var companyProductMessage = `<strong>Bot: Products of ${selectedCompany.name}:\n</strong> <br>`;
        selectedCompany.products.forEach((product, index) => {
          companyProductMessage += `${index + 1}. ${product.name} - ${
            product.price
          }\n <br>`;
        });
        var botMessageDiv = document.createElement("div");
        botMessageDiv.className = "bot-message";
        botMessageDiv.innerHTML = companyProductMessage;
        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Set selectingProduct to true after displaying products
        selectingProduct = true;
        return;
      } else {
        // User input is not a valid company index
        var botMessageDiv = document.createElement("div");
        botMessageDiv.className = "bot-message";
        botMessageDiv.innerHTML =
          "Bot: Please select a valid company number from the list.";
        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
      }
      return;
    }
  }

  // Handle product selection
  if (selectingProduct) {
    var productIndex = parseInt(userInput);
    if (
      productIndex >= 1 &&
      productIndex <= companies[selectedCompanyIndex].products.length
    ) {
      selectedPhoneOptionIndex = productIndex - 1;
      selectingProduct = false; // Set selectingProduct to false after product selection
      // Continue with installment options
      var product =
        companies[selectedCompanyIndex].products[selectedPhoneOptionIndex];
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = `Bot: Please select the installment duration (6, 12, 24 months) for ${product.name} (${product.price}):`;
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    } else {
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = "Bot: Please select a valid product number.";
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }
  }

  if (
    selectedCompanyIndex !== 0 &&
    selectedPhoneOptionIndex !== 0 &&
    !selectedPeriod &&
    (userInput === "6" || userInput === "12" || userInput === "24")
  ) {
    selectedPeriod = parseInt(userInput);
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML = "Bot: Please enter your salary:";
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  if (
    selectedCompanyIndex &&
    selectedPhoneOptionIndex &&
    selectedPeriod &&
    !isNaN(userInput)
  ) {
    var salary = parseFloat(userInput);
    var installmentMessage = calculateInstallment(
      selectedPhoneOptionIndex,
      selectedPeriod,
      salary
    );
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML = installmentMessage;
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    // Reset all conversation variables after sending salary info
    selectedCompanyIndex = 0;
    selectedPhoneOptionIndex = 0;
    selectedPeriod = 0;
    helpRequested = false; // Reset help flag as well
    // Reset the 'selected' property of all options to false
    options.forEach((option) => {
      option.selected = false;
    });
    return;
  }

  //////////////////////////////////

  var botMessageDiv = document.createElement("div");
  botMessageDiv.className = "bot-message";
  botMessageDiv.innerHTML = "Bot: Please choose from the menu.";
  chatBox.appendChild(botMessageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("loginButton").addEventListener("click", function () {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (
    username === resultData[2].username &&
    password === resultData[2].password
  ) {
    window.location.href = "index.html";
  } else {
    var error = document.getElementById("errormsg");
    error.innerHTML = "Invalid Username or Password! Try Again.";
  }
});

document.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    sendMessage();
  }
});
fetchData();
