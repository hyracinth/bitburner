/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    var func = ns.args[1];
    var time = ns.args[2];

    switch(func) {
        case "HACK":
            await ns.sleep(time);
            await ns.hack(target);
            break;
        case "GROW":
            await ns.sleep(time);
            await ns.grow(target);
            break;
        case "WEAK":
            await ns.sleep(time);
            await ns.weaken(target);
            break;
    }    
}