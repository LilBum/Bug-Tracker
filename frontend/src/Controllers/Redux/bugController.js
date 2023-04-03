import bugModel from 'C:/Users/oneco/OneDrive/Desktop/Bug-Tracker/frontend/src/Models/bugModel.js';

export function getAllBugs() {
    let data = [];

    data.push(new bugModel({
        id: 324545,
        name: "Close doesn't work",
        description: "Pressing the close button will not do anything",
        steps: "Press close button",
        version: "1.0",
        priority: 3,
        assigned: "Alex Urs-Badet",
        creator: "Alex Urs-Badet",
        time: "10:30 PM"
    }))
    data.push(new bugModel({
        id: 234233,
        name: "Mark Complete bug",
        description: "Mark complete button does not do anything",
        steps: "Press the mark complete button",
        version: "1.0",
        priority: 3,
        assigned: "Alex Urs-Badet",
        creator: "Alex Urs-Badet",
        time: "10:31 PM"
    }))

    data.push(new bugModel({
        id: 546745,
        name: "Edit Button bug",
        description: "Edit button does not display the edit bug page",
        steps: "Press the edit button in the top left of the bug card",
        version: "1.0",
        priority: 3,
        assigned: "Alex Urs-Badet",
        creator: "Alex Urs-Badet",
        time: "10:26 PM"
    }))

    let sorted = data.sort((a, b) => { return a.priority - b.priority; })
    sorted = JSON.stringify(data);
    return sorted;
}