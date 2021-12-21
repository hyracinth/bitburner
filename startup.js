/** @param {NS} ns **/
export async function main(ns) {
    await ns.exec("buyServers.js", "home", 1);
	await ns.exec("hackController.js", "home", 1);
}