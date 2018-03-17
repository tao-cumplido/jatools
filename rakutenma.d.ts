declare module 'rakutenma' {
    class RakutenMA<T extends object = {}> {
        static readonly default_featset_ja: ['c0', 'w0', 'w1', 'w9', 'w2', 'w8', 'b1', 'b9', 'b2', 'b8', 'c1', 'c9', 'c2', 'c8', 'c3', 'c7', 'd1', 'd9', 'd2', 'd8'];
        static readonly default_featset_zh: ['c0', 'w0', 'w1', 'w9', 'w2', 'w8', 'b1', 'b9', 'b2', 'b8', 'c1', 'c9', 'c2', 'c8', 'c3', 'c7'];
        static readonly ctype_ja_default_func: RakutenMA.CharacterTypeFunction;

        static string2hash(str: string): number;
        static create_hash_func(bits: number): (arr: string[]) => [number];

        model: T;
        scw: RakutenMA.SCW;
        ctype_func: RakutenMA.CharacterTypeFunction;
        tag_scheme: RakutenMA.TagScheme;
        featset: RakutenMA.Feature[];

        constructor(model?: T, phi?: number, c?: number);

        set_tag_scheme(scheme: RakutenMA.TagScheme): void;
    }

    namespace RakutenMA {
        export type TagScheme = 'SBIEO' | 'IOB2';
        export type Feature =
        'c0' | 'c1' | 'c9' | 'c2' | 'c8' | 'c3' | 'c7' |
        'w0' | 'w1' | 'w9' | 'w2' | 'w8' | 'w3' | 'w7' |
        'b1' | 'b9' | 'b2' | 'b8' | 'b3' | 'b7' |
        'd1' | 'd9' | 'd2' | 'd8' | 'd3' | 'd7' |
        't0' | 't1' | 't9' | ((t: (i: number) => {}, i: number) => string[]);
        export type CharacterType = 'S' | 'C' | 'H' | 'K' | 'A' | 'a' | 'N' | 'n' | 'O';
        export type CharacterTypeFunction = (str: string) => CharacterType;
        export type Token = { c: 'string', t: CharacterType };

        export namespace Trie {}

        export class SCW {}
    }

    export = RakutenMA;
}