/** @param {NS} ns **/
export async function main(ns) {
	const crimeList = [
		"shoplift",		//1
		"rob store",	//2
		"mug someone",	//3
		"larceny",		//4
		"deal drugs", 	//5
		"bond forgery",	//6
		"traffick illegal arms",
		"homicide",		//8
		"grand theft auto",	//9
		"kidnap and ransom",	//10
		"assassinate",	//11
		"heist"			//12
	];

	while (true) {
		const time = ns.commitCrime(crimeList[4])
		await ns.sleep(time * 0.9);
		if (!ns.isBusy()) {
			break;
		}
		while (ns.isBusy()) {
			await ns.sleep(50);
		}
	}
}