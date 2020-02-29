## Differ

This package helps sending the HTML content of a page to a remote origin repeatedly.
It keeps internal state of the last HTMLs it saw and only sends the delta.

```js
const differ = require('delta-differ');
const diffClient = new differ.DiffClient((ticket) => {
    // this method can return a promise - presumably it would perform 
    // a remote call to another machine running the code - the
    // other machine knows what the state is by the passed ticket parameter
    // see the e2e tests for a full example
    return differ.delta(ticket);
});
const pageHtml = diffClient.sync();
// some time later after html changes...
const newPageHtml = diffClient.sync();
```

### Syncing other things

The delta function accepts a second "getHtml" argument that's useful for getting something other than the page body's html.

### Tests

Run the linter with `npm run lint`
Run unit tests with `npm run unit`
Run e2e tests with `npm run e2e`
Run the benchmarks with `npm run bench`