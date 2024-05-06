let resultData;

fetch("http://localhost:3000/data")
  .then((res) => {
    if (res.ok) return res.json();
    throw new Error("something bad happened");
  })
  .then((data) => {
    resultData = data;
    Updatethemessage();
    console.log(resultData[1].title);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

var helpRequested = false; // Flag to track if help has been requested
var selectedPhoneOptionIndex = 0; // Variable to store the selected phone option index
var selectedPeriod = 0; // Variable to store the selected installment period

function Updatethemessage() {
  if (!resultData) return; // Ensure resultData is available
  // options.deals.message =
  //   resultData[1].title +
  //   resultData[1].body +
  //   resultData[1].body2 +
  //   resultData[1].body3;
  options["call us"].message = resultData[1].body;
}

var options = {
  "call us": {
    selected: false,
    message: '',
  },
  deals: {
    selected: false,
    message:
      '',
  },
  promotions: {
    selected: false,
    message: "Bot: These are the promotions we have.",
  },
  installment: {
    selected: false,
    message:
      "Bot: Please select a phone:<br>1. iPhone 14 Pro Max (499 KD)<br>2. Samsung 23 Ultra (399 KD)<br>3. Google Pixel (359 KD)",
  },
  "samsung 24 ultra": {
    selected: false,
    message: "Bot: This is the promotion for Samsung 24 Ultra.",
},
  "iphone 15 pro max" : {
    selected : false,
    message : 'hi hi',
  },
  "iPhone 14 pro max": {
    selected: false,
    price: 499,
    index: 1,
  },
  "samsung 23 ultra": {
    selected: false,
    price: 399,
    index: 2,
  },
  "google pixel": {
    selected: false,
    price: 359,
    index: 3,
  },
};

function calculateInstallment(phoneOptionIndex, period, salary) {
  let optionName;
  let price;

  switch (phoneOptionIndex) {
    case 1:
      optionName = "iPhone 14 Pro Max";
      price = options["iPhone 14 pro max"].price;
      break;
    case 2:
      optionName = "Samsung 23 Ultra";
      price = options["samsung 23 ultra"].price;
      break;
    case 3:
      optionName = "Google Pixel";
      price = options["google pixel"].price;
      break;
    default:
      return "Bot: Invalid phone option.";
  }

  if (salary < 200) {
    return "Bot: Sorry, your salary is too low to afford any phone option.";
  }

  const monthlyPayment = (price / period).toFixed(2);
  return `
    Bot: Option: ${optionName}
    Price: ${price} KD
    Monthly payment for ${period} months: ${monthlyPayment} KD
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

    // Reset helpRequested flag after displaying the message
    // helpRequested = false;
    return;
  }

  if (!helpRequested) {
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML =
      "Bot: This is wrong info. Please select 'help' to move on.";
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }
  if(userInput === "deals"){
    var botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";
    botMessageDiv.innerHTML =
        resultData[1].title +
        resultData[1].body +
        resultData[1].body2 +
        resultData[1].body3;
    chatBox.appendChild(botMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    return;
  }else if(userInput === "Samsung 24 Ultra" && options.deals.selected){
    var phoneMessageDiv = document.createElement("div");
    phoneMessageDiv.className = "bot-message";
    phoneMessageDiv.innerHTML = options["samsung 24 ultra"].message;
    chatBox.appendChild(phoneMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }
  
  
    if (options[userInput] && !options[userInput].selected) {
    if (userInput === "installment") {
      handleInstallmentOption();
      return;
    } else if (options[userInput].price) {
      selectedPhoneOptionIndex = options[userInput].index;
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML =
        "Bot: Please select the installment period (6, 12, or 24 months).";
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    } else {
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = options[userInput].message;
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }
  }

  if (
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
  if (selectedPhoneOptionIndex && selectedPeriod && !isNaN(userInput)) {
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
    selectedPhoneOptionIndex = 0;
    selectedPeriod = 0;
    helpRequested = false; // Reset help flag as well
    // Reset the 'selected' property of all options to false
    Object.keys(options).forEach((key) => {
      options[key].selected = false;
    });
    return;
  }
  var botMessageDiv = document.createElement("div");
  botMessageDiv.className = "bot-message";
  botMessageDiv.innerHTML = "Bot: Please choose from the menu.";
  chatBox.appendChild(botMessageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
function handleInstallmentOption() {
  // Display the installment message
  var botMessageDiv = document.createElement("div");
  botMessageDiv.className = "bot-message";
  botMessageDiv.innerHTML = options.installment.message;
  document.getElementById("chat-box").appendChild(botMessageDiv);
  document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
  // Set the installment option as selected
  options.installment.selected = true;
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