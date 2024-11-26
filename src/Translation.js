import React, { useState } from 'react';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import './Translation.css';
import { API_Endpoint, API_KEY } from './config';
import githubLogo from './images/github-logo.png'; 
import linkedinLogo from './images/linkedin-logo.png';

const languages = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
};

const Translation = () => {
  const [text, setText] = useState('');
  const [translatedChunks, setTranslatedChunks] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('mr');

  const apiEndpoint = API_Endpoint;
  const apiKey = API_KEY;

  const splitText = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  };

  const translateChunk = async (chunk) => {
    const payload = {
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: {
              sourceLanguage: sourceLanguage,
              targetLanguage: targetLanguage,
            },
            serviceId: "ai4bharat/indictrans-v2-all-gpu--t4",
          },
        },
      ],
      inputData: {
        input: [
          {
            source: chunk,
          },
        ],
      },
    };

    try {
      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          Accept: '*/*',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      });

      const translatedText = response.data.pipelineResponse[0].output[0].target;
      return translatedText;
    } catch (error) {
      console.error('Error:', error);
      return 'Translation failed';
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    setTranslatedChunks([]);

    const chunks = splitText(text, 5000);

    for (const chunk of chunks) {
      const translatedText = await translateChunk(chunk);
      setTranslatedChunks((prevChunks) => [...prevChunks, translatedText]);
    }

    setIsTranslating(false);
  };

  return (
    <div className="translation-container">
      <div className="language-selector">
        <select
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
        >
          {Object.keys(languages).map((lang) => (
            <option key={lang} value={lang}>
              {languages[lang]}
            </option>
          ))}
        </select>
        <span>to</span>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {Object.keys(languages).map((lang) => (
            <option key={lang} value={lang}>
              {languages[lang]}
            </option>
          ))}
        </select>
      </div>
      <div className="input-box">
        <textarea
          rows="15"
          cols="50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
        />
        <button onClick={handleTranslate} disabled={isTranslating}>
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>
      <div className="output-box">
        <h3>Translated Text:</h3>
        {translatedChunks.map((chunk, index) => (
          <div key={index}>
            <Typewriter
              words={[chunk]}
              cursor={false}
              typeSpeed={30}
              deleteSpeed={15}
            />
          </div>
        ))}
      </div>
      <div className="icon-container">
        <a href="https://github.com/sarthpatil8" target="_blank" rel="noopener noreferrer">
          <img src={githubLogo}  alt="GitHub" />
        </a>
        <a href="https://www.linkedin.com/in/sarth-patil-7257541b2" target="_blank" rel="noopener noreferrer">
          <img src={linkedinLogo}  alt="LinkedIn" />
        </a>
      </div>
    </div>
  );
};

export default Translation;
