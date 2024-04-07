class Room {
    constructor(id, streamer, thumbnail) {
        this.id = id;
        this.streamer = streamer;
        this.thumbnail = thumbnail;
        // this.thumbUrl = '';
        this.views = 0;
        this.maxViews = 0;
        this.positive = 0;
        this.negative = 0;
        this.users = new Set([streamer]);
        this.messages = [];
    }
}

module.exports = Room;
