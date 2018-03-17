const hiragana = {
	"": { a: "あ", i: "い", u: "う", e: "え", o: "お" },
	k: { a: "か", i: "き", u: "く", e: "け", o: "こ" },
	s: { a: "さ", i: "し", u: "す", e: "せ", o: "そ" },
	t: { a: "た", i: "ち", u: "つ", e: "て", o: "と" },
	n: { a: "な", i: "に", u: "ぬ", e: "ね", o: "の" },
	h: { a: "は", i: "ひ", u: "ふ", e: "へ", o: "ほ" },
	m: { a: "ま", i: "み", u: "む", e: "め", o: "も" },
	y: { a: "や", u: "ゆ", o: "よ" },
	r: { a: "ら", i: "り", u: "る", e: "れ", o: "ろ" },
	w: { a: "わ", i: "ゐ", e: "ゑ", o: "を" },
	g: { a: "が", i: "ぎ", u: "ぐ", e: "げ", o: "ご" },
	z: { a: "ざ", i: "じ", u: "ず", e: "ぜ", o: "ぞ" },
	d: { a: "だ", i: "ぢ", u: "づ", e: "で", o: "ど" },
	b: { a: "ば", i: "び", u: "ぶ", e: "べ", o: "ぼ" },
	p: { a: "ぱ", i: "ぴ", u: "ぷ", e: "ぺ", o: "ぽ" }
};

function consonantType(kana: string) {
	for (let c in hiragana) for (let v in hiragana[c]) {
		if (hiragana[c][v] === kana) return c;
	}
}

function any(e: string, a: Array<string>) {
	return a.indexOf(e) >= 0;
}

class Base {
	prefix: string;
	irregular: boolean | string; // kana text if kanji reading is irregular

	constructor(prefix: string, irregular: boolean | string = false) {
		this.prefix = prefix;
		this.irregular = irregular;
	}
}

class Inflection {
	default: string;
	spoken: string;
	irregular: boolean | string;
	uncommon: boolean;

	constructor(base: Base, suffix: string = "", uncommon: boolean = false, sBase?: Base, sSuffix?: string) {
		this.default = base.prefix + suffix;
		this.irregular = base.irregular;

		if (sBase) {
			this.spoken = sBase.prefix + (sSuffix ? sSuffix : suffix);
		}
	}
}

interface StandardForms {
	nonPast: Inflection;
	past: Inflection;
	imperative: Inflection | Array<Inflection>;
	connective: Inflection;
	conditional: Inflection;
	volitional: Inflection;
}

interface NegativeForms extends StandardForms {
	absentative: Inflection;
}

interface FormalityLevel {
	affirmative: Partial<StandardForms>;
	negative: Partial<NegativeForms>;
	compulsive?: Inflection;
	obligative?: Inflection | Array<Inflection>;
}

interface VowelBases {
	a?: Base;
	i: Base;
	u: Base;
	e?: Base;
	o?: Base;
}

class MinimalVerb {
	informal: FormalityLevel;
	formal: FormalityLevel;

	constructor(vowels: VowelBases, nai: Base) {
		this.informal = {
			affirmative: {
				nonPast: new Inflection(vowels.u)
			},
			negative: {
				nonPast: new Inflection(nai, "ない"),
				past: new Inflection(nai, "なかった"),
				imperative: new Inflection(nai, "な"),
				connective: new Inflection(nai, "なくて"),
				conditional: new Inflection(nai, "なくれば"),
				volitional: new Inflection(nai, "なかろう"),
				absentative: new Inflection(nai, "ないで")
			},
			compulsive: new Inflection(nai, "なくちゃ"),
			obligative: new Inflection(nai, "なきゃ")
		};

		this.formal = {
			affirmative: {
				nonPast: new Inflection(vowels.i, "ます"),
				past: new Inflection(vowels.i, "ました"),
				imperative: [new Inflection(vowels.i, "なさい"), new Inflection(vowels.i, "な")],
				connective: new Inflection(vowels.i, "まして", true),
				conditional: new Inflection(vowels.i, "ますれば", true),
				volitional: new Inflection(vowels.i, "ましょう")
			},
			negative: {
				nonPast: new Inflection(vowels.i, "ません"),
				past: new Inflection(vowels.i, "ませんでした"),
				absentative: new Inflection(vowels.a, "ずに")
			},
			compulsive: new Inflection(nai, "なくてはいけない"),
			obligative: [new Inflection(nai, "なｋればならない"), new Inflection(nai, "なければいけない")]
		};
	}
}

