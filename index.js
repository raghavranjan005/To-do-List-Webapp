const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

var TodoTask = require("./models/TodoTask");
var User= require("./models/Users");

dotenv.config();

app.use("/static",express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");
app.listen(3000, () => console.log("Server Up and running"));
});


app.set("viewengine","ejs");

// GET METHOD

app.get("/", (req, res)=> { 
    res.render("Home.ejs"); 
}); 

app.get("/signup", (req, res)=> { 
    res.render("signup.ejs"); 
}); 

app.get("/login", (req, res)=>{ 
    res.render("login.ejs"); 
}); 

app.get("/task", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });

app.post('/signup', async (req,res) => {

    
    // Check if user already exists
    const userExists = await User.findOne({ email : req.body.email });
    if(userExists) return res.status(400).send('Email already exists');
    // Create a new user object
    const user = new User({
        full_name : req.body.full_name,
        email : req.body.email,
        password : req.body.password
    });
    
    console.log(user);
    
    // Save the user object to DB
    try{
        const savedUser = await user.save();
    }catch(err){
        res.status(400).send(err);
    }

    if(!userExists) return res.redirect("/login");
});





app.post('/login', async (req,res) => {

    
    // Check if user already exists

    const user = await User.findOne({ email : req.body.email });
    if(!user) return res.status(400).send('Email doesnot exists');

    // Validate Password
    const validPass = await User.findOne({password: req.body.password});
    if(!validPass) return res.status(400).send("Invalid Password");

   if(validPass && user) return res.redirect("/task")
});







    


    
//POST METHOD




app.post('/task',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content,
    due:req.body.due,
    status: req.body.status,
    label:req.body.label
    });
    try {
    await todoTask.save();
    res.redirect("/task");
    } catch (err) {
    res.redirect("/task");
    }
    });

    

//UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content, due:req.body.due, status:req.body.status ,label:req.body.status }, err => {
if (err) return res.send(500, err);
res.redirect("/task");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/task");
    });
    });

app.listen(4000, () => console.log("Server Up and running"));
