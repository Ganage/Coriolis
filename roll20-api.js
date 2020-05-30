on('chat:message', function(msg) {

    if (msg.type !== "api" ) {
        return;
    }
    const tokens = msg.content.split(" ");
    const who = `player|${msg.playerid}`;

    if (tokens[0] === "!d66") {
        rollD66(who);
    }
    else if (tokens[0] == "!crit") {
        rollCritical(who);
    }

});

function rollD66(who) {
    sendChat(who, `D66: ${randomInteger(6)}${randomInteger(6)}`);
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

function rollCritical(who) {
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

    sendChat(who, msg);
}