class InflectedVerb extends MinimalVerb {
	potential: Inflection | Array<Inflection>;
	passive: Inflection | Array<Inflection>;
	causative: Array<Inflection>;
	causativePassive: Inflection | Array<Inflection>;
}

export function godan(verb: string): InflectedVerb {
	let stem = verb.slice(0, -1);
	let flexible = verb.slice(-1);
	let c = consonantType(flexible);

	let honorificIrregular = any(verb, ["為さる", "なさる", "下さる", "くださる", "御座る", "ご座る", "ござる", "いらっしゃる", "仰る", "おっしゃる"]) ? new Base(stem + "い", true) : false;

	let vowels: VowelBases = {
		a: new Base(stem + (c ? hiragana[c]["a"] : "")),
		i: honorificIrregular || new Base(stem + hiragana[c]["i"]),
		u: new Base(verb),
		e: honorificIrregular || new Base(stem + hiragana[c]["e"]),
		o: new Base(stem + hiragana[c]["o"])
	};

	//TODO: consider adding では as nai base for である
	let naiBase = any(verb, ["有る", "在る", "ある"]) ? new Base("", true) : vowels.a;

	let inflections = new InflectedVerb(vowels, naiBase);

	inflections.informal.affirmative.imperative = new Inflection(vowels.e);
	inflections.informal.affirmative.conditional = new Inflection(vowels.e, "ば");
	inflections.informal.affirmative.volitional = new Inflection(vowels.o, "う");
	inflections.potential = new Inflection(vowels.e, "る");
	inflections.passive = new Inflection(vowels.a, "れる");
	inflections.causative = [new Inflection(vowels.a, "せる"), new Inflection(vowels.a, "す")];
	inflections.causativePassive = [new Inflection(vowels.a, "せられる"), new Inflection(vowels.a, "される")];

	let base = {
		regular: new Base(stem),
		irregular: new Base(stem, true)
	}

	switch (verb) {
		case "行く": case "いく":
			inflections.informal.affirmative.connective = new Inflection(base.irregular, "って");
			inflections.informal.affirmative.past = new Inflection(base.irregular, "った");
			break;

		case "問う": case "とう": case "請う": case "乞う": case "こう":
			inflections.informal.affirmative.connective = new Inflection(base.irregular, "うて");
			inflections.informal.affirmative.past = new Inflection(base.irregular, "うた");
			break;

		default: switch (c) {
			case "": case "t": case "r":
				inflections.informal.affirmative.connective = new Inflection(base.regular, "って");
				inflections.informal.affirmative.past = new Inflection(base.regular, "った");
				break;

			case "n": case "m": case "b":
				inflections.informal.affirmative.connective = new Inflection(base.regular, "んで");
				inflections.informal.affirmative.past = new Inflection(base.regular, "んだ");
				break;

			case "k":
				inflections.informal.affirmative.connective = new Inflection(base.regular, "いて");
				inflections.informal.affirmative.past = new Inflection(base.regular, "いた");
				break;

			case "g":
				inflections.informal.affirmative.connective = new Inflection(base.regular, "いで");
				inflections.informal.affirmative.past = new Inflection(base.regular, "いだ");
				break;

			case "s":
				inflections.informal.affirmative.connective = new Inflection(base.regular, "して");
				inflections.informal.affirmative.past = new Inflection(base.regular, "した");
				break;
		}
	}

	return inflections;
}

