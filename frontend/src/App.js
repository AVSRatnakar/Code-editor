import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const supportedLanguages = ['javascript', 'python'];

function CodeEditor() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [output, setOutput] = useState('');

  const executeCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/execute', { code, language });
      setOutput(response.data.output || 'No Output');
    } catch (error) {
      console.error('Error executing code:', error.message);
      setOutput('Error executing code. Please check your code and try again.');
    }
  };

  return (
    <div className="App">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code"
      />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="" disabled>
          Select a language
        </option>
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <button onClick={executeCode}>Execute</button>
      <div>
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default CodeEditor;
