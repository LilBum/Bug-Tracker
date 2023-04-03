class bugs {
  constructor({
    name = '',
    description = '',
    steps = '',
    priority = 1,
    assigned = '',
    version = '',
    creator = '',
    timeCreated = new Date(),
  }) {
    this.name = name;
    this.description = description;
    this.steps = steps;
    this.priority = priority;
    this.assigned = assigned;
    this.version = version;
    this.creator = creator;
    this.timeCreated = timeCreated;
  }
}

export default bugs;
