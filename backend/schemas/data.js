var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var data = new Schema({
    id: { type: Number, unique: true },
    name: { type: String },
    image: { type: String },
    category: { type: String },
    label: { type: String },
    price: { type: Number },
    description: { type: String },
});

module.exports = mongoose.model("Data", data);
