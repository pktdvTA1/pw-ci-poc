export namespace EcoSystem {
	export enum BizType {
		GROUP = 'Group',
		INNER = 'Inner',
		Aliaz = 'Aliaz',
		EXTERNALBIZ = 'ExternalBiz',
	}
	export enum GroupName {
		PALACE_BLADE = 'Palace Blade',
		NEUNGZER = 'Neungzer',
		PALACE_BLADE_INTERNATIONAL = 'Palace Blade International',
		ENERGY_FISHING_TEA = 'Energy Fishing Tea',
		STROKUA = 'StrokUA',
		THEYTALK = 'Theytalk',
	}
	export enum Inner {
		PUSHMAN = 'Pushman',
		COMMITMAN = 'CommitMan',
		XCALIBER = 'xCaliber',
	}
	export enum Aliaz {
		SE7ENT = 'Se7eNT',
		EI8HT = 'Ei8ht',
	}
	export enum Nationality {
		TH = 'TH',
		MARS = 'Mars',
	}
	export enum Source {
		EMAIL = 'EMAIL',
		PHONE = 'PHONE',
		EXTERNAL = 'EXTERNAL',
	}
	export type Origin = `${
		| EcoSystem.GroupName
		| EcoSystem.Inner
		| EcoSystem.Aliaz}`;
}
