const mongoose = require("mongoose");
const makeURL = require("url").URL;

class Int8 extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'Int8');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        let _val = Number(val);
        if (isNaN(_val)) {
            throw new Error('Int8: ' + val + ' is not a number');
        }
        _val = Math.round(_val);
        if (_val < -0x80 || _val > 0x7F) {
            throw new Error('Int8: ' + val +
                ' is outside of the range of valid 8-bit ints');
        }
        return _val;
    }
}
class URL extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'URL');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        try {
            new makeURL(val);
            return val;
        } catch (err) {
            throw new Error('URL: ' + val + ' is not a URL');
        }
    }
}
class Email extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'Email');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        try {

            var res = val.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (res) {
                return val;
            } else {
                throw new Error('Email: ' + val + ' is not a Email');

            }
        } catch (err) {
            throw new Error('Email: ' + val + ' is not a Email');
        }
    }
}
class ArrayOfObjects extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'ArrayOfObjects');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        try {

            if (Array.isArray(val)) {
                // Using for loop
                for(var x = 0; x < val.length; x++){
                    if(typeof val[x] !== 'object'){
                        throw new Error('ArrayOfObjects: ' + val + ' is an Array but at least on of its element is not object.');
                    }
                }
                return val;
            } else {
                throw new Error('ArrayOfObjects: ' + val + ' is not an Array');

            }
        } catch (err) {
            throw new Error('ArrayOfObjects: ' + val + ' is not a ArrayOfObjects');
        }
    }
}

class Json extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'Json');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        try {
            var valTest = JSON.parse(JSON.stringify(val));
            if (typeof valTest == "object"){
                //Json
                return val;
            } else {
                //Not Json
                throw new Error('Json: ' + val + ' is not an Json'+ typeof valTest);
            }
        }
        catch {
            throw new Error('Json: ' + val + ' is not a Json'+ typeof valTest);
        }
    }
}
/*
class EmptyObjectId extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'EmptyObjectId');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        try {
             var valTest = mongoose.isValidObjectId(val); // true
            if (typeof valTest == true ||  valTest == undefined ||  valTest == '' ||  valTest == null ){
                //Json
                return val;
            } else {
                //Not Json
                throw new Error('EmptyObjectId: ' + val + ' is not an EmptyObjectId '+ typeof valTest);
            }
        }
        catch {
            throw new Error('EmptyObjectId: ' + val + ' is not a EmptyObjectId '+ typeof valTest);
        }
    }
}
    */
// Don't forget to add `Int8` to the type registry
mongoose.Schema.Types.Int8 = Int8;
mongoose.Schema.Types.URL = URL;
mongoose.Schema.Types.Email = Email;
mongoose.Schema.Types.ArrayOfObjects = ArrayOfObjects;
mongoose.Schema.Types.Json = Json;
//mongoose.Schema.Types.EmptyObjectId = EmptyObjectId;

module.exports = mongoose