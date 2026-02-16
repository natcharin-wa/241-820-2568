const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

app.use(bodyParser.json());

let users = []
let counter = 1;

//path = /user
app.get('/users', (req, res) => {
    res.json(users);
    /*let user = {
        name: 'John Doe',
        age: 30,
        email: 'john.doe@example.com'
    };
    res.json(user); */
    //res.send('Hello World!');
});

//path = POST /user
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: 'User added successfully',
        user: user });
    })
    //res.send(req.body);

    //path = PUT /user/:id
    app.patch('/user/:id', (req, res) => {
        let id = req.params.id
        let updateUser = req.body;
        // หา users จาก id
        let selectedIndex = users.findIndex(user => {
            if (user.id == id) {
                return true
            } else {
                return false
            }
        })
        // update users นั้น
        if (updateUser.name) {
            users[selectedIndex].name = updateUser.name
        } 
        if (updateUser.age) {
            users[selectedIndex].age = updateUser.age
        }

        users[selectedIndex].name = updateUser.name || users[selectedIndex].name
        users[selectedIndex].age = updateUser.age || users[selectedIndex].age

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
}); 