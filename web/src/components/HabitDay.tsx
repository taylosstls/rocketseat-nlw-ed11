import * as Popover from '@radix-ui/react-popover'
import { ProgressBar } from './ProgressBar'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { HabitsList } from './HabitsList'
import { useState } from 'react'

interface HabitDayProps {
	date: Date
	defaultCompleted?: number
	amount?: number
}

export function HabitDay({ defaultCompleted = 0, amount = 0, date }: HabitDayProps) {
	const [completed, setCompleted] = useState(defaultCompleted)

	const completedPercentage = amount > 0 ? Math.round((completed/amount) *100) : 0

	const dayAndMonth = dayjs(date).format('DD/MM')
	const dayofWeek = dayjs(date).format('dddd')

	const today = dayjs().startOf('day').toDate()
	const isCurrentDay = dayjs(date).isSame(today)

	function handleCompletedChanged(completed: number) {
		setCompleted(completed)
	}

  return (
		<Popover.Root>
			<Popover.Trigger className={clsx('w-10 h-10 border-2 rounded-lg transition-colors', {
				'bg-zinc-500 border-zinc-200 border-4': isCurrentDay && completedPercentage === 0,
				'border-zinc-200 border-4': isCurrentDay,
				'bg-zinc-900 border-zinc-800': completedPercentage === 0,
				'bg-violet-900 border-violet-800': completedPercentage > 0 && completedPercentage < 20,
				'bg-violet-800 border-violet-700': completedPercentage >= 20 && completedPercentage < 40,
				'bg-violet-700 border-violet-600': completedPercentage >= 40 && completedPercentage < 60,
				'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
				'bg-violet-500 border-violet-400': completedPercentage >= 80,
			})} />

			<Popover.Portal>
				<Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col shadow-lg shadow-violet-500/10'>
					<span className='font-semibold text-zinc-400'>{dayofWeek}</span>
					<span className='mt-1 font-extrabold leading-tight text-3xl'>{dayAndMonth}</span>

					<p className='p-0 mt-4 text-sm text-zinc-500'>
					{completedPercentage === 0 ? 'Objetivo não alcançado' : `Total concluído: ${completedPercentage}%`}
					</p>

					
					<ProgressBar progress={completedPercentage} />

					<HabitsList date={date} onCompletedChanged={handleCompletedChanged} />

					<Popover.Arrow width={16} height={8} className='fill-zinc-900' />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
  )
}