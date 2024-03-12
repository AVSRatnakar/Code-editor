const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3001; // Choose your desired port

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Welcome to code editor backend!")
})
app.post('/execute', (req, res) => {
    const { code, language } = req.body;
  
    // Ensure that only allowed languages are executed
    const allowedLanguages = ['javascript', 'python', 'C', 'C++', 'java'];
    if (!allowedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid language' });
    }
  
    // Sanitize the code to prevent code injection
    const sanitizedCode = code.replace(/[^\w\s;=+*/()%.-]/g, '');
  
    // Set up the command based on the language
    let command = '';
    if (language.toLowerCase() === 'javascript') {
      const escapedCode = code.replace(/(["'])/g, "\\$1");
      command = `node -e "${escapedCode}"`;
    }

    else if (language.toLowerCase() === 'python') {
    // Ensure proper quotes around the code
    const escapedCode = code.replace(/(["'])/g, "\\$1");
    command = `python -c "${escapedCode}"`;
    }
  
    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing code:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      const output = stdout || stderr; // Depending on the language, output might be in stdout or stderr
      res.json({ output });
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
