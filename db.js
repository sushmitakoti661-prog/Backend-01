const Database = require("better-sqlite3");

// Open (or create) the database
const db = new Database("tasks.db");

// Create the tasks table if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER NOT NULL
    )
`).run();

// Check if the table is empty
const rowCount = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

// Seed only if empty
if (rowCount.count === 0) {
    const insert = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    );

    insert.run("Buy groceries", 0);
    insert.run("Finish assignment", 0);
    insert.run("Read a book", 1);

    console.log("Database seeded with sample tasks.");
}

module.exports = db;