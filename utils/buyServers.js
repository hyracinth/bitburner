/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	let ram = ns.getPurchasedServerMaxRam();
	let purchServCount = ns.getPurchasedServers().length;

	if (purchServCount == ns.getPurchasedServerLimit()) {
		ns.tprint("Cannot purchase any more servers.");
		return;
	}

	while (purchServCount <= ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			ns.purchaseServer("pserv_" + purchServCount++, ram);
			ns.tprint("Server bought");
		}
		break;
	}
}