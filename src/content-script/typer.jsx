import { useEffect,useState } from 'react'

function HumanTypingSimulation({
  text,
  avgSpeed,
  errorRate,
  correctionSpeed,
  breakTime,
  breakEvery,
  isPaused,
}) {
  const [output, setOutput] = useState('')
  const [index, setIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [nextBreakTime, setNextBreakTime] = useState(breakEvery * 60 * 1000) // Convert breakEvery to milliseconds
  const [elapsedTime, setElapsedTime] = useState(0)
  useEffect(() => {
    if (isPaused) return // Don't execute any logic if paused

    if (index >= text.length && errors === 0) {
      return // Typing complete
    }

    // Check if it's time for a break
    if (breakTime > 0 && breakEvery > 0 && elapsedTime >= nextBreakTime) {
      setIsOnBreak(true)
      setNextBreakTime(elapsedTime + breakEvery * 60 * 1000) // Set the next break time
    }

    if (isOnBreak) {
      // If we are on a break, don't type anything
      const timeout = setTimeout(() => {
        setIsOnBreak(false) // End the break
      }, breakTime * 60 * 1000) // Break duration
      return () => clearTimeout(timeout)
    }

    const typeNext = () => {
      const isError = Math.random() < errorRate

      if (isError) {
        const char = String.fromCharCode(97 + Math.floor(Math.random() * 26))
        // setOutput((prev) => prev + char);
        typeCharacter(char)
        setErrors((prev) => prev + 1)
      } else {
        if (text[index] === '\n') {
          // If the character is a newline, convert it to a <br/> for HTML rendering
          // setOutput((prev) => prev + "<br/>");
          addNewLineOrBackSpace(true)
        } else {
          // setOutput((prev) => prev + text[index]);
          typeCharacter(text[index])
        }
        setIndex((prev) => prev + 1)
      }
    }

    const correctError = () => {
      // setOutput((prev) => prev.substring(0, prev.length - 1));
      addNewLineOrBackSpace(false)
      setErrors((prev) => prev - 1)
    }

    const timeToNextChar = (60 * 1000) / avgSpeed
    const delay = errors > 0 ? correctionSpeed : timeToNextChar + (Math.random() - 0.5) * 200

    const timeout = setTimeout(() => {
      setElapsedTime((prev) => prev + delay)
      if (errors > 0) {
        correctError()
      } else {
        typeNext()
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [
    output,
    index,
    errors,
    isOnBreak,
    nextBreakTime,
    elapsedTime,
    breakTime,
    breakEvery,
    isPaused,
  ])

  return <div className="simulate-text"></div>
  // return <div className="simulate-text">{output}</div>;
}

function typeCharacter(char) {
  const input = document.querySelector('.docs-texteventtarget-iframe').contentDocument.activeElement
  const key = new KeyboardEvent('keypress', {
    bubbles: true,
    cancelable: true,
    keyCode: char.charCodeAt(0),
  })
  input.dispatchEvent(key)
}

function addNewLineOrBackSpace(isNewLine) {
  const input = document.querySelector('.docs-texteventtarget-iframe').contentDocument.activeElement
  const key = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: isNewLine ? 13 : 8,
  })
  input.dispatchEvent(key)
}

export default HumanTypingSimulation
