let expect = require('expect');
let request = require('supertest');
let { ObjectID } = require('mongodb');

let { app } = require('./../server/server');
let { Todo } = require('./../server/models/todo');
let { User } = require('./../server/models/user');

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test text';
        request(app)
            .post('/todos')
            .send({
                text
            }).expect(200).expect((res) => {
                expect(res.body.text).toBe(text);
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if id not valid', (done) => {
        request(app)
            .get(`/todos/133769420}`)
            .expect(400)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete and return todo doc', (done) => {
        let hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                });;
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if id not valid', (done) => {
        request(app)
            .delete(`/todos/133769420}`)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update and return todo doc', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'Test text';
        let completed = true;
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.updatedTodo._id).toBe(hexId);
                expect(res.body.updatedTodo.text).toBe(text);
                expect(res.body.updatedTodo.completed).toBe(completed);
                expect(res.body.updatedTodo.completedAt).toBeA('number');
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo._id.toString()).toBe(hexId);
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(completed);
                    expect(todo.completedAt).toBeA('number');
                    done();
                }).catch((err) => {
                    done(err);
                });;
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString();
        let text = 'Test text2';
        let completed = false;
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.updatedTodo._id).toBe(hexId);
                expect(res.body.updatedTodo.text).toBe(text);
                expect(res.body.updatedTodo.completed).toBe(completed);
                expect(res.body.completedAt).toNotExist();
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo._id.toString()).toBe(hexId);
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(completed);
                    expect(res.body.completedAt).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                });;
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if id not valid', (done) => {
        request(app)
            .delete(`/todos/133769420}`)
            .expect(400)
            .end(done);
    });
});