// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export function formatDate(d: Date) {
    return `${String(d.getFullYear()).padStart(4, '0')}-${
        String(d.getMonth() + 1).padStart(2, '0')}-${
        String(d.getDate()).padStart(2, '0')}`;
}

export function parseISODate(s: string) {
    const m = s.match(/^(?:(-?\d{4,})-(\d{2})-(\d{2}))|(?:(-?\d{4,})(\d{2})(\d{2}))$/);
    if (m) {
        return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    } else {
        return null;
    }
}
