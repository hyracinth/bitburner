import { getServerList } from "/lib/utils.js"

/** @param {NS} ns **/
export async function main(ns) {
	const programList = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPworm.exe", "SQLInject.exe"];
	const homeServer = "home";
	var portsOpened = 0;
	programList.forEach(x => {
		if (ns.fileExists(x, homeServer)) {
			portsOpened++;
		}
	});

	var serverList = getServerList(ns, homeServer);

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
	}
}