let resultData;

fetch("http://localhost:3000/data")
  .then((res) => {
    if (res.ok) return res.json();
    throw new Error("something bad happened");
  })
  .then((data) => {
    resultData = data;
    Updatethemessage()
    console.log(resultData[1].title);
  });

var helpRequested = false; // Flag to track if help has been requested
var selectedPhoneOptionIndex = 0; // Variable to store the selected phone option index
var selectedPeriod = 0; // Variable to store the selected installment period

function Updatethemessage(){
  options.deals.message = resultData[1].title + resultData[1].body + resultData[1].body2 + resultData[1].body3;
  options["call us"].message = "call in this number"
}

var options = {
  "call us": {
    selected: false,
    message: "",
  },
  deals: {
    selected: false,
    message:
      "Bot: Here are some deals for you:<br>1. iPhone 15 Pro Max for $790<br>2. Samsung 24 Ultra for $590<br>3. Google Pixel 8 for $490",
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
  "iphone 15 pro max" :{
    selected: false,
    message : "this is the information about 15 iphone pro max >.."
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
      price = options["iphone 14 pro max"].price;
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
  var userInput = document.getElementById("user-input").value.trim().toLowerCase();
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
  
  if (options[userInput] && !options[userInput].selected) {
    options[userInput].selected = true;
    if (userInput === "iphone 15 pro max" && options.deals.selected) {
      var iphoneMessageDiv = document.createElement("div");
      iphoneMessageDiv.className = "bot-message";
      iphoneMessageDiv.innerHTML = "";
      chatBox.appendChild(iphoneMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    } 
    
    if (userInput === "installment") {
      var botMessageDiv = document.createElement("div");
      botMessageDiv.className = "bot-message";
      botMessageDiv.innerHTML = options[userInput].message;
      chatBox.appendChild(botMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
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
    return;
  }

  var botMessageDiv = document.createElement("div");
  botMessageDiv.className = "bot-message";
  botMessageDiv.innerHTML = "Bot: Please choose from the menu.";
  chatBox.appendChild(botMessageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}




document.getElementById("loginButton").addEventListener("click", function () {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (username === resultData[2].username && password === resultData[2].password) {
    window.location.href = "index.html";
  } else {
    var error = document.getElementById("errormsg");
    error.innerHTML = "Invalid Username or Password! Try Again.";
  }
});
