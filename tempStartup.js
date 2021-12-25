/** @param {NS} ns **/
export async function main(ns) {
	ns.exec("custom.js", "home", 1);
	let pid = ns.exec("hackv3EarlyStartup.js", "home", 1, "foodnstuff");
	while(ns.isRunning(pid)) {
		await ns.sleep(500);
	}
	pid = ns.exec("hackv1Controller.js", "home", 1, "joesguns");
		while(ns.isRunning(pid)) {
		await ns.sleep(500);
	}
	ns.exec("utilsExpFarm.js", "home", 1);
}