// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



let gensymSeed = 0;

export default function gensym(): string {
    return `$$gensym$$_xjKvAjFXoVtro45V_${gensymSeed++}$$`;
}
