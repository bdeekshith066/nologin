const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use bodyParser middleware to parse JSON
app.use(bodyParser.json());

// Connect to SQLite database (create a new one if it doesn't exist)
const db = new sqlite3.Database('content.db');

// Middleware to attach the database object to the request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Create a table to store content
db.run(`
  CREATE TABLE IF NOT EXISTS shared_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    duration_hours INTEGER NOT NULL,  
    duration_minutes INTEGER NOT NULL
  )
`);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint to handle content submission
app.post('/api/share', async (req, res) => {
  const { content, durationHours, durationMinutes } = req.body;
  const timestamp = new Date().getTime();
  const link = `${timestamp}`;

  const { db } = req;
  try {
    const stmt = db.prepare('INSERT INTO shared_content (link, content, duration_hours, duration_minutes) VALUES (?, ?, ?, ?)');
    await stmt.run(link, content, durationHours, durationMinutes);
    stmt.finalize();
    res.json({ link: `http://localhost:3000/${link}` });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to handle content retrieval
app.get('/:link', async (req, res) => {
  const link = req.params.link;

  const { db } = req;
  try {
    const row = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM shared_content WHERE link = ?', [link], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!row) {
      res.status(404).json({ error: 'Content not found' });
    } else {
      const currentTime = new Date().getTime();
      const expirationTime = (row.duration_hours * 60 + row.duration_minutes) * 60 * 1000;

      if (currentTime - row.id > expirationTime) {
        res.status(403).json({ error: 'Link has expired' });
      } else {
        res.json({ content: row.content });
      }
    }
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  process.stdout.write(`Server is running on http://localhost:${port}\n`);
});
