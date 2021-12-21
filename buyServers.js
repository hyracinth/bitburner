/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	var ram = ns.getPurchasedServerMaxRam();
	var purchServCount = ns.getPurchasedServers().length;

	if (purchServCount == ns.getPurchasedServerLimit()) {
		ns.tprint("Cannot purchase any more servers.");
		return;
	}

	while (purchServCount <= ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			ns.purchaseServer("pserv_" + purchServCount++, ram);
		}
		await ns.sleep(60000);
		break;
	}
}