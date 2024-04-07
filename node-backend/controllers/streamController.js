const catchAsync = require('../middlewares/catchAsync');
const Stream = require('../models/streamModel');
const { rooms } = require('../sockets/streamSockets');

exports.getStreams = catchAsync(async (req, res) => {
    const liveStreams = [];
    for (const [key, val] of Object.entries(rooms)) {
        liveStreams.push({
            id: val.id,
            streamer: val.streamer.userId,
            thumbnail: val.thumbnail,
            views: val.views,
        });
    }

    res.status(200).json({ data: { liveStreams } });
});

exports.getPastStreamsByStreamer = catchAsync(async (req, res) => {
    const streams = await Stream.find({
        streamer: req.params.streamerId,
        heldOn: { $lt: Date.now() },
    });
    res.status(200).json({ data: { streams } });
});

exports.getUpcomingStreamsByStreamer = catchAsync(async (req, res) => {
    const streams = await Stream({
        streamer: req.params.streamerId,
        heldOn: { $gt: Date.now() },
    });
    res.status(200).json({ data: { streams } });
});

exports.registerStream = catchAsync(async (res, req) => {
    const stream = await Stream.create({
        ...req.body,
        streamer: req.id,
    });

    res.status(200).json({
        message: 'You have successfully registered your upcoming stream',
        data: { stream },
    });
});
