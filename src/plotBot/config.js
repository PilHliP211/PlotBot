/**
 * config.js
 * Assists with configuring PlotBot, including adding listener channels and group mappings
 */
const helper = require('./helpers/dataHelpers')

class Channels{
    constructor(){
        this._channelIds = helper.loadData().channelIds;
    }

    AddListenToChannel(channelId)
    {
        if(!this._channelIds) this._channelIds = []
        this._channelIds.push(channelId);
        helper.writeDataPiece(this._channelIds,"channelIds");
    }
    get channelIds(){
        return this._channelIds;
    }
    set channelIds(channelIds){
        this._channelIds = channelIds;
    }
}


var channelExports = {
    Channels
}
module.exports = channelExports;