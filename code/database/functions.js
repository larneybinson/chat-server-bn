
var saveOne = async function(entity){

    try
    {
        return await entity.save();
    }
    catch(err)
    {
        throw Error(err);
    }

}

var saveMany = async function(entityType,entityList){

    try
    {
        return await entityType.insertMany(entityList);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getByWhereClause = async function(entity,whereClause){

    try
    {
        return await entity.$where(whereClause);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getManyPopulated = async function(entity,requestModel,populateQuery){

    try
    {
        return await entity.find(requestModel).populate(populateQuery);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getAggregate = async function(entity,aggregateQuery){

    try
    {
        return await entity.aggregate(aggregateQuery);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getMany = async function(entity,requestModel){

    try
    {
        return await entity.find(requestModel);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var findByIdAndRemove = async function(entityType,id){

    try
    {
        return await entityType.findByIdAndRemove(id);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getByIdPopulated = async function(entityiType,id,populateQuery){

    try
    {
        return await entityiType.findById(id).populate(populateQuery);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getById = async function(entityType,id){

    try
    {
        return await entityType.findById(id);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getOnePopulated = async function(entityType,requestModel,populateQuery){

    try
    {
        return await entityType.findOne(requestModel).populate(populateQuery);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getOne = async function(entityType,requestModel){

    try
    {
        return await entityType.findOne(requestModel);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var updateMany = async function(entityType,requestModel,updateModel){

    try
    {
        return await entityType.updateMany(requestModel,{$set:updateModel});
    }
    catch(err)
    {
        throw Error(err);
    }

}

var count = async function(entityType,condition){

    try
    {
        return await entityType.countDocuments(condition);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var any = async function(entityType,condition){

    try
    {
        return await entityType.count(condition);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var deleteMany = async function(entityType,condition){

    try
    {
        return await entityType.deleteMany(condition);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var bulkWrite = async function (entityType,ops) {

    try
    {
        return await entityType.bulkWrite(ops);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var distinct = async function (entityType,val,query) {

    try
    {
        return await entityType.distinct(val,query);
    }
    catch(err)
    {
        throw Error(err);
    }

}

var getManySorted = async function(entityType,query,sortQuery){

    try
    {
        return await entityType.find(query).sort(sortQuery);
    }
    catch(err)
    {
        throw Error(err);
    }

}


module.exports={
    saveOne,
    getByWhereClause,
    getMany,
    saveMany,
    findByIdAndRemove,
    getById,
    getOne,
    updateMany,
    count,
    deleteMany,
    any,
    getManyPopulated,
    bulkWrite,
    getAggregate,
    getByIdPopulated,
    getOnePopulated,
    distinct,
    getManySorted
};