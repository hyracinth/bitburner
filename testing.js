/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	var maxRam = ns.getPurchasedServerMaxRam();
	var maxCost = ns.getPurchasedServerCost(ns.getPurchasedServerMaxRam());
	ns.tprint(ns.nFormat(maxRam, '0.000b'));
	ns.tprint(ns.nFormat(maxCost, '($ 0.00 a)'));

	ns.tprint(ns.getPlayer().hacking_money_mult);

	var target = "";
	var targetRatio = 0;
	var queue = ["home"];
	var serverList = [];

	while (queue.length != 0) {
		var currentServer = queue.shift();
		serverList.push(currentServer);
		var servers = ns.scan(currentServer);
		servers.forEach(x => {
			if (!serverList.includes(x)) {
				var currRatio = ns.getServerMaxMoney(x) / ns.getWeakenTime(x);
				if (currRatio > targetRatio) {//&& ns.getWeakenTime(x) < 180000) {
					targetRatio = currRatio;
					target = x;
				}
				queue.push(x);
			}
		});
	}

	ns.tprint(target);

	if (false) {
		serverList.forEach(x => {
			if (!x.startsWith("pserv") && ns.getServerMaxRam(x) > 8) {

				var serverMaxMoney = ns.getServerMaxMoney(x);
				var weakenTime = ns.getWeakenTime(x);
				var growTime = ns.getGrowTime(x);
				var hackTime = ns.getHackTime(x);
				var growthFactor = ns.getServerGrowth(x);

				ns.tprint(`${hackTime}\t${growTime}\t${weakenTime}\t${growthFactor}\t${hackTime < growTime}\t${growTime < weakenTime}${x}`);

				// ns.tprint("***************************");
				// ns.tprint(x);
				// ns.tprint("Max Money: " + serverMaxMoney);
				// ns.tprint("Weak Time: " + weakenTime);
				// ns.tprint("Grow Time: " + growTime);
				// ns.tprint("Hack Time: " + hackTime);
				// ns.tprint("Max/Weak: " + serverMaxMoney / weakenTime);
			}
		});

		// ns.tprint(serverList);
	}

}