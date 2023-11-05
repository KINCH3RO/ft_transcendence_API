export default interface UserData {
	id: string
	userName: string;
	avatarUrl: string;
	bannerUrl: string;
	profile: {
		id: string;
		rating: number;
		level: number;
		xp: number;
		coins: number;
	};
}
