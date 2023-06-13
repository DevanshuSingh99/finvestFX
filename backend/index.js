const app = require("express")();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Data = require("./schemas/data");
dotenv.config({ path: ".env" });
var db;
try {
    db = mongoose.connect(process.env.MONGO_URI);
} catch (error) {
    console.log("Error Connecting to mongo database 1");
}
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get("/getData", async (req, res) => {
    var dataResponse = await Data.find({});
    res.send(dataResponse);
});

app.listen(PORT, () => console.log("Server Running at :" + PORT));
