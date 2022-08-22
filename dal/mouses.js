// import in the mouse model
const {Mouse, Brand, Variant, Color, Feature, Backlighting, GameType} = require('../models');

const getAllBrands = async() => {
    return await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })
}

const getAllFeatures = async() => {
    return await Feature.fetchAll().map((feature) => {
        return [feature.get('id'), feature.get('name')]
    })
}

const getAllBacklightings = async() => {
    return await Backlighting.fetchAll().map((backlighting) => {
        return [backlighting.get('id'), backlighting.get('name')]
    })
}

const getAllGameTypes = async() => {
    return await GameType.fetchAll().map((gameType) => {
        return [gameType.get('id'), gameType.get('name')]
    })
}

const getAllMouses = async () => {
    return await Mouse.fetchAll()
}

module.exports = {
    getAllBacklightings, getAllBrands, getAllFeatures, getAllGameTypes, getAllMouses
}