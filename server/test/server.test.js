const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const { ObjectID } = require("mongodb");

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
});

describe('Post /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo', (done) => {
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
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

const todoSchema =
{
    completed: false,
    completedAt: null,
    _id: todos[0]._id.toHexString(),
    text: "First test todo",
    __v: 0
};


describe("Get /todos/:id", () => {
    it("should get todo by id", done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo).toMatchObject(todoSchema);
            })
            .end(done);
    });

    it("should get 404 because of invalid ID", done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}11`)
            .expect(404)
            .expect(res => {
                expect(res.text).toBe("id is invalid");
            })
            .end(done);
    })

    it("should get 404 because ID doesn't exist", done => {
        let hexID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .expect(res => {
                expect(res.text).toBe("id is not found again");
            })
            .end(done);
    })

});

describe("Delete /todos/:id", () => {

    it("Delete successfully", done => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo).toMatchObject(todoSchema);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(`${todos[0]._id.toHexString()}`).then(todo => {
                    expect(todo).toBeNull;
                    done();
                }).catch(e => done(e));
            });
    });


    it("Delete failedly because of invald ID", done => {
        request(app)
            .delete('/todos/12343')
            .expect(404)
            .expect(res => {
                expect(res.text).toBe('ID is invalid.');
            })
            .end(done);
    });

    it("Delete failedly because of NULL ID", done => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo).toMatchObject(todoSchema);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                request(app)
                    .delete(`/todos/${todos[0]._id.toHexString()}`)
                    .expect(404)
                    .expect(res => {
                        expect(res.text).toBe('ID is Null.');
                    })
                    .end(done);
            });

    });

    it("Delete failedly because of NULL ID test 2", done => {
        let hexID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .expect(res => {
                expect(res.text).toBe('ID is Null.');
            })
            .end(done);

    });


});

const patchObj0 = {
    completed: true,
    text: "patch test"
};

const patchObj1 = {
    completed: false,
    text: "patch test"
};

describe("PATCH /todos/:id", () => {
    it("should updae the todo", done => {
        //grab id of first itme
        //update text, set completed true
        //200
        //text is changed, completed is true, completedAt is a number .toBeA
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .set("Accept", "applicaton/json")
            .send(patchObj0)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect(response => {
                expect(response.body.todo.text).toEqual(expect.stringMatching(patchObj0.text));
                expect(response.body.todo.text).toBe(patchObj0.text);
                expect(response.body.todo.completed).toBeTruthy();
                expect(response.body.todo.completedAt).toEqual(expect.any(Number));
            })
            .end(done);


    });

    it("should clear completedAt when todo is not completed", done => {
        //grab id of second todo item
        //update text, set completed to false
        //200
        //text is changed, completed false, completeAt is null .toNotExist
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .set("Accept", "application/json")
            .send(patchObj1)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect(response => {
                expect(response.body.todo.text).toBe(patchObj1.text);
                expect(response.body.todo.completed).toBeFalsy();
                expect(response.body.todo.completedAt).toBeNull();
            })
            .end(done);

    });
});
