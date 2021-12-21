/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	// Override target to hack
	var target = ns.args[0];

	// Initial variables
	var homeServer = "home";
	var hackInitFile = "moduleHackInit.js";
	var weakenScript = "moduleWeaken.js";
	var growScript = "moduleGrow.js";
	var hackScript = "moduleHack.js";
	var portsOpened = 0;
	var programList = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPworm.exe", "SQLInject.exe"];
	programList.forEach(x => {
		if (ns.fileExists(x, homeServer)) {
			portsOpened++;
		}
	});

	var result = getServerList(ns, homeServer);
	var serverList = result[0];
	// Only take if no override
	if (target == null) {
		target = result[1];
	}

	ns.tprint("Ports Can Open: " + portsOpened);
	ns.tprint("Targetted Server: " + target);
	ns.tprint("Server list: " + serverList);

	for (var ii = 0; ii < serverList.length; ii++) {
		var serv = serverList[ii];
		if (ns.getServerRequiredHackingLevel(serv) <= ns.getHackingLevel() &&
			ns.getServerNumPortsRequired(serv) <= portsOpened) {
			// Purchased servers do not need hacking
			if (!serv.startsWith("pserv") && serv != homeServer) {
				if (ns.fileExists(programList[0], homeServer)) {
					ns.brutessh(serv);
				}
				if (ns.fileExists(programList[1], homeServer)) {
					ns.ftpcrack(serv);
				}
				if (ns.fileExists(programList[2], homeServer)) {
					ns.relaysmtp(serv);
				}
				if (ns.fileExists(programList[3], homeServer)) {
					ns.httpworm(serv);
				}
				if (ns.fileExists(programList[4], homeServer)) {
					ns.sqlinject(serv);
				}
				ns.nuke(serv);
			}
		}

		if (ns.getServerMaxRam(serv) >= 4) {
			await ns.scp(weakenScript, serv);
			await ns.scp(growScript, serv);
			await ns.scp(hackScript, serv);

			// Run all control scripts at home PC
			ns.killall(serv);
			ns.exec(hackInitFile, homeServer, 1, serv, target);
		}
	}
}

// Get all servers
function getServerList(ns, homeServer) {
	var target = "";
	var targetRatio = 0;
	var queue = [homeServer];
	var serverList = [];

	while (queue.length != 0) {
		var currentServer = queue.shift();
		serverList.push(currentServer);
		var servers = ns.scan(currentServer);
		servers.forEach(x => {
			if (!serverList.includes(x)) {
				var currRatio = ns.getServerMaxMoney(x) / ns.getWeakenTime(x);
				if (currRatio > targetRatio && ns.getWeakenTime(x) < 180000) {
					targetRatio = currRatio;
					target = x;
				}
				queue.push(x);
			}
		});
	}

	// Removes "home" from server list
	serverList.shift();
	return [serverList, target];
}