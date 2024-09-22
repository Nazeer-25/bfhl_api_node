const express = require('express');
const bodyParser = require('body-parser');
const mime = require('mime-types');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post('/bfhl', (req, res) => {
  try {
    const data = req.body;

    // User details
    const user_id = 'nazeer_ahmed_25052003'; 
    const email = 'nazeer_ahmed@srmap.edu.in'; 
    const roll_number = 'AP21110010421'; 

    // Extract data and file_b64
    const dataArray = data.data || [];
    const file_b64 = data.file_b64 || '';

    // Separate numbers and alphabets
    const numbers = dataArray.filter((item) => /^[0-9]+$/.test(item));
    const alphabets = dataArray.filter((item) => /^[A-Za-z]+$/.test(item));

    // Find the highest lowercase alphabet
    const lowercaseAlphabets = alphabets.filter((item) => /^[a-z]+$/.test(item));
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

    // File handling
    let file_valid = false;
    let file_mime_type = '';
    let file_size_kb = '';

    if (file_b64) {
      try {
        // Decode base64 string
        const buffer = Buffer.from(file_b64, 'base64');
        file_size_kb = (buffer.length / 1024).toFixed(2); // Size in KB

        // Get MIME type
        file_mime_type = mime.lookup(buffer);

        file_valid = true;
      } catch (error) {
        file_valid = false;
      }
    }

    const response = {
      is_success: true,
      user_id: user_id,
      email: email,
      roll_number: roll_number,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      file_valid: file_valid,
      file_mime_type: file_mime_type,
      file_size_kb: file_size_kb,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ is_success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
