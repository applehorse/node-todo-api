//const MongoClicent = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = { name: 'Andrew', age: 25 };
// var { name } = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect mongodb server.');
    }
    console.log('Connected to mongodb server');

    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b47193632158de48685aa7f')
    // }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    //     }
    // ).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').findOneAndUpdate(
    //     { _id: new ObjectID('5b471beb94dc59e6c9eb4e9f') },
    //     {
    //         $inc: { age: 1 },
    //         $set: { name: "William" }
    //     }, {
    //         returnOriginal: false
    //     }).then((result) => {
    //         console.log(result);
    //     })

    client.close();
});