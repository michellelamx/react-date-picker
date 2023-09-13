import { useEffect, useRef, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek
} from 'date-fns'


export function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen ] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const clickOutside = e => {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', clickOutside)

    return () => {
      document.removeEventListener('click', clickOutside)
    }
  }, [isOpen])

  return (
    <div className='date-picker-container' ref={ref}>
      <button
        className='date-picker-button'
        onClick={() => setIsOpen(o => !o)}
      >
        {value == null ? 'Select a Date' : format(value, 'MMMM d, yyyy')}
      </button>
      {isOpen && <DatePickerModal onChange={onChange} value={value} />}
    </div>
  )
}


function DatePickerModal({ value, onChange}) {
  const [visibleMonth, setVisibleMonth] = useState(value || new Date())

  const visibleDates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth))
  })

  useEffect(() => {
    const handleArrowPress = (e) => {
      if (e.key === 'ArrowLeft') {
        showPreviousMonth()
      }
      if (e.key === 'ArrowRight') {
        showNextMonth()
      }
    }

    window.addEventListener('keydown', handleArrowPress)

    return() => window.removeEventListener('keydown', handleArrowPress)
  }, [])

  function showPreviousMonth() {
    setVisibleMonth(currentMonth => {
      return addMonths(currentMonth, -1)
    })
  }

  function showNextMonth() {
    setVisibleMonth(currentMonth => {
      return addMonths(currentMonth, 1)
    })
  }

  return (
    <div className='date-picker'>
      <div className='date-picker-header'>
        <button
          className='month-button prev-month'
          onClick={showPreviousMonth}
          onKeyDown={(e) => e.key === 'LeftArrow' && showPreviousMonth}
        >
          &larr;
        </button>
        <div className='current-month'>{format(visibleMonth, 'MMMM yyyy')}</div>
        <button
          className='next-month-button month-button'
          onClick={showNextMonth}
        >
          &rarr;
        </button>
      </div>
      <div className='date-picker-grid grid-header'>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className='date-picker-grid grid-dates'>
        {visibleDates.map(date => (
          <button
            onClick={() => onChange(date)}
            className={`date ${
              !isSameMonth(date, visibleMonth) ? 'other-month-dates' : ''
            } ${isSameDay(date, value) ? 'selected' : ''} ${
              isToday(date) ? 'today' : ''
            }`}
            key={date.toDateString()}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  )
}
