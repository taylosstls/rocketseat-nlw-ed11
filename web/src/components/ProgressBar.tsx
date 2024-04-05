interface ProgressBarProps {
	progress: number
}

export function ProgressBar(props: ProgressBarProps) {
	return (
		<div className="h-3 rounded-xl bg-zinc-700 mt-1 w-full overflow-hidden">
			<div
				role="progressbar"
				aria-label="Progresso de hábitos completados nesse dia"
				aria-valuenow={props.progress}
				className="h-full w-full transition-all rounded-xl bg-gradient-to-r from-violet-900 via-violet-800 to-violet-600"
				style={{ width: `${props.progress}%` }}
			/>
		</div>
	)
}
