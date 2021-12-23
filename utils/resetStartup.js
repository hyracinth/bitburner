/** @param {NS} ns **/
export async function main(ns) {
	var target = (ns.args[0] == null) ? "foodnstuff" : ns.args[0];
	var pid = ns.exec("/utils/nukeAll.js", "home");
	if (ns.isRunning(pid)) {
		await ns.sleep(2000);
	}
	ns.exec("/utils/expFarm.js", "home");
	ns.exec("/hackv3/hackStaggerBatch.js", "home", 1, "home", target);
}