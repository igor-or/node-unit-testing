const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const config = require('../config');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', async function () {
    before(async function () {
        await mongoose.connect(config.TEST_DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const user = new User({
            email: 'test@test.com',
            password: 'tester',
            name: 'Test',
            posts: [],
            _id: '5c0f66b979af55031b34728a',
        });
        await user.save();
    });

    it('should throw an error with code 500 if accessing database fails', async function () {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester',
            },
        };

        const result = await AuthController.login(req, {}, () => {});
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', async function () {
        const req = { userId: '5c0f66b979af55031b34728a' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            },
        };

        await AuthController.getUserStatus(req, res, () => {});

        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new!');
    });

    after(async function () {
        await User.deleteMany({});
        await mongoose.disconnect();
    });
});
