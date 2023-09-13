import { useState } from 'react'
import { DatePicker } from './DatePicker'
import './App.css'

export default function App() {
  const [value, setValue] = useState(new Date())

  return (
    <DatePicker
      value={value}
      onChange={setValue}
    />
  )
}
