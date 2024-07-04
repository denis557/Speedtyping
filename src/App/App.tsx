import React, { useState, useRef, useEffect } from 'react';
import { texts } from '../helpers/texts.ts'
import restart from '../assets/restart.svg';
import './App.css';

function App() {
  const time = 60;
  const [timeLeft, setTimeLeft] = useState(time);
  let [mistakes, setMistakes] = useState<number>(0);
  let [charIndex, setCharIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [correntWrong, setCorrectWrong] = useState<any>([]);
  const [currentText, setCurrentText] = useState(texts[Math.floor(Math.random() * texts.length)])
  const [isMain, setIsMain] = useState(true);
  const inputRef = useRef<any>(null);
  const charRef = useRef<any>([]);

  useEffect(() => {
    inputRef.current.focus();
    setCorrectWrong(Array (charRef.current.length).fill(''));
  }, [])

  useEffect(() => {
    let interval: number;
    if(isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        let correctChars = charIndex - mistakes;
        let totalTime = time - timeLeft;

        let wpm = Math.round((correctChars / 5 / totalTime) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWPM(wpm);
      }, 1000)
    } else if (timeLeft === 0) {
      // clearInterval(interval);
      setIsTyping(false);
    }

    return () => {
      clearInterval(interval);
    }
  }, [isTyping, timeLeft])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const characters = charRef.current;
    const currentChar = charRef.current[charIndex];
    const typedChar = e.target.value.slice(-1);
    if(charIndex < characters.length && timeLeft > 0) {
      if(!isTyping) {
        setIsTyping(true);
      }

      if(typedChar === currentChar.textContent) {
        setCharIndex(charIndex + 1);
        correntWrong[charIndex] = ' correct ';
      } else {
        setCharIndex(charIndex + 1);
        setMistakes(mistakes + 1);
        correntWrong[charIndex] = ' incorrect ';
      }

      if(charIndex === characters.length - 1) setIsTyping(false);
    } else {
      setIsTyping(false);
    }
  }

  function reset() {
    setTimeLeft(time);
    setMistakes(0);
    setCharIndex(0);
    setIsTyping(false);
    setWPM(0);
    setCorrectWrong(Array (charRef.current.length).fill(''));
    setIsMain(true);
    inputRef.current.focus();
    setCurrentText(texts[Math.floor(Math.random() * texts.length)])
  }

  return (
    <div className='body'>
      {isMain ?
      <>
        <div className='content'>
          <input className='input' onChange={e => handleChange(e)} ref={inputRef} />
          <p className='text'>
            {currentText.split('').map((char, index) => <span key={index} className={`char${index === charIndex ? ' active' : ''}${correntWrong[index]}`} ref={(e) => charRef.current[index] = e}>{char}</span>)}
          </p>
        </div>
        <img src={restart} className='restart' onClick={reset} />
        <div className='bar'>
          <p>15</p>
          <p>30</p>
          <p>60</p>
          <p>120</p>
        </div>
      </>
       : 
      <>
      </>
      }
    </div>
  )
}

export default App
