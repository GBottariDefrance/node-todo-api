const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').deleteMany({
    //     text:'Something to do'
    // }).then((result) =>{
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({
    //     text:'Something to do'
    // }).then((result) =>{
    //     console.log(result);
    //     db.close();
    // });

    // db.collection('Todos').findOneAndDelete({
    //     completed: false
    // }).then((result) => {
    //     console.log(result);
    //     db.close();
    // });

    db.collection('Users').deleteMany({
        name: 'Gaben'
    });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5908ddaca351dc2a2ced69c1')
    }).then((result) => {
        console.log(result);
    });

    //db.close();
});