
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true,
        minlength: 2
    },
    last_name: {
        type: String,
        required: true,
        minlength: 2
    },
    birthday: {
        type: Date,
        required: true
    },
    marital_status: {
        type: String,
        required: true,
        enum: ['single', 'married', 'divorced', 'widowed']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


userSchema.virtual('age').get(function () {
    const now = new Date();
    return now.getFullYear() - this.birthday.getFullYear();
});

module.exports = mongoose.model('User', userSchema);
