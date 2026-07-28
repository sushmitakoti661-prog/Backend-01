const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const db = require("./db");

app.use(express.json()); // helps to read JSON from request bodies
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

//our "database"
let tasks = [
  {id:1, title:"Buy groceries", done:false},
  {id:2, title:"Finish assignment", done:false},
  {id:3, title:"Read a book", done:true}
];

app.get('/', (req, res) => {
  res.json({
    name:"Task API",
    version:"1.0",
    endpoints:["/tasks"]
  });
});
 
app.get('/health', (req, res) => {
    res.json({status:"ok"});
});

//GET all tasks
app.get('/tasks', (req, res) => {
    const tasks = db
        .prepare("SELECT * FROM tasks")
        .all();

    const formattedTasks = tasks.map(task => ({
        ...task,
        done: Boolean(task.done)
    }));

    res.json(formattedTasks);
});

//GET one task by id
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    task.done = Boolean(task.done);

    res.json(task);

});

//CREATE a new task
app.post('/tasks', (req, res) => {
    const {title} = req.body;

    if(!title || title.trim() === ''){
        return res.status(400).json({error:"Title is required"});
    }
    // Insert into database
    const result = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    ).run(title, 0);

    // Fetch the newly created task
    const newTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(result.lastInsertRowid);

    // Convert 0/1 to boolean
    newTask.done = Boolean(newTask.done);

    res.status(201).json(newTask);

});

//UPDATE a task
app.put('/tasks/:id',(req, res) =>{
    const id= Number(req.params.id);
    const task = tasks.find(t => t.id === id);
    if(!task){
        return res.status(404).json({error:`Task ${id} not found`});
    }
    const {title, done} = req.body;
    if(title !== undefined && title.trim() === ''){
        return res.status(400).json({error:"Title cannot be empty"});
    }
    if(title !== undefined){
        task.title = title;
    }
    if(done !== undefined){
        task.done = done;
    }
    res.json(task);
});

//DELETE a task
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if(index === -1){
        return res.status(404).json({error:`Task ${id} not found`});
    }
    tasks.splice(index, 1);
    res.status(204).send();
});

app.listen(3000);