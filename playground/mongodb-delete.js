//const MongoClicent = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

var user = { name: 'Andrew', age: 25 };
var { name } = user;
console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect mongodb server.');
    }
    console.log('Connected to mongodb server');

    const db = client.db('TodoApp');

    //delete many
    // db.collection('Todos').deleteMany({ text: 'eat lunch' }).then((result) => {
    //     console.log(result);
    // });

    //delete one
    // db.collection('Todos').deleteOne({ text: 'eat lunch' }).then((result) => {
    //     console.log(result);
    // });

    //findoneanddelete
    // db.collection('Todos').findOneAndDelete({ text: 'eat lunch' }).then((result) => {
    //     console.log(result);
    // });


    // db.collection('Users').deleteMany({ name: 'William' }).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').findOneAndDelete({ _id: new ObjectID('5b47214e744c8ceb352a601b') }).then((result) => {
    //     console.log(result);
    // });

    client.close();
});