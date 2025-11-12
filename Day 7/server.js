const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
app.use(express.json());

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const dbName = 'studentsDB';

let db ,students;

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db(dbName);
        students = db.collection('students');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}
connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the Student API');
});

app.get('/students', async (req, res) => {
    const all = await students.find().toArray();
    res.status(200).json(all);
});

app.get('/students/:id', async (req, res) => {
    try {
        const student = await students.findOne({ _id: new ObjectId(req.params.id) });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: 'Invalid ID format' });
    }
});

app.post('/students', async (req, res) => {
    const {name, course, marks} = req.body;
    if (!name || !course || !marks) 
        return res.status(400).json({ message: 'Missing required fields' });

    const result = await students.insertOne({ name, course, marks });
    res.status(201).json({message: 'Student added', id: result.insertedId});
});


app.put('/students/:id', async (req, res) => {
    const {name, course, marks} = req.body;
    try {
        const result = await students.updateOne(
            {_id: new ObjectId(req.params.id)},
            {$set: {name, course, marks}}
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({message: 'Student not found'});
        }
        res.json({ message: 'Student updated' });
    } catch (err) {
        res.status(400).json({message: 'Invalid ID format'});
    }
});

app.delete('/students/:id', async (req, res) => {
    try {
        const result = await students.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0)
            return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid ID format' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');

});