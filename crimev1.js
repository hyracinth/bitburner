/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");

	const crimeList = [
		"shoplift",		//0
		"rob store",	//1
		"mug someone",	//2
		"larceny",		//3
		"deal drugs", 	//4
		"bond forgery",	//5
		"traffick illegal arms",
		"homicide",		//7
		"grand theft auto",	//8
		"kidnap and ransom",	//9
		"assassinate",	//10
		"heist"			//11
	];

	while (true) {
		const time = ns.commitCrime(crimeList[2])
		await ns.sleep(time * 0.9);
		if (!ns.isBusy()) {
			break;
		}
		while (ns.isBusy()) {
			await ns.sleep(50);
		}
	}
}