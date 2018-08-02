var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var { validateID, todoFindById } = require('./../playground/mongoose-queries');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    // Valid id using is valid
    //404 - send back empty send
    if (!validateID(id)) {
        res.status(404).send('id is invalid');
    }

    //res.status(200).send(id);

    //findById
    //success
    //if todo - send it back
    //id not todo - send 404 with empty body
    //error
    //send 400 with empty body
    // todoFindById(id).then(ret => {
    //     if (ret == 0) {
    //         res.status(200).send(id);
    //     }

    //     if (ret == 1) {
    //         res.status(400).send();
    //     }

    //     if (ret == 2) {
    //         res.status(404).send();
    //     }
    // });

    Todo.findById(id).then((todo) => {
        if (!todo) {
            //console.log('todo not found');
            res.status(404).send('id is not found');
        }
        //console.log(todo);
        res.status(200).send({ todo });
    }, (e) => {
        //console.log('error is found');
        res.status(400).send('Unknown error');
    });

});

app.listen(3000, () => {
    console.log('Started on port 3000.');
});

module.exports = { app };