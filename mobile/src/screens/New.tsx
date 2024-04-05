import { useState } from "react"
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'

import { BackButton } from "../components/BackButton"
import { Checkbox } from "../components/Checkbox"
import { api } from "../lib/axios"

const avaiableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sábado']

export function New() {
	const [title, setTitle] = useState('')
	const [weekDays, setWeekDays] = useState<number[]>([])

	function handleToggleWeekDay(weekDayIndex: number){
		if(weekDays.includes(weekDayIndex)) {
			// Desmarcar dia checkado
			setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
		} else {
			// Recupera o estado anterior (todo array) e adiciona o dia checkado
			setWeekDays(prevState => [...prevState, weekDayIndex])
		}
	}

	async function handleCreateNewHabit() {
		try {
			if (!title.trim() || weekDays.length === 0) return Alert.alert('Novo Hábito', 'Informe o nome do hábito e selecione a periodicidade.')


			await api.post('/habits', {title, weekDays})

			setTitle('')
			setWeekDays([])

			Alert.alert('Sucesso!', 'Hábito cadastrado com sucesso.')
			
		} catch (error) {
			console.log(error)
			Alert.alert('Ops!', 'Não foi possível criar o novo hábito.')
		}
	}

	return(
		<View className="flex-1 bg-background px-8 pt-16">
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
				<BackButton />

				<Text className="mt-6 text-white font-extrabold text-3xl">
					Criar hábito
				</Text>

				<Text className="mt-6 text-white font-semibold text-base">
					Qual seu comprometimento?
				</Text>

				<TextInput className="h-12 pl-4 rounded-lg mt-3 border-2 border-zinc-700 bg-zinc-800 text-white focus: focus:border-green-600" placeholder="Ex.: Exercícios, dormir bem, etc..." placeholderTextColor={colors.zinc[400]} onChangeText={setTitle} value={title} />

				<Text className="mt-6 mb-3 text-white font-semibold text-base">
					Qual a recorrência?
				</Text>

				{avaiableWeekDays.map((weekDay, index) => {
					return(
							<Checkbox
							key={`${weekDay}-${index}`}
							onPress={() => handleToggleWeekDay(index)}
							checked={weekDays.includes(index)}
							title={weekDay} />
					)
				})}

				<TouchableOpacity className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6" activeOpacity={.7} onPress={handleCreateNewHabit}>
					<Feather name="check" size={20} color={colors.white} />
					<Text className="font-semibold text-base text-white ml-2">
						Confirmar
					</Text>
				</TouchableOpacity>
				
			</ScrollView>
		</View>
	)
}