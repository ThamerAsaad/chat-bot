const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ChatSchema = new schema({
  title: String,
  body: String,
  body2: String,
  body3: String,
  body4: String,
  body5: String,
  body6: String,
  username: String,
  password: String,
  price: String, 
  price2: String,
  price3: String,
  name : String,
  products : [{
    name : String,
    price : String
  }]
});

const ChatBot = mongoose.model("data", ChatSchema);

module.exports = ChatBot;
