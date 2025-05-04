console.log('test6:', 'include model');
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const collection_name = require(__basedir + '/functions/collection_name.js');
const collectionName = collection_name(__filename, 'model');

const addCounterPlugin = require(__basedir + '/models/plugins/addCounter.js');

const collectionSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    otp: {
        type: String,
        required: [true, 'Table {"name":"<table name>"} name is required!'],
        //unique: [true, 'Table name is duplicate!'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: process.env.OTPTIMEOUT
    },
}, {
    collection: collectionName, toJSON: { virtuals: true }, toObject: { virtuals: true }
});
const providers = ['email', 'mobile'];

collectionSchema.pre('validate', function (next) {
    let hasProvider = false;
    // you should add more validations, e.g. for fields, too
    that = JSON.parse(JSON.stringify(this))
    hasProvider = providers.some(provider => that.hasOwnProperty(provider));
    console.log(hasProvider);
    return (hasProvider) ? next() : next(/*new Error('No Provider provided'); */console.log('No Provider provided'));
});
/*
collectionSchema.path('mobile').required( function () {
    return (this.email !== null || this.email !== undefined)
})
console.log('test5:','include model');

collectionSchema.path('email').required(function () {
    return (this.mobile === null || this.mobile === undefined)
})*/
collectionSchema.plugin(addCounterPlugin);
collectionSchema.index({ _id: 1, id: 1 }, { unique: true });
collectionSchema.plugin(require('mongoose-autopopulate'));
const collectionModel = mongoose.model(collectionName, collectionSchema);
module.exports = { model: collectionModel, schema: collectionSchema }



