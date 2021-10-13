const express = require("express");
const Task = require("../models/Tasks");
const Status = require("../models/Status");
const Tasks = require("../models/Tasks");
const router = express.Router();
const mongoose = require("mongoose");

router.get('/', (req, res) => {
    
    res.send('Server Running');
});

router.get('/status', async (req, res) => {
    try {
        let status = await Status.find({}).populate('cards');
        res.send(status);
    }catch (err) {
        next(err)
    }
});

router.post('/status', async (req, res) => {
    try {

        let status = new Status({
            title: req.body.title,
            cards: []
        });
        let newStatus = await status.save();
        res.send(newStatus);
    }catch (err) {
        next(err)
    }
});

router.put('/status/:id', async (req, res) => {
    try {
        let status = Status.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title }, { new: true }).populate('Tasks');
        res.send({ message: 'Successfully Updated Status', status: status });
    } catch (err) {
        next(err)
    }
});

router.delete('/status/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            let err = new Error('Invalid ID format');
            err.type = 'custom';
            throw err;
        }
        await Status.findOneAndRemove({ _id: req.params.id });
        res.send({ message: 'Successfully Removed Status' });
    } catch (err) {
        next(err)
    }
    
});

router.post('/task', async (req, res) => {
    try {
        if (req.body.content) {
            let task = new Task({
                content: req.body.content
            });
            let savedTask = await task.save();
            let status = await Status.findOneAndUpdate({ _id: req.body.status_id }, { $push: { cards: savedTask._id } }, { 'new': true }).populate('cards');
            res.send({ message: 'Successfully Created Task', status: status });
        } else {
            let err = new Error('Missing Payload');
            err.type = 'custom';
            throw err;
        }
    } catch (err) {
        next(err)
    }
});

router.put('/dragTask', async (req, res) => {

    try {
        if (req.body.host_status_id && req.body.task_id) {
            if (!mongoose.isValidObjectId(req.body.host_status_id) || !mongoose.isValidObjectId(req.body.task_id)) {
                let err = new Error('Invalid ID format');
                err.type = 'custom';
                throw err;
            }
            let hostTask = await Status.findOneAndUpdate({ _id: req.body.host_status_id }, { $pull: { cards: req.body.task_id } }, { 'new': true });
            let TargetTask = await Status.findOneAndUpdate({ _id: req.body.target_status_id }, { $push: { cards: req.body.task_id } }, { 'new': true });
            res.send({ message: 'Successfully Updated Task', target: TargetTask, host: hostTask });
        } else {
            let err = new Error('Missing Payload');
            err.type = 'custom';
            throw err;
        }
  
    } catch (err) {
        next(err)
    }

});

router.put('/removeTask', async (req, res) => {
    try {
        if (req.body.status_id && req.body.task_id) {
            if (!mongoose.isValidObjectId(req.body.status_id) || !mongoose.isValidObjectId(req.body.task_id)) {
                let err = new Error('Invalid ID format');
                err.type = 'custom';
                throw err;
            }
            let TaskData = await Task.findOneAndDelete({ _id: req.body.task_id });
            let StatusData = await Status.findOneAndUpdate({ _id: req.body.status_id }, { $pull: { cards: req.body.task_id } }, { 'new': true });
            res.send({message: 'Successfully Updated Task'});
        } else {
            let err = new Error('Missing Payload');
            err.type = 'custom';
            throw err;
        }
    } catch (err) {
        next(err)
    }
});

router.put('/updateTask/:id', async (req, res) => {
    try {
        if (req.params.id && req.body.content) {
            if (!mongoose.isValidObjectId(req.params.id)) {
                let err = new Error('Invalid ID format');
                err.type = 'custom';
                throw err;
            }
            let task = await Task.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content }, { 'new': true });
            res.send({ message: 'Successfully Updated Task', task: task });
        } else {
            let err = new Error('Missing Payload');
            err.type = 'custom';
            throw err;
        }
    } catch (err) {
        next(err)
    }
});

router.delete('/task/:id', async (req, res) => {
    try {
        if (req.params.id) {
            if (!mongoose.isValidObjectId(req.params.id)) {
                let err = new Error('Invalid ID format');
                err.type = 'custom';
                throw err;
            }
            await Task.findOneAndRemove({ _id: req.params.id });
            res.send({ message: 'Successfully Removed Task' });
        } else {
            let err = new Error('Missing Payload');
            err.type = 'custom';
            throw err;
        }


    } catch (err) {
        next(err)
    }
});

module.exports = router;
