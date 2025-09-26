import DecryptedText from '../DecryptedText'
import './Header.css' 

export default function Header() {
  return (
    <header className="header">
      <h1 className="title">
        <DecryptedText text="Welcome To Encrypt" />
      </h1>
    </header>
  )
}
