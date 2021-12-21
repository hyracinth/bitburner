/** @param {NS} ns **/

// Get all servers
export function getServerList(ns, homeServer) {
	var queue = [homeServer];
	var serverList = [];

	while (queue.length != 0) {
		var currentServer = queue.shift();
		serverList.push(currentServer);
		var servers = ns.scan(currentServer);
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
	var target = "";
	var targetRatio = 0;

	serverList.forEach(x => {
		var currRatio = ns.getServerMaxMoney(x) / ns.getWeakenTime(x);
		if (currRatio > targetRatio && ns.getWeakenTime(x) < 180000) {
			targetRatio = currRatio;
			target = x;
		}
	});

	return target;
}