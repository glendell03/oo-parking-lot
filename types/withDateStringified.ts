export type WithDatesStringified<T> = T extends Date
	? string
	: T extends object
	  ? { [k in keyof T]: WithDatesStringified<T[k]> }
	  : T
