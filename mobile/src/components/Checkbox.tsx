import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'

// Extende a tipagem do botão com as propriedades do Touchable
interface Props extends TouchableOpacityProps {
	title: string
	checked?: boolean
}

export function Checkbox({ title, checked, ...rest }:Props) {
	return(
		<TouchableOpacity activeOpacity={.7} className="flex-row mb-2 items-center" {...rest}>
			{
			checked ?
				<Animated.View className="h-8 w-8 border-2 border-green-600 bg-green-500 rounded-lg items-center justify-center"
					entering={ZoomIn} exiting={ZoomOut}>

					<Feather name="check" size={20} color={colors.white} />
				</Animated.View>
			:
				<View className="h-8 w-8 border-2 border-zinc-700 bg-zinc-800 rounded-lg items-center justify-center" />
			}

			<Text className="text-white text-base ml-3">{title}</Text>
		</TouchableOpacity>
	)
}