export function ichidan(verb: string): InflectedVerb {
	let stem = verb.slice(0, -1);
	let base = new Base(stem);

	let inflections = new InflectedVerb({ i: base, u: new Base(verb) }, base);

	inflections.informal.affirmative.imperative = new Inflection(base, "ろ");
	inflections.informal.affirmative.conditional = new Inflection(base, "れば");
	inflections.informal.affirmative.volitional = new Inflection(base, "よう");
	inflections.informal.affirmative.connective = new Inflection(base, "て");
	inflections.informal.affirmative.past = new Inflection(base, "た");
	inflections.passive = new Inflection(base, "られる");
	inflections.causative = [new Inflection(base, "させる"), new Inflection(base, "さす")];
	inflections.causativePassive = new Inflection(base, "させられる");
	inflections.potential = new Inflection(base, "られる", false, base, "れる");

	return inflections;
}

export function irregular(verb: string): InflectedVerb | MinimalVerb {
	let inflections: InflectedVerb;

	if (any(verb, ["為る", "する"])) {
		let shi = new Base("為", "し");
		let sa = new Base("為", "さ");
		let se = new Base("為", "せ");

		inflections = new InflectedVerb({ u: new Base("為る", "する"), i: shi }, shi);

		inflections.informal.affirmative.imperative = [new Inflection(shi, "ろ"), new Inflection(se, "よ")];
		inflections.informal.affirmative.conditional = new Inflection(new Base("為", "す"), "れば");
		inflections.informal.affirmative.volitional = new Inflection(shi, "よう");
		inflections.informal.affirmative.connective = new Inflection(shi, "て");
		inflections.informal.affirmative.past = new Inflection(shi, "た");
		inflections.passive = new Inflection(sa, "れる");
		inflections.causative = [new Inflection(sa, "せる"), new Inflection(sa, "す")];
		inflections.causativePassive = new Inflection(sa, "せられる");
		inflections.potential = [new Inflection(new Base("出来る", "できる")), new Inflection(se, "る")];
	}

	if (any(verb, ["来る", "くる"])) {
		let ki = new Base("来", "き");
		let ko = new Base("来", "こ");

		inflections = new InflectedVerb({ u: new Base("来る", "くる"), i: ki }, ko);

		inflections.informal.affirmative.imperative = new Inflection(ko, "い");
		inflections.informal.affirmative.conditional = new Inflection(new Base("来", "く"), "れば");
		inflections.informal.affirmative.volitional = new Inflection(ko, "よう");
		inflections.informal.affirmative.connective = new Inflection(ki, "て");
		inflections.informal.affirmative.past = new Inflection(ki, "た");
		inflections.passive = [new Inflection(ko, "られる"), new Inflection(ko, "れる")];
		inflections.causative = [new Inflection(ko, "させる"), new Inflection(ko, "さす")];
		inflections.causativePassive = new Inflection(ko, "させられる");
		inflections.potential = new Inflection(ko, "られる");
	}

	if (verb === "だ") {
		let dewa = new Base("では", true);
		let ja = new Base("じゃ", true);

		let da: MinimalVerb = {
			informal: {
				affirmative: {
					nonPast: new Inflection(new Base("だ", true)),
					past: new Inflection(new Base("だった", true)),
					conditional: new Inflection(new Base("だったら", true)),
					connective: new Inflection(new Base("で", true)),
					volitional: new Inflection(new Base("だろう", true))
				},
				negative: {
					nonPast: new Inflection(dewa, "ない", false, ja),
					past: new Inflection(dewa, "なかった", false, ja),
					conditional: new Inflection(dewa, "なかったら", false, ja),
					connective: new Inflection(dewa, "なくて", false, ja)
				},
				/*compulsive: new Inflection(dewa, "なくちゃ", false, ja),
				obligative: new Inflection(dewa, "なきゃ", false, ja)*/
			},
			formal: {
				affirmative: {
					nonPast: new Inflection(new Base("です", true)),
					past: new Inflection(new Base("でした", true)),
					volitional: new Inflection(new Base("でしょう", true))
				},
				negative: {
					nonPast: new Inflection(dewa, "ありません", false, ja),
					past: new Inflection(dewa, "ありませんでした", false, ja)
				},
				/*compulsive: new Inflection(dewa, "なくてはいけない", false, ja),
				obligative: [new Inflection(dewa, "なくればならない", false, ja), new Inflection(dewa, "なくればいけない", false, ja)]*/
			}
		}

		return da;
	}

	return inflections;
}