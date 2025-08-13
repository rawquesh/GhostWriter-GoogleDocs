import { useState } from 'react'
import {
  Box,
  Button,
  Image,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import HumanTypingSimulation from './typer'
import './index.css'

const MotionBox = motion(Box)

export default function App() {
  const [userInput, setUserInput] = useState('')
  const [simulationText, setSimulationText] = useState(null)
  const [avgSpeed, setAvgSpeed] = useState(110)
  const [errorRate, setErrorRate] = useState(7)
  const [correctionSpeed, setCorrectionSpeed] = useState(150)
  const [breakTime, setBreakTime] = useState(1)
  const [breakEvery, setBreakEvery] = useState(10)
  const [isPaused, setIsPaused] = useState(false)

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  function clearText() {
    setSimulationText('')
    setUserInput('')
  }

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const startSimulation = () => {
    setSimulationText(userInput)
  }

  const bgColor = useColorModeValue('white', 'gray.800')
  const primaryColor = '#8a3afb'
  const labelFontSize = 'sm' // Define a single variable for font size

  return (
    <MotionBox
      className="container"
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex className="settings-row2" mb={4} align="center">
        <Image src={logo} alt="logo" boxSize="50px" />
        <FormControl ml={4}>
          {/* Use the variable here */}
          <FormLabel fontSize={labelFontSize}>Break Time (min)</FormLabel>
          <Input
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
            step="0.1"
            min="0"
            max="60"
            borderColor={primaryColor}
          />
        </FormControl>
        <FormControl ml={4}>
          {/* Use the variable here */}
          <FormLabel fontSize={labelFontSize}>Break Every (min)</FormLabel>
          <Input
            type="number"
            value={breakEvery}
            onChange={(e) => setBreakEvery(e.target.value)}
            step="0.1"
            min="0"
            max="60"
            borderColor={primaryColor}
          />
        </FormControl>
      </Flex>
      <Flex className="settings-row" mb={4}>
        <FormControl>
          {/* Use the variable here */}
          <FormLabel fontSize={labelFontSize}>Avg Speed (WPM)</FormLabel>
          <Input
            type="number"
            value={avgSpeed}
            onChange={(e) => setAvgSpeed(e.target.value)}
            borderColor={primaryColor}
          />
        </FormControl>
        <FormControl ml={4}>
          {/* Use the variable here */}
          <FormLabel fontSize={labelFontSize}>Error Rate (0-100%)</FormLabel>
          <Input
            type="number"
            value={errorRate}
            onChange={(e) => setErrorRate(e.target.value)}
            step="1"
            min="0"
            max="100"
            borderColor={primaryColor}
          />
        </FormControl>
        <FormControl ml={4}>
          {/* Use the variable here */}
          <FormLabel fontSize={labelFontSize}>Correction Speed</FormLabel>
          <Input
            type="number"
            value={correctionSpeed}
            onChange={(e) => setCorrectionSpeed(e.target.value)}
            borderColor={primaryColor}
          />
        </FormControl>
      </Flex>
      <Textarea
        value={userInput}
        onChange={handleInputChange}
        placeholder="Paste here..."
        rows="10"
        mb={4}
        borderColor={primaryColor}
      />
      <Flex className="buttons" justify="center">
        {!simulationText ? (
          <Button colorScheme="purple" onClick={startSimulation}>
            Start Simulation
          </Button>
        ) : (
          <Button colorScheme="purple" onClick={togglePause}>
            {isPaused ? 'Resume Simulation' : 'Pause Simulation'}
          </Button>
        )}

        {simulationText && (
          <Button colorScheme="gray" ml={4} onClick={clearText}>
            Clear
          </Button>
        )}
      </Flex>

      {simulationText && (
        <HumanTypingSimulation
          key={simulationText}
          text={simulationText}
          avgSpeed={avgSpeed * 5}
          errorRate={errorRate / 100}
          correctionSpeed={correctionSpeed}
          breakTime={breakTime}
          breakEvery={breakEvery}
          isPaused={isPaused}
        />
      )}
    </MotionBox>
  )
}