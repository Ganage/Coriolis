"use stict"

/*
!coriolis
!coriolis crit
!coriolis rerolls
!coriolis push
!coriolis push [name]

*/

on('chat:message', function(msg) {

    log(msg);

    if (msg.type === "general") {
        handleGeneral(msg);
    }

    if (msg.type === "api" && msg.content.startsWith("!coriolis")) {
        handleCoriolisApi(msg);
    }
});

// Handle all normal rolls
function handleGeneral(msg) {
    if (msg.rolltemplate === "coriolis") {       
        prayToReroll(msg);
    }
}

// Handle coriolis script rolls
function handleCoriolisApi(msg) {
    const tokens = msg.content.split(" ");
    const cmd = tokens[1];

    if (cmd === "d66") {
        rollD66(msg);
    }
    else if (cmd == "crit") {
        rollCritical(msg);
    }
    else if (cmd == "test") {
        test(msg);
    }
    else if (cmd == "debug") {
        debug(msg);
    }
    else {
        showHelp(msg);
    }
}

getPlayerId = msg => `player|${msg.playerid}`;

getPlayerName = msg => getObj("player", msg.playerid).get("displayname");

tellUser = (originalMsg, msgToSend) => {
    const msg = `/w \"${getPlayerName(originalMsg)}\" ${msgToSend}`; 
    sendChat("Coriolis Help", msg, null, {
        noarchive: true
    });
};

function showHelp(originalMsg) {
    let msg = `You can do the following:<br>`;

    msg += "Roll on critical damage table<br>"
    msg += "[!coriolis crit](!coriolis crit)<br>";

    msg += "Roll a basic d66<br>"
    msg += "[!coriolis d66](!coriolis d66)<br>";

    msg += "API test<br>"
    msg += "[!coriolis test](!coriolis test)<br>";

    msg += "Dump debug info to API output console<br>"
    msg += "[!coriolis debug](!coriolis debug)<br>";

    tellUser(originalMsg, msg);
}

function prayToReroll(originalMsg) {

    const rolled = originalMsg.inlinerolls[0].results.rolls[0].dice;
    const successes = originalMsg.inlinerolls[0].results.total;

    const msg = `[Push roll ${successes} of ${rolled}](roll 2d6)`;
    tellUser(originalMsg, msg);

    let msg2 = "[Push roll](!crit)";
    tellUser(originalMsg, msg2);
}

function test(originalMsg) {

    let msg = "<div style='background-color: red;'>asdsadas</div>";
    tellUser(originalMsg, msg);

    let msg2 = "[Push roll](!crit)";
    tellUser(originalMsg, msg2);
    
    let msg3 = "&{template:coriolis}  {{isNotAdvanced=1}} {{name=^{attributes-strength}}} {{roll='2'}} {{pool='3'}} {{reroll='4'}}";
    tellUser(originalMsg, msg3);

    let msg4 = "&{template:coriolis}  {{isNotAdvanced=1}} {{name=^{attributes-strength}}} {{roll=$[[0]]}} {{pool=$[[1]]}} {{reroll=$[[2]]}}";
    tellUser(originalMsg, msg3);
}

function debug(originalMsg) {
    Log("Campaign:");
    log(Campaign);
    log("getAllObjs:");
    const all = getAllObjs();
    for (const iterator of all) {
        log(iterator);
    }
}

function rollD66(originalMsg) {
    // Let everybody see
    sendChat(getPlayerId(originalMsg), `D66: ${randomInteger(6)}${randomInteger(6)}`);
}

