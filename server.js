const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const db = require("./db");

app.use(express.json()); // helps to read JSON from request bodies
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));


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

// UPDATE a task
app.put('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    // Check if task exists
    const existingTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    const { title, done } = req.body;

    if (title !== undefined && title.trim() === '') {
        return res.status(400).json({
            error: "Title cannot be empty"
        });
    }

    // Keep existing values if not provided
    const updatedTitle = title !== undefined ? title : existingTask.title;
    const updatedDone = done !== undefined ? Number(done) : existingTask.done;

    // Update database
    db.prepare(`
        UPDATE tasks
        SET title = ?, done = ?
        WHERE id = ?
    `).run(updatedTitle, updatedDone, id);

    // Fetch updated row
    const updatedTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    updatedTask.done = Boolean(updatedTask.done);

    res.json(updatedTask);

});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const result = db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.status(204).send();

});

app.listen(3000);