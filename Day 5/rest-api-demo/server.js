const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('welcome to the dark hell');
});


let students = [ 
    {id: 1, name: 'Kratos', course:'Anger Management'},
    {id: 2, name: 'Arthur', Course:'How to move on from the past'},
    {id: 3, name: 'Franklin', Course:'Driving Class'},
    {id: 4, name: 'Trevor', Course:'Flight School'},
    {id: 5, name: 'Michael', Course:'Therapy Class'}
];

app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

app.get('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
});

app.post('/api/students', (req, res) => {
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        course: req.body.course
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: 'Student not found' });
    student.name = req.body.name || student.name;
    student.course = req.body.course || student.course;
    res.json(student);
});

app.delete('/api/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Student not found' });
    
    students.splice(index, 1);
    res.status(404).send();
});
     
app.listen(3000, () => {
    console.log('listening on port 3000');
});
