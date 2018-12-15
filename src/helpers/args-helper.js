export const ArgsHelper = {
	getArgs() {
		const [,, ...args] = process.argv;
		return args;
	}
};