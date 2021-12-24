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
		if(iterator == target) {
			ns.tprint("Target does not exist.");
			return;
		}
	}

	if (connectPath) {
		let revPath = path.reverse();
		for(let ii = 0; ii < revPath.length; ii++) {
			ns.connect(revPath[ii]);
		}
	}
	else {
		ns.tprint(path.reverse());
	}
}