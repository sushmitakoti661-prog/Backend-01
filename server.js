const express = require('express');
const app = express();

app.use(express.json()); // helps to read JSON from request bodies

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
    res.json(tasks);
});

//GET one task by id
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t =>t.id===id);

    if(!task){
        return res.status(404).json({error:`Task ${id} not found`});
    }
    res.json(task);
});

//CREATE a new task
app.post('/tasks', (req, res) => {
    const {title} = req.body;

    if(!title || title.trim() === ''){
        return res.status(400).json({error:"Title is required"});
    }
    const newTask = {
        id: tasks.length>0 ? Math.max(...tasks.map(t => t.id)) +1:1,
        title:title,
        done:false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.listen(3000);