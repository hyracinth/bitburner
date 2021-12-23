/** @param {NS} ns **/

// Get all servers
export function getServerList(ns, homeServer) {
	let queue = [homeServer];
	let serverList = [];

	while (queue.length != 0) {
		let currentServer = queue.shift();
		serverList.push(currentServer);
		let servers = ns.scan(currentServer);
		servers.forEach(x => {
			if (!serverList.includes(x)) {
				queue.push(x);
			}
		});
	}

	// Removes "home" from server list
	serverList.shift();
	return serverList;
}

export function getHackTarget(ns, serverList) {
	let target = "";
	let targetRatio = 0;

	serverList.forEach(x => {
		let currRatio = ns.getServerMaxMoney(x) / ns.getWeakenTime(x);
		if (currRatio > targetRatio && ns.getWeakenTime(x) < 180000) {
			targetRatio = currRatio;
			target = x;
		}
	});

	return target;
}