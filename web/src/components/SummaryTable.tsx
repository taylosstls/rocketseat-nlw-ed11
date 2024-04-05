import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFull = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[]

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)
    })
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => {
          return(
            <div key={`${weekDay}-${index}`} className="text-zinc-400 text-xl w-10 h-10 flex items-center justify-center font-bold">{weekDay}</div>
          )
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && summaryDates.map(date => {
          const dayInSummary = summary.find(day => dayjs(date).isSame(day.date, 'day'))
          return (
					<HabitDay
						key={date.toString()} date={date} amount={dayInSummary?.amount} defaultCompleted={dayInSummary?.completed} />
					)
        })}

        {amountOfDaysToFull > 0 &&
        Array.from({ length: amountOfDaysToFull }).map((_, index) => {
          return(
            <div key={index} className="w-10 h-10 bg-zinc-900 border-zinc-800 border-2 opacity-40 rounded-lg cursor-not-allowed"></div>
          )
        })}

      </div>
    </div>
  )
}