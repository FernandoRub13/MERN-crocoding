const connectDB = require("./config/db.js");
const data = require("./data/people.json");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const express = require('express');
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const Contact = require("./models/Contact")


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
connectDB();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cors());

// AUTH METHODS
app.use("/users", require("./routes/auth"));
//AUTH METHODS END

// CRUD Operations Contact Routes ************************************************************************************************************************

//@path /contact
//@desc adding new contact
//@method post
//@access public
app.route("/contact").post((req,res)=>{
    let newContact = new Contact(req.body);
    newContact.save((err, contact)=>{
        if(err){
            res.send(err)
        }
        res.json(contact)
    })
})
//@path /contact/:contactId
//@desc get contact by Id
//@method get
//@access public
app.route("/contact/:contactId").get((req,res)=>{
    Contact.findById(req.params.contactId,(err, contact)=>{
        if(err){
            res.send(err)
        }
        res.json(contact)
    })
})
//@path /contact
//@desc get all contacts
//@method get
//@access public
app.route("/contact").get((req,res)=>{
    Contact.find({},(err, contact)=>{
        if(err){
            res.send(err)
        }
        res.json(contact)
    })
})
//@path /contact/:contactId
//@desc remove a contact by Id
//@method put
//@access public
app.route("/contact/:contactId").put((req,res)=>{
    Contact.findOneAndUpdate(
        {"_id":req.params.contactId}, req.body,
        {new: true, useFindAndModify: false} ,(err, contact)=>{
        if(err){
            res.send(err)
        }
        res.json(contact)
    })
})
//@path /contact/:contactId
//@desc delete a contact by Id
//@method delete
//@access public
app.route("/contact/:contactId").delete((req,res)=>{
    Contact.remove({"_id":req.params.contactId},(err, message)=>{
        if(err){
            res.send(err)
        }
        res.json({message: "Contact successfully deleted"})
    })
})

// CRUD Operations Contact Routes End*********************************************************************************************************************

app.route("/profiles")
    .get((req, res) => {

        // throw new Error();
        // res.send(`Get request is sending on port: ${PORT}`);
        console.log(`Request from ${req.originalUrl} `);
        // console.log(`Request from ${req.method} `);
        res.json(data);
    })
    .post((req, res) => {
        // res.send(`Post request is sending on port: ${PORT}`);
        console.log(`Request ${req.body} `);
        res.send(req.body);
    })
    .put((req, res) => {
        res.send(`Put request is sending on port: ${PORT}`);
        console.log(`Request from ${req.originalUrl} `);
        // res.json(data);
    })
    .delete((req, res) => {
        res.send(`Delete request is sending on port: ${PORT}`);
        console.log(`Request from ${req.originalUrl} `);
        // res.json(data);
    });
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Red alert ${err.stack}`);
});


app.get("/:id", (req, res, next) => {
    // res.send(`Get request is sending on port: ${PORT}`);
    console.log(req.params.id);
    let user_id = Number(req.params.id);
    console.log(user_id);
    console.log(data[user_id]);

    res.json(data[user_id]);
    // res.end();
    // res.redirect("http://localhost:5000/2");
    if (user_id === 3) {
        next();
    }
}, (req, res) => {
    console.log("You have choosen the third element");
});
// app.post("/", (req, res) => {
//     res.send(`Post request is sending on port: ${PORT}`);
// });
// app.put("/", (req, res) => {
//     res.send(`Put request is sending on port: ${PORT}`);
// });
// app.delete("/", (req, res) => {
//     res.send(`Delete request is sending on port: ${PORT}`);
// });


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port: ${PORT}...`));