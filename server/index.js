const express = require('express');
const cors = require('cors');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./stuff.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS workers (Username VARCHAR(100) UNIQUE, Password VARCHAR(100), Email VARCHAR(100) UNIQUE, Name VARCHAR(100))`);
    db.run("INSERT INTO workers (Username, Password, Email, Name) VALUES ('yolobob', 'hai', 'yolo@gmail.com', 'Bob Yolo')");
    db.run(`CREATE TABLE IF NOT EXISTS incompleteAssignments (id INTEGER PRIMARY KEY, priority VARCHAR(20), priorityColor VARCHAR(30), name VARCHAR(50), description VARCHAR(500), due DATETIME, subject VARCHAR(30), points INTEGER, username VARCHAR(30))`);
    db.run(`CREATE TABLE IF NOT EXISTS pastAssignments (id INTEGER PRIMARY KEY, priority VARCHAR(20), priorityColor VARCHAR(30), name VARCHAR(50), description VARCHAR(500), due DATETIME, subject VARCHAR(30), points INTEGER, username VARCHAR(30))`);
    
    const needingAttentionTasksMain = [
        {priority: "Important", priorityColor: "text-amber-300", name: "Science Project", description: "Research and gather materials for science project on photosynthesis.", due: new Date(), subject: "Science", points: 16},
        {priority: "Urgent", priorityColor: "text-red-400", name: "English Essay", description: "Write a 3-page essay on the theme of identity in 'To Kill a Mockingbird'.", due: new Date(), subject: "ELA", points: 35},
        {priority: "Important", priorityColor: "text-amber-300", name: "History Quiz", description: "Study chapters 6-10 for upcoming history quiz on Friday.", due: new Date(), subject: "History", points: 23},
        {priority: "Safe", priorityColor: "text-green-400", name: "Art Project", description: "Sketch and outline final draft of self-portrait for art class.", due: new Date(), subject: "Art", points: 10},
        {priority: "Safe", priorityColor: "text-green-400", name: "Music Practice", description: "Practice piano pieces for upcoming recital.", due: new Date(), subject: "Music", points: 5},
        {priority: "Safe", priorityColor: "text-green-400", name: "Physical Education", description: "Complete 30 minutes of cardio exercise and log activity in fitness journal.", due: new Date(), subject: "Physical Education", points: 5},
        {priority: "Important", priorityColor: "text-amber-300", name: "Coding Assignment", description: "Complete coding assignment on arrays and loops for computer science class.", due: new Date(), subject: "Programming", points: 10},
        {priority: "Important", priorityColor: "text-amber-300", name: "Spanish Vocabulary", description: "Review vocabulary list and practice speaking with a partner for upcoming quiz.", due: new Date(), subject: "Spanish", points: 1},
        {priority: "Urgent", priorityColor: "text-red-400", name: "Book Report", description: "Read assigned chapters and prepare notes for book report presentation next week.", due: new Date(), subject: "ELA", points: 20}
    ];
    
    needingAttentionTasksMain.forEach(task => {
        const { priority, priorityColor, name, description, due, subject, points } = task;
        // Replace single quotes in the description with two single quotes
        const escapedDescription = description.replace(/'/g, "''");
        const sql = `INSERT INTO incompleteAssignments (id, priority, priorityColor, name, description, due, subject, points, username) VALUES (NULL, '${priority}', '${priorityColor}', '${name}', '${escapedDescription}', CURRENT_TIMESTAMP, '${subject}', ${points}, 'yolobob');`;
        db.run(sql, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                
            }
        });
    });
    
});    

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', function (req, res, next) {
    db.serialize(() => {
        db.run(`INSERT INTO workers (Username, Password, Email, Name) VALUES (?, ?, ?, ?)`, [req.body.username, req.body.password, req.body.email, req.body.name], (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    });
});

app.post('/login', function (req, res, next) {
  db.serialize(() => {
      db.get(`SELECT Username as username,
                      Password as password,
                      Email as email,
                      Name as name
               FROM workers
               WHERE Username = ? AND Password = ?`, [req.body.username, req.body.password], (err, row) => {
          if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }
          if (row) {
              res.status(200).json(row);
          } else {
              res.status(404).json({ error: 'notFound' });
          }
      });
  });
});

app.post('/updateInformation', function (req, res, next) {
  db.serialize(() => {
      db.get(`SELECT Username as username,
                      Password as password,
                      Email as email,
                      Name as name
              FROM workers
              WHERE Username = ?`, [req.body.oldData.username], (err, row) => {
          if (err) {
              console.error("Error",err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }
          if (row) {
              db.run(`UPDATE workers 
                      SET Username = ?, Email = ?, Name = ? 
                      WHERE Username = ?`, 
                  [req.body.newData.username, req.body.newData.email, req.body.newData.name, req.body.oldData.username], 
                  (err) => {
                      if (err) {
                          console.error(err);
                          res.status(500).json({ error: 'Internal Server Error' });
                          return;
                      }
                      res.status(200).json({ success: true });
                  }
              );
          } else {
              res.status(404).json({ error: 'notFound' });
          }
      });
  });
});

app.post('/get-past-assignments', function (req, res, next) {
    db.serialize(() => {
        db.all(`SELECT * FROM pastAssignments WHERE username = ?`, [req.body.username], (err, row) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
            }
            if (row) {
                res.status(200).json({ pastAssignments: row });
            } else {
                res.status(404).json({ error: "Not Found" });
            }
        });
    });
});

app.post('/get-all-incomplete-assignments', function (req, res, next) {
    db.serialize(() => {
        db.all(`SELECT * FROM incompleteAssignments WHERE username = ?`, [req.body.username], (err, row) => {
             if (err) {
                console.error(err)
                res.status(500).json({ error: "Internal Server Error" });
                return;
             }
             if (row) {
                res.status(200).json({ remainingAssignments: row });
             } else {
                res.status(404).json({ error: "Not Found" });
             }
        });
    });
});

app.post('/create-assignment', function (req, res, next) {
    db.serialize(() => {
        db.run(`INSERT INTO incompleteAssignments (id, priority, priorityColor, name, description, due, subject, points, username) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.body.priority, req.body.priorityColor, req.body.name, req.body.description, req.body.due, req.body.subject, req.body.points, req.body.username], (err) => {
            if (err) {
                console.error("Error inserting a new task:", err);
            }
        });
    });
});

