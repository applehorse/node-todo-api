const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var user_id = '5b5c43cc41fd733ec0c57457';

// var id = '5b6038cc85e39558b1d6dc3d1';

// if (!ObjectID.isValid(id)) {
//     return console.log('ID not valid');
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By ID', todo);

// }).catch(e => console.log(e));

User.findById(user_id).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
    console.log(e)
});

var validateID = id => {
    if (!ObjectID.isValid(id)) {
        return false;
    }
    return true;
};

var todoFindById = (id, callback) => {
    Todo.findById(id).then((todo) => {
        if (!todo) {
            console.log('todo not found');
            return callback(2);
        }
        console.log(todo);
        return callback(0);
    }).catch((e) => {
        console.log('error is found');
        return callback(1);
    });
}

module.exports = {
    validateID,
    todoFindById
}