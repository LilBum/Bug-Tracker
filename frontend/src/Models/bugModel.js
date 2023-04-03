export default bugs;

function bugs(bug) {
    if (bug !== undefined) {
        this.id = bug.id;
        this.name = bug.name;
        this.description = bug.description;
        this.steps = bug.steps;
        this.version = bug.version;
        this.priority = bug.priority;
        this.assigned = bug.assigned;
        this.creator = bug.creator;
        this.time = bug.time;
    }
}