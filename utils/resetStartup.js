/** @param {NS} ns **/
export async function main(ns) {
	ns.exec("/utils/expFarm.js", "home");
	var pid = ns.exec("/utils/nukeAll.js", "home");

	if(ns.isRunning(pid)) {
		await ns.sleep(2000);
	}

	ns.exec("/hackv3/hackStaggerBatch.js", "home", 1, "home", "phantasy");	
}