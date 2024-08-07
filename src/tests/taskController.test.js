const { expect } = require("chai");
const sinon = require("sinon");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const Task = require("../models/taskModel");

describe("Task Controller", function () {
  let req, res, next;

  // Setup before each test
  beforeEach(() => {
    req = {
      body: {
        title: "Test Task",
        description: "Task description",
        dueDate: new Date(),
        priority: "high",
      },
      params: {},
      user: { tenantId: "tenant1" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  // Cleanup after each test
  afterEach(() => {
    sinon.restore();
  });

  /**
   * Test case for creating a task successfully.
   * - Mocks the save method of the Task model.
   * - Asserts that the response status is 201 and the JSON response contains the correct task details.
   */
  it("should create a task successfully", async () => {
    const saveStub = sinon.stub(Task.prototype, "save").resolves({
      ...req.body,
      tenantId: "tenant1",
      _id: new Task()._id, // Mock the _id value
    });

    await createTask(req, res, next);

    expect(res.status.calledWith(201)).to.be.true;
    expect(
      res.json.calledWith(
        sinon.match({
          title: "Test Task",
          description: "Task description",
          dueDate: req.body.dueDate,
          priority: "high",
          tenantId: "tenant1",
        }),
      ),
    ).to.be.true;

    saveStub.restore();
  });

  /**
   * Test case for retrieving tasks successfully.
   * - Mocks the find method of the Task model.
   * - Asserts that the response status is 200 and the JSON response contains the list of tasks.
   */
  it("should get tasks successfully", async () => {
    const tasks = [{ ...req.body, _id: "taskId" }]; // Mock tasks with an ID
    const findStub = sinon.stub(Task, "find").resolves(tasks);

    await getTasks(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(tasks)).to.be.true;
  });

  /**
   * Test case for updating a task successfully.
   * - Mocks the findByIdAndUpdate method of the Task model.
   * - Asserts that the response status is 200 and the JSON response contains the updated task.
   */
  it("should update a task successfully", async () => {
    const updatedTask = { ...req.body, _id: "taskId" }; // Mock updated task with an ID
    const updateStub = sinon
      .stub(Task, "findByIdAndUpdate")
      .resolves(updatedTask);

    req.params.taskId = "taskId";
    await updateTask(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(updatedTask)).to.be.true;
  });

  /**
   * Test case for updating a non-existing task.
   * - Mocks the findByIdAndUpdate method of the Task model to return null.
   * - Asserts that the response status is 404 and the JSON response contains a 'Task not found' message.
   */
  it("should not update a non-existing task", async () => {
    const updateStub = sinon.stub(Task, "findByIdAndUpdate").resolves(null);

    req.params.taskId = "taskId";
    await updateTask(req, res, next);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Task not found" })).to.be.true;
  });

  /**
   * Test case for deleting a task successfully.
   * - Mocks the findByIdAndDelete method of the Task model.
   * - Asserts that the response status is 200 and the JSON response contains a 'Task deleted successfully' message.
   */
  it("should delete a task successfully", async () => {
    const task = { ...req.body, _id: "taskId" }; // Mock task with an ID
    const deleteStub = sinon.stub(Task, "findByIdAndDelete").resolves(task);

    req.params.taskId = "taskId";
    await deleteTask(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: "Task deleted successfully" })).to.be
      .true;
  });

  /**
   * Test case for deleting a non-existing task.
   * - Mocks the findByIdAndDelete method of the Task model to return null.
   * - Asserts that the response status is 404 and the JSON response contains a 'Task not found' message.
   */
  it("should not delete a non-existing task", async () => {
    const deleteStub = sinon.stub(Task, "findByIdAndDelete").resolves(null);

    req.params.taskId = "taskId";
    await deleteTask(req, res, next);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Task not found" })).to.be.true;
  });
});
