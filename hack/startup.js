/** @param {NS} ns **/
export async function main(ns) {
	var host = ns.args[0];
	var target = ns.args[1];

	if (host != "home") {
		var prepFile = "/hack/prepServer.js";
		var hackFile = "/hack/hackBundle.js";
	}
	
	await ns.scp(prepFile, "home", host);
	await ns.scp(hackFile, "home", host);

	var pid = ns.exec(prepFile, host, 1, host, target);
	while (ns.isRunning(pid)) {
		await ns.sleep(5000);
	}

	ns.exec(hackFile, host, 1, host, target);
}