app.post('/complete-assignment', function (req, res, next) {

    db.serialize(() => {
        db.get(`SELECT * FROM incompleteAssignments WHERE id = ?`, [req.body.taskId], (err, assignment) => {
            if (err) {
                console.error("Error selecting assignment from incompleteAssignments table:", err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }
            if (!assignment) {
                console.error("Assignment not found in incompleteAssignments table");
                res.status(404).json({ error: "Assignment not found" });
                return;
            }

            db.run(`DELETE FROM incompleteAssignments WHERE id = ?`, [req.body.taskId], (deleteErr) => {
                if (deleteErr) {
                    console.error("Error deleting assignment from incompleteAssignments table:", deleteErr);
                    res.status(500).json({ error: "Internal Server Error" });
                    return;
                }


                const { id, priority, priorityColor, name, description, due, subject, points, username } = assignment;
                db.run(`INSERT INTO pastAssignments (id, priority, priorityColor, name, description, due, subject, points, username)
                        VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [priority, priorityColor, name, description, due, subject, points, username],
                        (insertErr) => {
                            if (insertErr) {
                                console.error("Error inserting assignment into pastAssignments table:", insertErr);
                                res.status(500).json({ error: "Internal Server Error" });
                                return;
                            }


                            db.all(`SELECT * FROM incompleteAssignments`, (fetchErr, remainingAssignments) => {
                                if (fetchErr) {
                                    console.error("Error fetching remaining assignments from incompleteAssignments table:", fetchErr);
                                    res.status(500).json({ error: "Internal Server Error" });
                                    return;
                                }

                                // Send response to client
                                res.status(200).json({ 
                                    message: "Assignment completed successfuslly", 
                                    remainingAssignments: remainingAssignments
                                });
                            });
                        }
                );
            });
        });
    });
});


const server = http.createServer(app);
server.listen(5001, 'localhost', () => {
    console.log("Server listening on port 5001!");
});