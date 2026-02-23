const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const port = 8000;

app.use(bodyParser.json());

let users = []
let counter = 1;
let conn = null
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8820
    });   
}

/* app.get('/testdb', (req, res) => {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8820
    }).then((conn) => {
        conn.query('SELECT = FROM users')
            .then((result) => {
                res.json(results[0]);
            })
            .catch((err) => {
                console.error('Database query error:', err.message);
                res.status(500).json({ error: 'Database query error' });
            })
    });
}); */

app.get('/testdb-new', async (req, res) => {
    try {
        /* const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'webdb',
            port: 8820
        }); */
        const results = await conn.query('SELECT = FROM users');
        res.json(results[0]);
    } catch (error) {
        console.error('Database query error:', error.message);
        res.status(500).json({ error: 'Database query error'});
    }
});
    /* }).then(connection => {
        return connection.query('SELECT = FROM users')
    }).then(([rows, fields]) => {
        res.json(rows);
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Database error'})
    })
}) /*

/**
    GET /users สำหรับ get ข้อมูล users ทั้งหมด
    POST /users สำหรับเพิ่ม user ใหม่
    GET /users/:id สำหรับ get ข้อมูล user ที่มี id ตรงกับที่ส่งมา
    PUT /users/:id สำหรับแก้ไขข้อมูล user ที่มี id ตรงกับที่ส่งมา
    DELETE /users/:id สำหรับลบข้อมูล user ที่มี id ตรงกับที่ส่งมา
 */

//path = GET /users สำหรับ get ข้อมูล users ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT = FROM users')
    res.json(results[0]);
    /* const filterUsers = users.map(user => {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: `${user.firstname} ${user.lastname}`
        }
    }) */
    /* res.json(filterUsers); /*
    /*res.json(users);
    /*let user = {
        name: 'John Doe',
        age: 30,
        email: 'john.doe@example.com'
    };
    res.json(user); */
    //res.send('Hello World!');
}); 

//path = POST /users สำหรับเพิ่ม user ใหม่
app.post('/users', async (req, res) => {
try {
    let user = req.body;
    const results = await conn.query('INSERT INOT users SET ?', user)
    res.json({
       message: 'User created successfully',
        data: results[0]
    })
} catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json ({
        message: 'Error creating user',
        error: error.message
    });
}
});
    /* user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: 'User added successfully',
        user: user }); */

    // path GET /users/:id สำหรับ get ข้อมูล user ที่มี id ตรงกับที่ส่งมา
      app.get('/user/:id', async (req, res) => {
        try {
            let id = req.params.id
            const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
            if (results[0].length == 0) {
                throw { statusCode: 404, message: 'User not found'};
            }
            res.json(results[0][0]);
        }
            catch (error) {
                console.error('Error fetching user:', error.message);
                let statusCode = error.statusCode || 500;
                res.status(statusCode).json({
                    message: 'Error fetching user',
                    error: error.message
                });
            }
      
    //res.send(req.body);

    //PUT /users/:id สำหรับแก้ไขข้อมูล user ที่มี id ตรงกับที่ส่งมา
    app.put('/users/id', async (req, res) => {
        try {
            let id = req.params.id
            const results = await conn.query('UPDATE users SET ? FROM WHERE id = ?', id)
            if (results[0].affectedRows == 0) {
                throw { statusCode: 404, message: 'User not found'};
            }
            res.json({
                message: 'User updated successfully',
                data: updateUser
            });
        }
            catch (error) {
                console.error('Error updating user:', error.message);
                let statusCode = error.statusCode || 500;
                res.status(statusCode).json({
                    message: 'Error updating user',
                    error: error.message
                });
            }
    })

    //DELETE /users/:id สำหรับลบข้อมูล user ที่มี id ตรงกับที่ส่งมา
    app.delete('/users/:id', async (req, res) => {
        try {
            let id = req.params.id
            const results = await conn.query('DELETE FROM users WHERE id = ?', id)
            if (results[0].affectedRows == 0) {
                throw { statusCode: 404, message: 'User not found'};
            }
            res.json({
                message: 'User deleted successfully'
            });
        }
            catch (error) {
                console.error('Error deleting user:', error.message);
                let statusCode = error.statusCode || 500;
                res.status(statusCode).json({
                    message: 'Error deleting user',
                    error: error.message
                });
            }
    })
        /* let updateUser = req.body; */
        // หา users จาก id
        /* selectedIndex = users.findIndex(user => user.id == id) */
            /* if (user.id == id) {
                return true
            } else {
                return false
            }
        }) */
        // update users นั้น
        users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
        users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
        users[selectedIndex].age = updateUser.age || users[selectedIndex].age
        users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender

        // ส่ง response กลับไปว่า update users ที่เลือกสำเร็จแล้ว

        res.json({
            message: 'User updated successfully',
            data : {
                user: updateUser,
                indexUpdated: selectedIndex
            }
        })

        //res.send(selectedIndex + '')
    })

    //path = DELETE /users/:id
    app.delete('/user/:id', (req, res) => {
        let id = req.params.id
        let selectedIndex = users.findIndex(user => user.id == id)
        if (selectedIndex !== -1) {
            users.splice(selectedIndex, 1)
            res.json({
                message: 'User deleted successfully',
                data: {
                    indexDeleted: selectedIndex
                }
            })
        } else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    })

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`); 
}); 