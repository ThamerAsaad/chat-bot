let resultData;

fetch("http://localhost:3000/data")
  .then((res) => {
    if (res.ok) return res.json();
    throw new Error("something bad happened");
  })
  .then((data) => {
    resultData = data;
    console.log("Fetched data:", resultData);

    // Update companies with fetched Apple products
    updateCompaniesWithAppleProducts();

    // Now you can call any other functions that rely on resultData or companies
    Updatethemessage();
    updateDealsMessage();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function updateCompaniesWithAppleProducts() {
  if (!resultData || !resultData[3]) {
    console.error("Invalid data structure or missing Apple products");
    return;
  }

  const appleProducts = resultData[3].products;
  const appleIndex = companies.findIndex((company) => company.name === 'Apple');

  // If the "Apple" company exists in the companies array
  if (appleIndex !== -1) {
    // Update the products of the "Apple" company with the fetched products
    companies[appleIndex].products = appleProducts.map(product => ({
      name: product.name,
      price: product.price
    }));
    console.log("Updated Apple products in companies:", companies[appleIndex].products);
  } else {
    // Create a new entry for the "Apple" company if it doesn't exist
    companies.push({
      id: companies.length + 1,
      name: 'Apple',
      products: appleProducts.map(product => ({
        name: product.name,
        price: product.price
      }))
    });
    console.log("Added Apple products to companies:", companies[companies.length - 1].products);
  }
  const samsungIndex = companies.findIndex(
    (company) => company.name === "Samsung"
  );

  if (samsungIndex !== -1) {
    // Update the products of the "Samsung" company with the fetched products
    companies[samsungIndex].products = resultData[4].products.map(
      (product) => ({
        name: product.name,
        price: product.price,
      })
    );
  } else {
    // Create a new entry for the "Samsung" company if it doesn't exist
    companies.push({
      id: companies.length + 1,
      name: "Samsung",
      products: resultData[4].products.map((product) => ({
        name: product.name,
        price: product.price,
      })),
    });
  }
  const huaweiIndex = companies.findIndex(
    (company) => company.name === "Huawei"
  );

  if (huaweiIndex !== -1) {
    // Update the products of the "Huawei" company with the fetched products
    companies[huaweiIndex].products = resultData[5].products.map(
      (product) => ({
        name: product.name,
        price: product.price,
      })
    );
  } else {
    // Create a new entry for the "Huawei" company if it doesn't exist
    companies.push({
      id: companies.length + 1,
      name: "Huawei",
      products: resultData[5].products.map((product) => ({
        name: product.name,
        price: product.price,
      })),
    });
  }
  const googleIndex = companies.findIndex((company) => company.name === "Google");

    if (googleIndex !== -1) {
      // Update the products of the "Google" company with the fetched products
      companies[googleIndex].products = resultData[6].products.map((product) => ({
        name: product.name,
        price: product.price,
      }));
    } else {
      // Create a new entry for the "Google" company if it doesn't exist
      companies.push({
        id: companies.length + 1,
        name: "Google",
        products: resultData[6].products.map((product) => ({
          name: product.name,
          price: product.price,
        })),
      });
    }
}


var helpRequested = false;
var selectingCompany = false;
var selectingProduct = false;
var selectedPhoneOptionIndex = 0;
var selectedCompanyIndex = 0;
var selectedPeriod = 0;

function Updatethemessage() {
  if (!resultData) return; // Ensure resultData is available
  const callUsOption = options.find((option) => option.name === "call us");
  if (callUsOption) {
    callUsOption.message = resultData[0].body5
  }
  const promotionsOption = options.find((option) => option.name === "promotions");
  if(promotionsOption){
    promotionsOption.message = resultData[0].body6
  }
}

const companies = [
  {
    id: 1,
    name: "Apple",
    products: [
      // the data is taking from the database
    ],
  },
  {
    id: 2,
    name: "Samsung",
    products: [
    // the data is taking from the database
    ],
  },
  {
    id: 3,
    name: "Huawei",
    products: [
     // the data is taking from the database
    ],
  },
  {
    id: 4,
    name: "Google",
    products: [
      // the data is taking from the database
    ],
  },
];

const options = [
  {
    id: 1,
    name: "call us",
    selected: false,
    message: ``,// the data is taking from the database
  },
  {
    id: 2,
    name: "deals",
    selected: false,
    message: "Placeholder for deals message",// the data is taking from the database
  },
  {
    id: 3,
    name: "promotions",
    selected: false,
    message: "",// the data is taking from the database
  },
  {
    id: 4,
    name: "installment",
    selected: false,
    message: "Bot: Please select a company first.",
  },
];

function updateDealsMessage() {
  if (!resultData) return;

  const dealsOption = options.find((option) => option.name === "deals");
  dealsOption.message = resultData[2].title;

  // Iterate over each company and its products to create the deals list
  companies.forEach((company, index) => {
    dealsOption.message += `<strong>${company.name}:</strong> <br>`;
    company.products.forEach((product, productIndex) => {
      dealsOption.message += `${productIndex + 1}. ${product.name} - ${
        product.price
      } <br>`;
    });
    dealsOption.message += "<br>";
  });
}

const showDeals = (userInput) => {
  if (userInput === "cash") {
    return `You are welcome to visit us in our showrooms hawally,salmiya,jahra,sharq and our customer service will be happy to assist you !`;
  } else if (userInput === "knet") {
    window.location.href = "payment.html";
  }
  return;
};

function calculateInstallment(phoneOptionIndex, period, salary) {
  if (salary < 200) {
    return "Bot: Sorry, your salary is too low to afford any phone option.";
  }
  if (phoneOptionIndex < 0 || phoneOptionIndex > companies.length) {
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
    // Check if help is requested
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML =
      resultData[2].body;
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  if (userInput === "help") {
    // Display help message
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

  if (helpRequested) {
    // Handle options if help has been requested
    var selectedOption = options.find(
      (option) => option.name === userInput && !option.selected
    );
    if (selectedOption) {
      if (userInput === "installment" || parseInt(userInput) === 4) {
        // Prompt to select a company
        selectingCompany = true;
        var companyListMessage =
          "<strong>Bot: Please select a company:</strong> <br>";
        companies.forEach((company, index) => {
          companyListMessage += `${index + 1}. ${company.name} <br>`;
        });
        var botMessageDiv = document.createElement("div");
        botMessageDiv.className = "bot-message";
        botMessageDiv.innerHTML = companyListMessage;
        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
      } else {
        // Display the selected option's message
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
        // Selecting a company
        selectedCompanyIndex = optionIndex - 1;
        selectingCompany = false;

        // Display products of the selected company
        var selectedCompany = companies[selectedCompanyIndex];
        var companyProductMessage = `<strong>Bot: Products of ${selectedCompany.name}:</strong> <br>`;
        selectedCompany.products.forEach((product, index) => {
          companyProductMessage += `${index + 1}. ${product.name} - ${
            product.price
          } <br>`;
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
          resultData[2].body4;
        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
      }
    }
  }

  // Handle product selection
  if (selectingProduct) {
    var productIndex = parseInt(userInput);
    if (
      productIndex >= 1 &&
      productIndex <= companies[selectedCompanyIndex].products.length
    ) {
      // Selecting a product
      selectedPhoneOptionIndex = productIndex - 1;
      selectingProduct = false;

      // Prompt to select the installment duration
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = resultData[2].body2;
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    } else {
      // Invalid product selection
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = resultData[2].body3;
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }
  }

  // Now handle user input for installment duration
  if (userInput && !isNaN(userInput)) {
    var inputPeriod = parseInt(userInput);
    if ([6, 12, 24].includes(inputPeriod)) {
      selectedPeriod = inputPeriod;

      // Now prompt for salary
      var salaryPromptDiv = document.createElement("div");
      salaryPromptDiv.className = "bot-message";
      salaryPromptDiv.innerHTML =
        resultData[2].body5;
      chatBox.appendChild(salaryPromptDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    } if (salary > 200) {
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = calculateInstallment(
        selectedPhoneOptionIndex,
        selectedPeriod,
        salary
      );
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }
  }

  // Now handle user input for salary
  if (selectedCompanyIndex !== undefined && selectedPeriod && !isNaN(userInput)) {
    var salary = parseFloat(userInput);
    
    if (salary < 200) {
      // Salary is too low, display a message indicating inability to afford any phone option
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = "Bot: Sorry, your salary is too low to afford any phone option.";
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }

    // Calculate installment regardless of salary
    var installmentMessage = calculateInstallment(
      selectedPhoneOptionIndex,
      selectedPeriod,
      salary
    );
  
    // Display installment message
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML = installmentMessage;
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatBox.appendChild(document.createElement("br"));

// Prompt for payment method (cash or knet)
    var paymentPromptDiv = document.createElement("div");
    paymentPromptDiv.className = "bot-message";
    paymentPromptDiv.innerHTML = "Bot: Please select the payment method (cash or knet):";
    chatBox.appendChild(paymentPromptDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

  return;
  }
  

  if (userInput === "cash" || userInput === "knet") {
    // Handle payment selection
    var paymentMessage = showDeals(userInput);
    if (paymentMessage) {
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = paymentMessage;
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      // Invalid payment selection
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML =
        "Bot: Please select a valid payment method (cash or knet).";
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    // Reset all conversation variables after handling payment
    selectedCompanyIndex = 0;
    selectedPhoneOptionIndex = 0;
    selectedPeriod = 0;
    helpRequested = false;
    return;
  }

  // Default response if none of the conditions are met
  var botMessageDiv = document.createElement("div");
  botMessageDiv.className = "bot-message";
  botMessageDiv.innerHTML = resultData[2].body6;
  chatBox.appendChild(botMessageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("loginButton").addEventListener("click", function () {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (
    username === resultData[1].username &&
    password === resultData[1].password
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
