require("./config/config");

const _ = require("lodash");
const express = require('express');
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var { validateID, todoFindById } = require('./../playground/mongoose-queries');

var app = express();

var port = process.env.PORT;

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

app.post("/users", (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.get("/users", (req, res) => {
    User.find().then(users => {
        res.send({ users });
    }).catch(e => {
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
        return res.status(404).send('id is invalid');
    }

    //res.status(200).send(id);

    //findById
    //success
    //if todo - send it back
    //id not todo - send 404 with empty body
    //error
    //send 400 with empty body

    // todoFindById(id, ret => {
    //     switch (ret) {
    //         case 0:
    //             res.status(200).send(id);
    //             break;
    //         case 1:
    //             res.status(400).send('Unknown error');
    //             break;
    //         case 2:
    //             res.status(404).send('id is not found');
    //             break;
    //         default:
    //             res.status(400).send('Error.');
    //             break;
    //     }
    // });

    Todo.findById(id).then((todo) => {
        if (!todo) {
            //console.log('todo not found');
            return res.status(404).send('id is not found again');
        }
        //console.log(todo);
        res.status(200).send({ todo });
    }).catch((e) => {
        //console.log('error is found');
        res.status(400).send('Unknown error');
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!validateID(id)) {
        return res.status(404).send('ID is invalid.');
    }

    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            return res.status(404).send('ID is Null.');
        }

        res.status(200).send({ todo });
    }).catch(e => {
        res.status(400).send('Unkown Error.');
    });

});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);

    if (!validateID(id)) {
        return res.status(404).send('ID is invalid.');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}.`);
});

module.exports = { app };