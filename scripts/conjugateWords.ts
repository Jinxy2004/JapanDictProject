// npx tsx 
type ConjugationGroup = "Masu" | "Polite";
type MasuForm = "Positive" | "Negative" | "PositivePast" | "NegativePast";
type PoliteForm = "Mashou" | "Tai" | "Potential";
type ConjugationForm = MasuForm | PoliteForm;
type VerbType = "ichidan" | "godan" | "suru" | "kuru";

// Conjugation map that takes in a group like Masu form, the type of form within the group
// and the returns the result via an inline function
const conjugationMap: {
  Masu: Record<MasuForm, (stem: string) => string>;
  Polite: Record<PoliteForm, (stem: string) => string>;
} = {
  Masu: {
    Positive: (stem) => stem + "ます",
    Negative: (stem) => stem + "ません",
    PositivePast: (stem) => stem + "ました",
    NegativePast: (stem) => stem + "ませんでした",
  },
  Polite: {
    Mashou: (stem) => stem + "ましょう",
    Tai: (stem) => stem + "たいです",
    Potential: (stem) => stem + "れる",
  }
};

// List of all vowel steps
const vowelStepMap: Record<string, Array<string>> = {
    // I, A, U, E, O step
    "む" : ["み","ま","む","め","も"],
    "す" : ["し","さ","す","せ","そ"],
    "う" : ["い","わ","う","え","お"],
    "ぬ" : ["に","な","ぬ","ね","の"],
    "つ" : ["ち","た","つ","て","と"],
    "ぶ" : ["び","ば","ぶ","べ","ぼ"],
    "く" : ["き","か","く","け","こ"],
    "ぐ" : ["ぎ","が","ぐ","げ","ご"],
    "る" : ["り","ら","る","れ","ろ"],
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
 
export function conjugate(verb: string,{ group, form }: { group: ConjugationGroup; form: ConjugationForm }, 
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
console.log(conjugate("勉強",{group: "Masu", form: "Positive"},"suru"));
console.log(conjugate("願う",{group: "Masu", form: "Positive"},"godan"));
console.log(conjugate("負ける",{group: "Masu", form: "Positive"},"ichidan"));
console.log(conjugate("来る",{group: "Masu", form: "Positive"},"kuru"));
console.log(conjugate("くる",{group: "Masu", form: "Positive"},"kuru"));