const { expect } = require('chai');
const mongoose = require('mongoose');

const config = require('../config');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', async function () {
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

    it('should add a created post to the posts of the creator', async function () {
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post',
            },
            file: { path: 'abc' },
            userId: '5c0f66b979af55031b34728a',
        };
        const res = {
            status: function () {
                return this;
            },
            json: function () {},
        };

        const savedUser = await FeedController.createPost(req, res, () => {});
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
    });

    after(async function () {
        await User.deleteMany({});
        await mongoose.disconnect();
    });
});
