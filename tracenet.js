/** @param {NS} ns **/
export async function main(ns) {
	// var target = "run4theh111z";
	var target = ns.args[0];

	var visited = [];
	var stack = [];
	var parentList = [];
	var start = "home";
	stack.push(start);

	while (stack.length > 0) {
		var currentServ = stack.pop();

		if (!visited.includes(currentServ)) {
			visited.push(currentServ);
			var childServs = ns.scan(currentServ);
			for (var ii = 0; ii < childServs.length; ii++) {
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

	var path = [];
	var iterator = target;
	var jj = 0;
	while (iterator != start) {
		path.push(iterator);
		for (var ii = 0; ii < parentList.length; ii++) {
			if (parentList[ii][1] == iterator) {
				iterator = parentList[ii][0];
				break;
			}
		}
	}

	ns.tprint(path.reverse());
}