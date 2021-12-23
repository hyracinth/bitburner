/** @param {NS} ns **/
export async function main(ns) {
	if (ns.args.length < 1) {
		ns.tprint("Usage: tracenet.js TARGET ?CONNECT");
		return;
	}

	let target = ns.args[0];
	let connectPath = (ns.args[1] == null) ? true : false;

	let visited = [];
	let stack = [];
	let parentList = [];
	let start = "home";
	stack.push(start);

	let counter = 0;
	let failSafeIterations = 10000;

	while (stack.length > 0) {
		let currentServ = stack.pop();

		if (!visited.includes(currentServ)) {
			visited.push(currentServ);
			let childServs = ns.scan(currentServ);
			for (let ii = 0; ii < childServs.length; ii++) {
				if (childServs[ii] == target) {
					parentList.push([currentServ, childServs[ii]]);
					stack = [];
					break;
				}
				if (childServs[ii] != start && !childServs[ii].startsWith("pserv")) {
					stack.push(childServs[ii]);
					parentList.push([currentServ, childServs[ii]]);
				}
			}
		}
		if (counter++ > failSafeIterations) {
			break;
		}
	}

	let path = [];
	let iterator = target;
	while (iterator != start) {
		path.push(iterator);
		for (var ii = 0; ii < parentList.length; ii++) {
			if (parentList[ii][1] == iterator) {
				iterator = parentList[ii][0];
				break;
			}
		}
	}

	if (connectPath) {
		let revPath = path.reverse();
		let result = "connect ";
		for(let ii = 0; ii < revPath.length; ii++) {
			result += revPath[ii] + "; connect ";
		}
		ns.tprint(result.substring(0, result.length - 9));
	}
	else {
		ns.tprint(path.reverse());
	}
}