import { delta, resetState } from '../src/diff';
const { expect } = require('chai');

let htmlMock = '';
const getHtmlMock = () => htmlMock;
describe('the differ', () => {
  beforeEach(() => {
    resetState();
  });
  it('gets the entire html on an empty state', () => {
    htmlMock = 'hello';
    expect(delta(undefined, getHtmlMock).diff).to.deep.equal({
      hunks: [{
        oldStart: 1,
        oldLines: 0,
        newStart: 1,
        newLines: 1,
        lines: [ '+hello']
      }]
    });
  });
  it('passing no ticket gives back the full state', () => {
    htmlMock = 'hello';
    delta(undefined, getHtmlMock);
    expect(delta(undefined, getHtmlMock).diff).to.deep.equal({
      hunks: [{
        oldStart: 1,
        oldLines: 0,
        newStart: 1,
        newLines: 1,
        lines: [ '+hello']
      }]
    });
  });
  it('using a ticket gives back a diff', () => {
    htmlMock = 'hello';
    const { ticket } = delta(undefined, getHtmlMock);
    htmlMock = 'hell';
    expect(delta(ticket, getHtmlMock).diff).to.deep.equal({
      hunks: [{
        oldStart: 1,
        oldLines: 1,
        newStart: 1,
        newLines: 1,
        lines: ['-hello', '+hell']
      }]
    });
  });
  it('diffs work in a line-based way', () => {
    htmlMock = ['<div>',
      '<span>',
      '<h1>Hello!</h1>',
      '</span>',
      '</div>'].join('\n');
    const { ticket } = delta(undefined, getHtmlMock);
    htmlMock = ['<div>',
      '<span>',
      '<h2>Hello!</h2>',
      '</span>',
      '</div>'].join('\n');
    expect(delta(ticket, getHtmlMock).diff).to.deep.equal({
      hunks: [{
        oldStart: 3,
        oldLines: 1,
        newStart: 3,
        newLines: 1,
        lines: ['-<h1>Hello!</h1>', '+<h2>Hello!</h2>']
      }]
    });
  });
    
  it('keeps the last 3 snapshots', () => {
    htmlMock = 'hello';
    const { ticket } = delta(undefined, getHtmlMock);
    htmlMock = 'basaa';
    delta(undefined, getHtmlMock);
    const diff = delta(ticket, getHtmlMock);
    expect(diff.mode).to.equal('diff');
    expect(diff.diff.hunks).to.not.deep.equal([]);
  });

  it('calculates the diff', () => {

  });
});