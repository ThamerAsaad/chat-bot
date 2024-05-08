const express = require("express");
// let Responsed = require("./script.js");
const mongoose = require("mongoose");
const ChatBot = require("./Models/Chat");
const cors = require("cors");
//call file script.js
const app = express();
app.use(cors());
app.set("view engine", "ejs");

//connect to the database
mongoose
  .connect(
    "mongodb+srv://ThamerAltai:As56526289@chatbot.dokrlm5.mongodb.net/Data-chat?retryWrites=true&w=majority&appName=ChatBot"
  )
  .then(() => {
    console.log("connected successful!");
  })
  .catch((error) => {
    console.log("error", error);
  });

app.get("/data", async (req, res) => {
  try {
    const result = await ChatBot.find();
    res.json(result);
  } catch (error) {
    return error;
  }
});

app.listen(3000, () => {
  console.log("I'm listenging in port 3000");
});
