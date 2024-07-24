export namespace VerifyRegex {
	export const verifyLetterNumberSpace = (s: string): Boolean => {
		return /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(s);
	};

	export const verifyLetterNumber = (s: string): Boolean => {
		return /^[A-Za-z0-9]*$/.test(s);
	};
	export const verifyLetterAndDash = (s: string): Boolean => {
		return /^[A-Za-z-]*$/.test(s);
	};
}
