export class Config {
		private PREFIX: string;
		private NAMEBOT: string;
		private ACTIVITY: string;

		constructor() {
				this.PREFIX = '.';
				this.NAMEBOT = 'Reminder';
				this.ACTIVITY = '> use .remind';
		}

		public get prefix(): string {
				return this.PREFIX;
		}

		public get namebot(): string {
				return this.NAMEBOT;
		}

		public get activity(): string {
				return this.ACTIVITY;
		}
}
