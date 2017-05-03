const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// let id = '590943c857877443747feb9f';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
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

// Todo.findById(id)
//     .then((todo) => {
//         if (!todo) {
//             return console.log('Id not found');
//         }
//         console.log('Todo by id', todo);
//     }).catch((err) => {
//         console.log(err);
//     });

User.findById('590903189b4cc33c30cb09ba')
    .then((user) => {
        if (!user) {
            return console.log('User not found');
        }
        console.log(JSON.stringify(user, undefined, 2));
    }, (err) => {
        console.log(err);
    });