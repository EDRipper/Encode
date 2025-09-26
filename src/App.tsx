import { useState } from 'react'
import Key from './assets/lock.png'
import Lock from './assets/key.png'
import './App.css'
import Header from './components/header'
import DecryptedText from './DecryptedText'
import ScrambledText from './ScrambledText'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />

      <ScrambledText
        className="scrambled-text-demo"
        radius={100}
        duration={1.2}
        speed={0.5}
        scrambleChars={".:"}
      >
      
        Trick Euan, Win his fortune...
        
        Encode a sectret message with a cypher or steganography, Make me waste my time figuring it out, The more time I spend the more you win!
      
      </ScrambledText>



      <div>
        <a href="/encrypt">
          <img src={Lock} className="key logo" alt="a key" />
        </a>
        <a href="/decrypt">
          <img src={Key} className="lock logo" alt="a lock" />
        </a>
      </div>

      <div className="card">
        RSVP
        <p>do some shit</p>
      </div>

      <p className="read-the-docs">made with hate by euan ripper</p>
    </>
  )
}

export default App
