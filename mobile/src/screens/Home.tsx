import { useState, useCallback } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { useNavigation, useFocusEffect  } from '@react-navigation/native'

import { api } from '../lib/axios'
import dayjs from 'dayjs'
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates'

import { HabitDay, DAY_SIZE } from '../components/HabitDay'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length

type SummaryProps = {
	id: string
	date: string
	amount: number
	completed: number
}[]

export function Home(){
	const [ loading, setLoading ] = useState(true)
	const [ summary, setSummary ] = useState<SummaryProps | null>(null)

	const { navigate } = useNavigation()

	async function fetchData() {
		try {
			setLoading(true)

			const response = await api.get('/summary')
			
			setSummary(response.data)

		} catch (error) {
			Alert.alert('Ops', 'Não foi possível listar os hábitos cadastrados')
		} finally {
			setLoading(false)
		}
	}

	useFocusEffect(useCallback(() => {
		fetchData()
	}, []))

	if(loading) return <Loading />

	return(
		<View className="flex-1 bg-background px-8 pt-16">
			<Header />

			<View className="flex-row mt-6 mb-2 w-full">
				{
					weekDays.map((weekDay, index) => (
						<Text
							key={`${weekDay}-${index}`}
							className="text-zinc-400 text-xs lowercase font-bold text-center mx-1"
							style={{ width: DAY_SIZE }}>
							{weekDay}
						</Text>
					))
				}
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
				{
					summary &&
					<View className="flex-row flex-wrap">
					<>
					{
						datesFromYearStart.map(date => {
							const dayWithHabits = summary.find(day => {
								return dayjs(date).isSame(day.date, 'day')
							})

							return(
								<HabitDay
									key={date.toISOString()}
									date={date} amountOfHabits={dayWithHabits?.amount} amountCompleted={dayWithHabits?.completed}
									onPress={() => navigate('habit', { date: date.toISOString() })}
								/>
							)
							
						})
					}

					{
						amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill })
						.map((_, index) => (
							<View key={index} className="rounded-lg m-1 border-2 bg-zinc-900 border-zinc-800 opacity-70"
							style={{ width: DAY_SIZE, height: DAY_SIZE }} />
						))
					}
					</>
				</View>
				}
			</ScrollView>
		</View>
	)
}