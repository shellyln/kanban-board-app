// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { parserInput }        from 'fruitsconfits/modules/lib/types';
import { formatErrorMessage } from 'fruitsconfits/modules/lib/parser';
import { getStringParsers }   from 'fruitsconfits/modules/lib/string-parser';



type Ctx = undefined;
type Ast = string | string[];


const $s = getStringParsers<Ctx, Ast>({
    rawToToken: rawToken => rawToken,
    concatTokens: tokens => (tokens.length ?
        [tokens.reduce((a, b) => a as string + b as string)] : []),
});

const {seq, cls, notCls, classes, cat,
        repeat, end, first, combine, erase, trans, ahead,
        makeProgram} = $s;


const quoted = trans(input => input.length ? input : [''])(
    erase(repeat(classes.spaceWithinSingleLine), cls('"')),
    cat(repeat(first(
        trans(input => ['"'])(seq('""')),
        notCls('"'), ))),
    erase(cls('"'), repeat(erase(classes.spaceWithinSingleLine))), );

const nakid = trans(input => input.length ? input : [''])(
    erase(repeat(classes.spaceWithinSingleLine)),
    cat(repeat(first(
        erase(classes.spaceWithinSingleLine, ahead(cls(',', '\r\n', '\n', '\r'))),
        notCls(',', '\r\n', '\n', '\r'), ))));

const cell = first(quoted, nakid);

const row = trans(input => [input as string[]])(
    cell,
    repeat(combine(erase(seq(',')), cell)), );

const rows = makeProgram(combine(
    row,
    repeat(combine(erase(classes.newline), row)),
    end(), ));


export function parse(s: string) {
    const z = rows(parserInput(s));
    if (! z.succeeded) {
        throw new Error(formatErrorMessage(z));
    }
    return z.tokens as string[][];
}
