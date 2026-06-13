/**
 * The book-edition versioning, derived from package.json at build.
 * Semver lives in git; visitors only ever see the edition line:
 * "second edition · banyan · june 2026"
 */
import pkg from '../../package.json';

const ORDINALS = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

export const version: string = (pkg as any).version;
export const major: number = parseInt(version.split('.')[0], 10);
export const treeName: string = ((pkg as any).edition?.name ?? 'gulmohar').toLowerCase();
export const editionMonth: string = ((pkg as any).edition?.month ?? '').toLowerCase();

export const colophonLine = `${ORDINALS[major] ?? `${major}th`} edition · ${treeName} · ${editionMonth}`;
