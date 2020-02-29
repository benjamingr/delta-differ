import { DiffClient } from '../src/client';
import { delta } from '../src/diff';
const { expect } = require('chai');

let htmlMock = '';
let getHtmlMock = () => htmlMock;
describe('patching and applying', () => {
  let client: DiffClient;

  beforeEach(() => {
    client = new DiffClient((ticket) => delta(ticket, getHtmlMock));
  });

  it('does syncs', async () => {
    htmlMock = 'foobar';
    const lastKnown = await client.sync();
    expect(lastKnown).to.equal(htmlMock);
    expect(await client.sync()).to.equal('foobar');
  });

  it('updates when the content changes', async () => {
    htmlMock = 'foobar';
    expect(await client.sync()).to.equal(htmlMock);
    htmlMock = 'foobar2';
    expect(await client.sync()).to.equal('foobar2');
  });
});