class bugs {
  constructor({
    _id = '',
    name = '',
    description = '',
    steps = '',
    priority = 1,
    assigned = '',
    version = '',
    creator = '',
    completed = false,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.steps = steps;
    this.priority = Number(priority);
    this.assigned = assigned;
    this.version = version;
    this.creator = creator;
    this.completed = completed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default bugs;
