/** @param {NS} ns **/
export async function main(ns) {
	const crimeList = [
		"shoplift",
		"rob store",
		"mug someone",
		"larceny",
		"deal drugs",
		"bond forgery",
		"traffick illegal arms",
		"homicide",
		"grand theft auto",
		"kidnap and ransom",
		"assassinate",
		"heist"
	];

	while (true) {
		if (!ns.isBusy()) {
			ns.commitCrime(crimeList[4]);
		}
		await ns.sleep(10000);
	}
}