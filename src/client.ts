import * as Diff from 'diff';
import { DeltaResult } from './diff';

export class DiffClient {
    private lastKnownTicket?: string = undefined;
    private lastKnownState = '';
    constructor(private getPatch: (ticket?: string) => DeltaResult | Promise<DeltaResult>) {
    }
    async sync() {
      const patch = await this.getPatch(this.lastKnownTicket);
      return this.apply(patch);
    }
    private apply(patch: DeltaResult) {
      if (patch.mode === 'full-snapshot') {
        this.lastKnownState = '';
      }
      for(const hunk of patch.diff.hunks) {
        // structuredPatch returns the wrong format
        hunk.linedelimiters = hunk.lines.map(x => '\n');
      }
      this.lastKnownState = Diff.applyPatch(this.lastKnownState, patch.diff, {
        fuzzFactor: 0
      });
      this.lastKnownTicket = patch.ticket;
      return this.lastKnownState.trimRight();
    }
}