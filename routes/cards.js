const express = require("express");
const Task = require("../models/Tasks");
const Status = require("../models/Status");
const Tasks = require("../models/Tasks");
const router = express.Router();

router.get('/status', async (req, res) => {
    let status = await Status.find({}).populate('cards');
    res.send(status);
});

router.post('/status', async (req, res) => {
    let status = new Status({
        title: req.body.title,
        cards: []
    });
    let newStatus = await status.save();
    res.send(newStatus);
});

router.put('/status/:id', async (req, res) => {
    let status = Status.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title }, { new: true }).populate('Tasks');
    res.send({ message: 'Successfully Updated Status', status: status });
});

router.delete('/status/:id', async (req, res) => {
    await Status.findOneAndRemove({ _id: req.params.id });
    res.send({ message: 'Successfully Removed Status' });
});

router.post('/task', async (req, res) => {
    let task = new Task({
        content: req.body.content
    });
    let savedTask = await task.save();
    let status = await Status.findOneAndUpdate({ _id: req.body.status_id }, { $push: { cards: savedTask._id } }, {'new': true}).populate('cards');
    res.send({message: 'Successfully Created Task', status:status });
});

router.put('/dragTask', async (req, res) => {


    let hostTask = await Status.findOneAndUpdate({ _id: req.body.host_status_id }, { $pull: { cards: req.body.task_id } }, { 'new': true });
    let TargetTask = await Status.findOneAndUpdate({ _id: req.body.target_status_id }, { $push: { cards: req.body.task_id } }, { 'new': true });
    res.send({message: 'Successfully Updated Task', target: TargetTask, host: hostTask});
});

router.put('/removeTask', async (req, res) => {
    let TaskData = await Task.findOneAndDelete({ _id: req.body.task_id });
    let StatusData = await Status.findOneAndUpdate({ _id: req.body.status_id }, { $pull: { cards: req.body.task_id } }, { 'new': true });
    res.send({message: 'Successfully Updated Task'});

});

router.put('/updateTask/:id', async (req, res) => {
    let task = await Task.findOneAndUpdate({ _id: req.params.id }, {content: req.body.content}, { 'new': true });
    res.send({message: 'Successfully Updated Task', task: task});
});

router.delete('/task/:id', async (req, res) => {
    await Task.findOneAndRemove({ _id: req.params.id });
    res.send({ message: 'Successfully Removed Task' });
});

module.exports = router;
