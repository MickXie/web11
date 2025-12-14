require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();

app.use(express.json());
app.use(express.static('public'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});


app.post('/students', async (req, res) => {
  const { name, age, grade } = req.body;
  const student = new Student({ name, age, grade });
  const savedStudent = await student.save();
  res.json(savedStudent);
});


app.delete('/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: '找不到學生' });
    }
    res.json({ message: '刪除成功' });
  } catch {
    res.status(400).json({ error: 'ID 格式錯誤' });
  }
});

app.put('/students/:id', async (req, res) => {
  const { name, age, grade } = req.body;
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, grade },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(400).json({ error: '更新失敗' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
