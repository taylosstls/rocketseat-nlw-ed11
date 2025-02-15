import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react";
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const avaiableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

export function NewHabitForm() {

	const [title, setTitle] = useState('')
	const [weekDays, setWeekDays] = useState<number[]>([]) // identificando ao useState que é um array númerico


	async function createNewHabit(event: FormEvent) {
		event.preventDefault()

		if(!title.trim() || weekDays.length === 0) return alert('Nenhum campo foi preenchido')

		await api.post('habits', { title, weekDays})

		alert('Hábito criado com sucesso!')

		setTitle('')
		setWeekDays([])
	}

	function handleToggle(weekDay: number) {
		if(weekDays.includes(weekDay)) {
			const RemoveDays = weekDays.filter(day => day !== weekDay)
			setWeekDays(RemoveDays)
		} else {
			const AddDays = [...weekDays, weekDay]
			setWeekDays(AddDays)
		}
		
	}

	return (
		<form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
			<label htmlFor="title" className="font-semibold leading-tight">
				Qual seu comprometimento?
			</label>

			<input className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400" type="text" id="title" placeholder="ex.: Exercícios, dormir bem, etc..." onChange={event => setTitle(event.target.value)} autoFocus value={title} />

			<label htmlFor="" className="font-semibold leading-tight mt-6">
				Qual a recorrência?
			</label>

			<div className="flex flex-col gap-2 mt-3">
				{avaiableWeekDays.map((weekDay, index) => {
					return(
						<Checkbox.Root key={weekDay} checked={weekDays.includes(index)} onCheckedChange={() => handleToggle(index)} className='flex items-center gap-3 group'>
							<div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 transition-colors group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
								<Checkbox.Indicator>
									<Check size={20} className='text-white' />
								</Checkbox.Indicator>
							</div>
							<span className='text-white leading-tight'>{weekDay}</span>
						</Checkbox.Root>
					)
				})}
				
			</div>

			<button type="submit" className="mt-8 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 transition duration-300 hover:bg-green-400">
				<Check size={20} weight="bold" />
				Confirmar
			</button>
		</form>
	)
}