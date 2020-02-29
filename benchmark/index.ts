'use strict';

import { promises as fs } from 'fs';
import { delta, DiffClient } from '../src/';
import path = require('path');
import { performance } from 'perf_hooks';

// navigates to demo.testim.io based on the testim demo flow
// once gets the htmls
(async () => {
    const [
        initial,
        dateOpen,
        numberPeopleOpen,
        form,
        testList,
        newTest,
        startNewTest,
        testWithManySteps,
        testWithPropertyPanel,
        saveTestDialog
    ] = (await Promise.all([
        fs.readFile(path.join(__dirname, './fixures/demo-testim.html')),
        fs.readFile(path.join(__dirname, './fixures/date-open.html')),
        fs.readFile(path.join(__dirname, './fixures/number-people-open.html')),
        fs.readFile(path.join(__dirname, './fixures/form.html')),
        fs.readFile(path.join(__dirname, './fixures/test-list.html')),
        fs.readFile(path.join(__dirname, './fixures/new-test.html')),
        fs.readFile(path.join(__dirname, './fixures/start-new-test.html')),
        fs.readFile(path.join(__dirname, './fixures/test-with-many-steps.html')),
        fs.readFile(path.join(__dirname, './fixures/test-with-property-panel.html')),
        fs.readFile(path.join(__dirname, './fixures/save-test-dialog.html')),
    ])).map(x => x.toString());
    const start = performance.now();
    const results = [];
    for(let i = 0; i < 5; i++) {
        results.push(await demoTestim({ initial, dateOpen, numberPeopleOpen, form }));
        results.push(await appTestim({ testList, newTest, startNewTest, testWithManySteps, testWithPropertyPanel, saveTestDialog }));
    }
    const timeTakenMs = performance.now() - start;
    
    const aggregatedResults = {
        ioCount: results.reduce((c, p) => p.ioCount + c, 0),
        reducedIoCount: results.reduce((c, p) => p.reducedIoCount + c, 0),
        callCount: results.reduce((c, p) => p.callCount + c, 0),
        get ioRatio() {
            return (this.reducedIoCount / this.ioCount).toFixed(2) + '%';
        },
        toString() {
            const timePerCall =  timeTakenMs / this.callCount;
            return `Original IO: ${this.ioCount}b\n` +
                   `Improved IO: ${this.reducedIoCount}b\n` +
                   `Ratio Sent:${this.ioRatio}\n` + 
                   `Delta Calls in benchmark:${this.callCount}\n` +
                   `Time Taken: ${timeTakenMs}ms\n` +
                   `Time Per Delta: ${timePerCall.toFixed(2)}ms/call\n`;
        }
    };
    console.log(aggregatedResults.toString());
})();
async function appTestim(htmls: { [index:string]: string}) { 
    const action = prepareBenchmark();
    await action(htmls.testList);
    await action(htmls.testList);
    await action(htmls.testList);
    await action(htmls.newTest);
    await action(htmls.newTest);
    await action(htmls.startNewTest);
    await action(htmls.startNewTest);
    await action(htmls.newTest);
    await action(htmls.testWithManySteps);
    await action(htmls.testWithPropertyPanel);
    await action(htmls.testWithPropertyPanel);
    await action(htmls.testWithPropertyPanel);
    await action(htmls.testWithManySteps);
    await action(htmls.saveTestDialog);
    await action(htmls.saveTestDialog);
    await action(htmls.saveTestDialog);
    return action;
}
async function demoTestim(htmls: { [index:string]: string}) {
    const action = prepareBenchmark();
    // click depart
    await action(htmls.initial);
    // click date
    await action(htmls.initial);
    // click ok
    await action(htmls.dateOpen);
    // click returning
    await action(htmls.initial);
    // click date
    await action(htmls.dateOpen);
    // click ok
    await action(htmls.dateOpen);
    // click adults
    await action(htmls.numberPeopleOpen);
    // click ok
    await action(htmls.numberPeopleOpen);
    // click children
    await action(htmls.initial);
    // click ok
    await action(htmls.numberPeopleOpen);
    // click select destination
    await action(htmls.initial);
    // click book in madan
    await action(htmls.initial);
    // click name
    await action(htmls.form);
    // enter name
    await action(htmls.form);
    // click email
    await action(htmls.form);
    // enter email
    await action(htmls.form);
    // click ssn
    await action(htmls.form);
    // enter ssn
    await action(htmls.form);
    // click phone
    await action(htmls.form);
    // enter phone
    await action(htmls.form);
    // click I agree
    await action(htmls.form);
    // click pay
    await action(htmls.form);
    return action;
}

function prepareBenchmark() {
    let html = '';
    action.ioCount = 0;
    action.reducedIoCount = 0;
    action.callCount = 0;
    const getHtmlMock = () => {
        action.ioCount += html.length;
        return html;
    };
    const getPatch = (ticket?: string) => {
        action.callCount++;
        const patch = delta(ticket, getHtmlMock);
        action.reducedIoCount += JSON.stringify(patch).length;
        return patch;
    };
    const dc = new DiffClient(getPatch); 
    async function action(curHtml: string) {
        if (!curHtml) {
            throw new Error('cannot find html');
        }
        html = curHtml; // so getHtmlMock picks it up
        await dc.sync();
    }
    return action;
}