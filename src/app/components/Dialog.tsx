import React, { useState } from 'react'

export interface DialogProps {
	open: boolean
	onClose: () => void
	onNext: () => void
}

export const useDialog = <T extends DialogProps>(Component: React.FC<T>, onNext?: () => void): [React.FC, (open: boolean) => void] => {
	const [open, setOpen] = useState(false)
	const _Dialog = props => (
		<Component
			open={open}
			onClose={() => {
				setOpen(false)
			}}
			onNext={onNext}
			{...props} />
	)
	return [_Dialog, setOpen]
}
