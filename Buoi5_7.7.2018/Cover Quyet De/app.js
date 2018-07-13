const express = require('express');
const hdb = require('express-handlebars');
const questionList = require("./list.json");
const fs = require('fs');
const bodyParse = require('body-parser')
const path = require('path')

var app = express();
'use strict';

module.exports.register = function (Handlebars, options, params) {
    Handlebars.registerHelper('asset', function (filepath) {
        return path.join(options.assets, filepath).replace(/\\/g, '/');
    });

};

app.engine('handlebars', hdb({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");
// dang post leen la formdata giong HTML 
// Co the Post JSON
app.use(bodyParse.urlencoded({
    extended: false
}))
app.use(express.static('CSS'));
// app.use(express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
    let question = questionList[Math.floor(Math.random() * questionList.length)]

    res.render("home", {

        question
    });
})
app.get('/ask', (req, res) => {

    res.render("ask");
});
// param de lay noi dung duong dan
app.get('/question/:idQuestion', (req, res) => {
    let question = questionList[req.params.idQuestion]

    res.render("question", {
        idQuestion: req.params.idQuestion,
        question,
        totalVote: question.yes + question.no
    });
});

app.get('/answer/:idQuestion/:vote', (req, res) => {
    let question = questionList[req.params.idQuestion];
    question[req.params.vote] += 1;
    fs.writeFileSync('./list.json', JSON.stringify(questionList))
    res.redirect("/question/" + req.params.idQuestion)
})

// Tao duong link api

app.post('/question/add', (req, res) => {
    console.log(req.body);
    // add new question
    let newQuestion = {

        content: req.body.contentQuestion,
        yes: 0,
        no: 0,
        id: questionList.length

    }
    questionList.push(newQuestion)
    // Viet new question vao file
    res.redirect('/question/' + newQuestion.id)
})
app.listen(8080, (err) => {
    if (err) console.log(err)
    else console.log('Server run successfully!!');
});