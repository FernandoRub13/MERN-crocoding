const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require:true,
    },
    lastName:{
        type: String,
        require:true,
    },
    email: {
        type: String,
        require:true,
        unique: true
    },
    company:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    created_date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Contact = mongoose.model("Contact", ContactSchema);