const criticals = [
    // D66, Injury, Fatal, Time limit, Effect, Heal time
    [11, "Wind Knocked Out", "No", "-", "Stunned for one turn.",  "-"],
    [12, "Disorientated", "No", "-", "Stunned for one turn.", "-"],
    [13, "Sprained Wrist", "No", "-", "Drops held item, then -1 to RANGED COMBAT and MELEE COMBAT.", "D6"],
    [14, "Sprained Ankle", "No", "-", "Falls down, then -1 to DEXTERITY and INFILTRATION.", "D6"],
    [15, "Concussion", "No", "-", "Stunned for one turn, then -1 to all advanced skills.", "D6"],
    [16, "Bruised Lower Leg", "No", "-", "Falls down, then -1 to DEXTERITY and INFILTRATION.", "2D6"],

    [21, "Broken Nose", "No", "-", "Stunned for one turn, then -2 to MANIPULATION.", "D6"],
    [22, "Broken Fingers", "No", " -", "Drops held item, then -2 to RANGED COMBAT and MELEE COMBAT.", "2D6"],
    [23, "Broken Toes", "No", "-", "Stunned for one turn, then -2 to DEXTERITY and INFILTRATION.", "2D6"],
    [24, "Teeth Knocked Out", "No", "-", "Stunned for one turn, then -2 to MANIPULATION.", "2D6"],
    [25, "Groin Hit", "No", "-", "Stunned for two turns, then 1 point of damage per FORCE, DEXTERITY, and MELEE COMBAT test.", "2D6"],
    [26, "Dislocated Shoulder", "No", "-", "Stunned for one turn, then -3 to FORCE and MELEE COMBAT.", "D6"],

    [31, "Broken Ribs", "No", "-", "Stunned for one turn, then -2 to DEXTERITY and MELEE COMBAT.", "2D6"],
    [32, "Broken Arm", "No", "-", "Stunned for one turn, then -3 to RANGED COMBAT and MELEE COMBAT.", "3D6"],
    [33, "Broken Leg", "No", "-", "Falls down, then Movement Rate halved, and -2 to DEXTERITY and INFILTRATION.", "3D6"],
    [34, "Shredded Ear", "No", "-", "Stunned for one turn, then -2 to OBSERVATION . Permanent ugly scar.", "3D6"],
    [35, "Gouged Eye", "No", "-", "Stunned for one turn, then -2 to RANGED COMBAT and OBSERVATION.", "3D6"],
    [36, "Punctured Lung", "Yes", "D6 days", "Stunned for one turn, then -3 to DEXTERITY.", "2D6"],

    [41, "Lacerated Kidney", "Yes", "D6 days", "Stunned for two turns, then 1 point of damage per FORCE , DEXTERITY , or MELEE COMBAT test.", "3D6"],
    [42, "Crushed Foot", "Yes", "D6 days", "Falls over, then Movement Rate halved, and -3 to DEXTERITY and INFILTRATION.", "4D6"],
    [43, "Crushed Elbow", "Yes", "D6 days", "Stunned for one turn, then -2 to FORCE and MELEE COMBAT. No use of two-handed weapons.", "4D6"],
    [44, "Crushed Knee", "Yes", "D6 hours", "Stunned for one turn, falls over, then Movement Rate halved, and -3 to DEXTERITY and INFILTRATION.", "4D6"],
    [45, "Crushed Face", "Yes", "D6 hours", "Unconscious D6 hours, then -2 to MANIPULATION.", "4D6"],
    [46, "Pierced Intestines", "Yes", "D6 hours", "Stunned for one turn, then 1 point of damage per hour until first aid is administered.", "2D6"],

    [51, "Broken Spine", "Yes", "D6 hours", "Unconscious D6 hours, then paralyzed from the waist down. Unless medical aid is given during the healing time, the paralysis becomes permanent.", "4D6"],
    [52, "Broken Neck", "Yes", "D6 hours", "Unconscious D6 hours, then paralyzed from the neck down. Unless medical aid is given during the healing time, the paralysis becomes permanent.", "4D6"],
    [53, "Bleeding Gut", "Yes", "D6 minutes", "1 point of damage per turn until first aid is given.", "D6"],
    [54, "Internal Bleeding", "Yes, -1", "D6 minutes", "Unconscious D6 hours, then 1 point of damage per FORCE, DEXTERITY, or MELEE COMBAT test.", "2D6"],
    [55, "Severed Artery (Arm)", "Yes, -1", "D6 minutes", "Unconscious D6 hours, then -1 to DEXTERITY.", "D6"],
    [56, "Severed Artery (Leg)", "Yes, -1", "D6 minutes", "Unconscious D6 hours, then -2 to DEXTERITY.", "D6"],

    [61, "Destroyed Arm", "Yes, -1", "D6 minutes", "Unconscious D6 hours, then -2 to DEXTERITY. The arm is permanently lost. No use of two-handed weapons.", "3D6"],
    [62, "Destroyed Leg", "Yes, -1", "D6 minutes", "Unconscious D6 hours, then -2 to DEXTERITY. The leg is permanently lost. Movement Rate is halved.", "3D6"],
    [63, "Severed Jugular", "Yes, -1", "D6 minutes", "Unconscious D6 hours, then -1 to DEXTERITY.", "D6"],
    [64, "Severed Aorta", "Yes, -1", "D6 minutes", "Unconscious D6 hours, then -2 to DEXTERITY.", "2D6"],
    [65, "Pierced Heart", "Yes", "-", "Your heart beats one final time. Create a new PC.", "-"],
    [66, "Crushed Skull", "Yes", "-", "You are instantly killed. Your adventure ends here. Create a new PC.", "-"]
];

function rollCritical(originalMsg) {
    const result = criticals[randomInteger(criticals.length) - 1];
    const fatal = result[2].startsWith("Yes") ? "&#x2620;" : "";
    const msg = "&{template:default} " + 
    `{{name=${fatal}Critical Damage!${fatal}}}` + 
    `{{Roll=${result[0]}}}` +
    `{{Result=${result[1]}}}` +
    `{{Fatal=${result[2]}}}` +
    `{{Time limit=${result[3]}}}` +
    `{{Effect=${result[4]}}}` +
    `{{Heal time=${result[5]}${(result[5] === "-" ? "" : " days")}}}`

    // Let everybody see
    sendChat(getPlayerId(originalMsg), msg);
}

