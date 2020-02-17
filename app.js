const express = require('express')
const session = require('express-session')
const Datastore = require('nedb')

const app = express ()

//ERSATT KÄLLAN 
const users = new Datastore({filename:'users.db', autoload: true})
const notes = new Datastore({filename:'notes.db', autoload: true})

// const fs = require('fs')
// const notes = require('./data/notes.json')
// const users = require('./data/users.json')

app.set("view engine", "ejs")

app.use(express.urlencoded())
app.use (express.static('static' ))

app.use(session({
    secret:"gsjdkjssks",
    resave: false,
    saveUninitialized: false
}))

//localhost: 
app.get('/', (req,res) => {
    res.render("index")
})



//SIGN IN 
app.get('/register', (req, res) => {
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    res.render("register", {errorMessage: errorMessage})
})

app.post("/signup", (req, res) => {
    if(req.body.password == req.body.repeatpassword ){
        const newUser = {
            // _id: users.length,
            usename: req.body.usename,
            password: req.body.password
        }
        // users.push(newUser)
        
        // fs.writeFile('./data/users.json', JSON.stringify(users), () => {})
        // console.log(users);
        
        users.insert(newUser, function (error, newDoc) {   
            res.redirect('/')
        });

    } else {
        req.session.errorMessage = "Password do not match"
        res.redirect('/register')
    }
})



//LOGIN 
app.post("/login", (req, res) => {
    users.findOne({ usename: req.body.usename }, function (err, user) {
        if(user && user.password == req.body.password){
            req.session.user = user._id
            req.session.usename = user.usename
            res.redirect('/home')
        } else {
            res.redirect('/')
        }
    });
})



//localhost/home - POST-IT till rätt användare
//DIN INLOGGNING HAR LYCKATS
app.get('/home', (req, res) => {
    if(req.session.user !== undefined){
        // const userNotes = []
        // for (let i = 0; i < notes.length; i++) {
        //     const currentNote = notes[i]
        //     if (currentNote.owner == req.session.user) {
        //         userNotes.push(currentNote)
        //     }
        // }
        notes.find({owner: req.session.user}, function(err, userNotes){
            res.render("home", {notes: userNotes})
        })
        
    } else {
        res.redirect('/')
    }
})



app.post("/logout", (req, res) => {
    req.session.destroy()
    res.redirect('/')
})


//ADD POST-IT
app.post("/add", (req, res) => {
    const newNote = {
        title: req.body.title,
        content: req.body.content,
        // _id: notes.length,
        owner: req.session.user
    }
    // notes.push(newNote)
    
    notes.insert(newNote, function (error, newDoc) {   
        res.redirect('/home')
    });
})


//DELETE POST-IT
app.post("/delete/:noteId", (req, res) => {   
    // for (let i = 0; i < notes.length; i++) {
    //     if (notes[i]._id == req.params.id) {
    //         notes.splice(i, 1)
    //     }
    // }
    notes.remove({_id: req.params.noteId}, function(err, doc){
        res.redirect("/home")
    })

})



//localhost/error
//DIN INLOGGNING HAR MISSLYCKATS
app.get('/error', (req, res) => {
    res.render("error")
})



app.post('/update/:noteId', (req, res) => {
    notes.update({_id: req.params.noteId}, {$set: { title: req.body.updateTitle, content: req.body.updateContent} }, function(err, doc){
        res.redirect("/home")
    })

})



//VILEKN PORT JAG HAR STARTAT MITT PROJECT PÅ 
function startServer(){
    console.log("Server started")
}
app.listen(9900, startServer)