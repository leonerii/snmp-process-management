var ProcessModel = require('../models/process')

const Process = module.exports

Process.list = () => {
    return ProcessModel.find().sort({name: 1}).exec()
}

Process.get = id => {
    return ProcessModel.findOne({_id: id}).exec()
}

Process.delete = id => {
    return ProcessModel.deleteOne({_id: id}).exec()
}

Process.create = proc_ => {
    var proc = new ProcessModel(proc_)

    return proc.save()
}

Process.create_list = proc_ => {
    for (proc in proc_)
        new ProcessModel(proc).save()
}

Process.update = proc_ => {
    var proc = new ProcessModel(proc_)

    return proc.updateOne()
}