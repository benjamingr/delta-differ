import * as Diff from 'diff';
import * as LRUCache from 'lru-cache';
import { v4 } from 'uuid';

function getBodyHtml() {
  return document.body.outerHTML.split('><').join('\n><');
}
const cache = new LRUCache<string, string>({
  max: 3 // save last html snapshots
});

type modes = 'diff' | 'full-snapshot';
export type DeltaResult = { mode: modes, diff: Diff.ParsedDiff, ticket: string };


export function delta(fromTicket?: string, getHtml = getBodyHtml): DeltaResult { 
  const fromDiff = fromTicket && cache.get(fromTicket);
  const mode = fromDiff ? 'diff' : 'full-snapshot';
  const current = getHtml();
  const diff = Diff.structuredPatch(
    '',
    '',
    fromDiff || '', // convert empty string to '\n' for shorter EOF diff
    current + '',
    undefined,
    undefined,
    {
      context: 0
    }
  );
  const ticket = v4();
  cache.set(ticket, current);
    
  return { diff: preprocess(diff), ticket, mode };
}

export function resetState() {
  cache.reset();
}
function preprocess(diff: Diff.ParsedDiff) {
  const SPECIAL_NEW_LINE_TOKEN = '\\ No newline at end of file';
  delete diff.oldFileName;
  delete diff.newFileName;
  delete diff.oldHeader;
  delete diff.newHeader;
  for(const hunk of diff.hunks) {
    hunk.lines = hunk.lines.filter(x => x !== SPECIAL_NEW_LINE_TOKEN);
  }
  return diff;
}
