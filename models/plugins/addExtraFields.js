
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const moment = require('moment');

addExtraFields = (async (schema, options) => {

    //schema.add({ id: { type: Number, index: true, unique: true, required: [true, 'Required!'], } });

    //schema.add({
        //_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() }
    //});
    schema.add({
        createdAt: { type: Number, default: moment().valueOf() }
    });
    schema.add({
        createdBy: { type: Number, default: null }
    });
    schema.add({
        modifiedAt: { type: Number, default: null }
    });
    schema.add({
        modifiedBy: { type: Number, default: null }
    });

    schema.add({
        deleted: { type: Boolean, default: false }
    });
    schema.add({
        deletedAt: { type: Number, default: null }
    });
    schema.add({
        deletedBy: { type: Number, default: null }
    });

    schema.add({
        hidden: { type: Boolean, default: false }
    });
    schema.add({
        hiddenAt: { type: Number, default: null }
    });
    schema.add({
        hiddenBy: { type: Number, default: null }
    });

    schema.add({
        locked: { type: Boolean, default: false }
    });
    schema.add({
        lockedAt: { type: Number, default: null }
    });
    schema.add({
        lockedBy: { type: Number, default: null }
    });

    schema.add({
        saveId: {
            type: String,
            required: [true, 'Required!']
        }
    });
    /*
    schema.add({ marked: { type: Boolean, default: false } });
    schema.add({ markedAt: { type: Number, default: null } });
    schema.add({ markedBy: { type: Number, default: null } });
    */
    return schema;
});
module.exports = addExtraFields