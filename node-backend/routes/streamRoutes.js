const express = require('express');
const {
    getPastStreamsByStreamer,
    getUpcomingStreamsByStreamer,
    getStreams,
    registerStream,
} = require('../controllers/streamController');

const router = express();

router.route('/streams/live').get(getStreams);

router
    .route('/streams/upcoming/user/:streamerId')
    .get(getUpcomingStreamsByStreamer);

router.route('/streams/past/user/:streamerId').get(getPastStreamsByStreamer);

router.route('/stream/register').post(registerStream);

module.exports = router;
