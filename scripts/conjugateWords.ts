type ConjugationGroup = "Masu";
type ConjugationForm = "Positive" | "Negative" | "PositivePast" | "NegativePast";
type VerbType = "ichidan" | "godan" | "suru" | "kuru";

// Conjugation map that takes in a group like Masu form, the type of form within the group
// and the returns the result via an inline function
const conjugationMap: Record<ConjugationGroup, Record<ConjugationForm, (stem: string) => string>>  = {
    Masu: {
        Positive: (stem) => stem + "ます",
        Negative: (stem) => stem + "ません",
        PositivePast: (stem) => stem + "ました",
        NegativePast: (stem) => stem + "ませんでした",
    }
}

// List of all vowel steps
const vowelStepMap: Record<string, Array<string>> = {
    "む" : ["み"],
    "す" : ["し"],
    "う" : ["い"],
    "ぬ" : ["に"],
    "つ" : ["ち"],
    "ぶ" : ["び"],
    "く" : ["き"],
    "ぐ" : ["ぎ"],
    "る" : ["り"],
}

const extrasMap: Record<string, Array<string>> = {
    "する" : ["し"],
    "くる" : ["き"],
    "来る" : ["き"], // Extra incase they pass it in as kanji
}


function getIchidanStem(verb: string) {
    return verb.slice(0, -1);
}

function getGodanStem(verb: string, group: ConjugationGroup) {
    switch (group) {
        case "Masu":
            return verb.slice(0,-1) + vowelStepMap[verb.charAt(verb.length - 1)][0];
        default:
            // Defaults to masu stem
            return verb.slice(0,-1) + vowelStepMap[verb.charAt(verb.length - 1)][0];
    }
}

function getSuruStem(verb: string, group: ConjugationGroup) {
    switch (group) {
        case "Masu":
            return verb.substring(0, verb.length - 2) + extrasMap["する"][0];
        default:
            return verb.substring(0, verb.length - 2) + extrasMap["する"][0];
    }
}

// Incase the verb passed does not include する it adds it
function addAndCheckIfSuruExists(verb: string) {
    if(verb.includes("する")) {
        return verb;
    } else {
        return verb + "する";
    }
}

function getKuruStem(verb: string, group: ConjugationGroup) {
    switch (group) {
        case "Masu":
            return extrasMap[verb][0];  
        default:
            return extrasMap[verb][0];  
    }
}
 
function conjugate(verb: string,{ group, form }: { group: ConjugationGroup; form: ConjugationForm }, 
    verbType: VerbType = "ichidan") {
    if(!verb) return -1;
    if(verbType === "suru") {
        verb = addAndCheckIfSuruExists(verb);
    }
    let verbStem = "";
    switch (verbType) {
        case "ichidan":
            verbStem = getIchidanStem(verb);
            break;
        case "godan":
            verbStem = getGodanStem(verb, group)
            break;
        case "suru":
            verbStem = getSuruStem(verb, group);
            break;
        case "kuru":
            verbStem = getKuruStem(verb, group);
            break;
        default:
            break;
    }
    return conjugationMap[group][form](verbStem);
}

console.log(conjugate("勉強する",{group: "Masu", form: "Positive"},"suru"));
console.log(conjugate("願う",{group: "Masu", form: "Positive"},"godan"));
console.log(conjugate("負ける",{group: "Masu", form: "Positive"},"ichidan"));
console.log(conjugate("来る",{group: "Masu", form: "Positive"},"kuru"));
console.log(conjugate("くる",{group: "Masu", form: "Positive"},"kuru"));