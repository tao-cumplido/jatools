declare module 'rakutenma' {
    class RakutenMA {
        static readonly default_featset_ja: ['c0', 'w0', 'w1', 'w9', 'w2', 'w8', 'b1', 'b9', 'b2', 'b8', 'c1', 'c9', 'c2', 'c8', 'c3', 'c7', 'd1', 'd9', 'd2', 'd8'];
        static readonly default_featset_zh: ['c0', 'w0', 'w1', 'w9', 'w2', 'w8', 'b1', 'b9', 'b2', 'b8', 'c1', 'c9', 'c2', 'c8', 'c3', 'c7'];
        static readonly ctype_ja_default_func: (input: string) => 'S' | 'C' | 'H' | 'K' | 'A' | 'a' | 'N' | 'n' | 'O';

        static create_hash_func(bits: number): RakutenMA.HashFunction;
        static create_ctype_chardic_func<T extends object>(characterDictionary: T): <K extends keyof T>(character: K) => T[K];
        static tokens2string(tokens: RakutenMA.Tokens): string;

        model: object;
        hash_func: RakutenMA.HashFunction;
        ctype_func: (input: string) => any;
        featset: Array<RakutenMA.Feature | RakutenMA.FeatureTemplate>;

        constructor(model?: object, phi?: number, c?: number);

        tokenize(input: string): RakutenMA.Tokens;
        train_one<T extends RakutenMA.Tokens>(sentence: T): { ans: T, sys: RakutenMA.Tokens, updated: boolean };
        set_model(model: object): void;
        set_tag_scheme(scheme: RakutenMA.TagScheme): void;
    }

    namespace RakutenMA {
        export type TagScheme = 'SBIEO' | 'IOB2';

        export type HashFunction = (input: Array<string>) => [number];

        export type Feature =
            'c0' | 'c1' | 'c9' | 'c2' | 'c8' | 'c3' | 'c7' |
            'w0' | 'w1' | 'w9' | 'w2' | 'w8' | 'w3' | 'w7' |
            'b1' | 'b9' | 'b2' | 'b8' | 'b3' | 'b7' |
            'd1' | 'd9' | 'd2' | 'd8' | 'd3' | 'd7' |
            't0' | 't1' | 't9';

        export type FeatureTemplate = (template: (index: number) => CharacterObject, index: number) => [string, string];

        export type CharacterObject = {
            c: string,
            t: string,
        }

        export type Tokens = Array<[string, PoSTagChinese | PoSTagJapanese]>;

        export type PoSTagChinese =
            'AD' |
            'AS' |
            'BA' |
            'CC' |
            'CD' |
            'CS' |
            'DEC' |
            'DEG' |
            'DER' |
            'DEV' |
            'DT' |
            'ETC' |
            'FW' |
            'IJ' |
            'JJ' |
            'LB' |
            'LC' |
            'M' |
            'MSP' |
            'NN' |
            'NN-SHORT' |
            'NR' |
            'NR-SHORT' |
            'NT' |
            'NT-SHORT' |
            'OD' |
            'ON' |
            'P' |
            'PN' |
            'PU' |
            'SB' |
            'SP' |
            'URL' |
            'VA' |
            'VC' |
            'VE' |
            'VV' |
            'X';

        export type PoSTagJapanese =
            'A-c' |
            'A-dp' |
            'C' |
            'D' |
            'E' |
            'F' |
            'I-c' |
            'J-c' |
            'J-tari' |
            'J-xs' |
            'M-aa' |
            'M-c' |
            'M-cp' |
            'M-op' |
            'M-p' |
            'N-n' |
            'N-nc' |
            'N-pn' |
            'N-xs' |
            'O' |
            'P' |
            'P-fj' |
            'P-jj' |
            'P-k' |
            'P-rj' |
            'P-sj' |
            'Q-a' |
            'Q-j' |
            'Q-n' |
            'Q-v' |
            'R' |
            'S-c' |
            'S-l' |
            'U' |
            'V-c' |
            'V-dp' |
            'W' |
            'X';
    }

    export = RakutenMA;
}