const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({ _id: '5b6fe59545cd7bfc4843f0a1' }).then((result) => {
    console.log(result);
});

// Todo.findByIdAndRemove('5b6fe59845cd7bfc4843f0a2').then((result) => {
//     console.log(result);
// });

