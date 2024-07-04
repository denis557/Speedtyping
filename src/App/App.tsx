import React, { useState, useRef, useEffect } from 'react';
import { texts } from '../helpers/texts.ts'
import restart from '../assets/restart.svg';
import './App.css';

function App() {
  // const time = 60;
  const [time, setTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(time);
  const [mistakes, setMistakes] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState<number | string>(0);
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
        const correctChars = charIndex - mistakes;
        const totalTime = time - timeLeft;

        let wpm = Math.round((correctChars / 5 / totalTime) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWPM(wpm);

        let acc = 100 - (100 * mistakes / charIndex);
        acc = acc < 0 || !acc || acc === Infinity ? 0 : acc;
        setAccuracy(acc.toFixed(2));
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTyping(false);
      setIsMain(false);
      console.log('worked, gadi');
      console.log(WPM);
      console.log(accuracy);
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

      if(charIndex === characters.length - 1) {
        setIsTyping(false);
        setIsMain(false);
      }
    } else {
      setIsTyping(false);
      setIsMain(false);
      console.log('ehse raz, gadi')
    }
  }

  function changeTime(seconds: number): void {
    setTime(seconds);
    setTimeLeft(seconds);
    inputRef.current.focus;
  }

  function reset() {
    setTimeLeft(time);
    setMistakes(0);
    setCharIndex(0);
    setIsTyping(false);
    setWPM(0);
    setCorrectWrong(Array (charRef.current.length).fill(''));
    setIsMain(true);
    setCurrentText(texts[Math.floor(Math.random() * texts.length)])
  }

  return (
    <div className='body'>
      {isMain ?
      <>
        <div className='content'>
          <p className='time_left'>{timeLeft}</p>
          <input className='input' onChange={e => handleChange(e)} ref={inputRef} />
          <p className='text' onClick={() => inputRef.current.focus()}>
            {currentText.split('').map((char, index) => <span key={index} className={`char${index === charIndex ? ' active' : ''}${correntWrong[index]}`} ref={(e) => charRef.current[index] = e}>{char}</span>)}
          </p>
        </div>
        <img src={restart} className='restart' onClick={reset} />
        <div className='bar'>
          <p onClick={() => changeTime(15)}>15</p>
          <p onClick={() => changeTime(30)}>30</p>
          <p onClick={() => changeTime(60)}>60</p>
          <p onClick={() => changeTime(120)}>120</p>
        </div>
      </>
       : 
      <div className='result_section'>
        <div className='results'>
          <p>{WPM} WPM</p>
          <p>{accuracy}% ACC</p>
        </div>
        <p>{time}</p>
        <img src={restart} className='restart' onClick={reset} />
      </div>
      }
    </div>
  )
}

export default App
