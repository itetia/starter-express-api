const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
var cors =require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const dataBuffer = Buffer.from(buffer);
    const data = await pdf(dataBuffer);
    const text = data.text;
    const words = text.split(/\s+/).filter(Boolean).length;

    res.json({ wordCount: words });
  } catch (error) {
    console.error('Error parsing the PDF file:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
