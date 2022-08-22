const express = require('express')
const router = express.Router();
const {Mouse} = require('../../models')
const {createMouseForm} = require('../../forms')

const productDataLayer = require('../../dal/mouses')

router.get('/', async(req,res)=>{
    res.send(await productDataLayer.getAllMouses())
})

router.post ('/', async(req,res) => {
    const allBrands = await productDataLayer.getAllBrands()
    const allBacklightings = await productDataLayer.getAllBacklightings()
    const allFeatures = await productDataLayer.getAllFeatures()
    const allGameTypes = await productDataLayer.getAllGameTypes()
    const mouseForm = createMouseForm(allBrands, allFeatures, allBacklightings, allGameTypes);

    mouseForm.handle(req, {
        'success' : async(form) => {
            let {features, ...mouseData} = form.data
            const mouse = new Mouse(mouseData)
            await productDataLayer.save()

            // saving the many to many relationship
            if (features) {
                await mouse.features().attach(features.split(','))
            }
            res.send(mouse)
        },
        'error' : async(form) => {
            let errors = {}
            for (let key in form.fields) {
                if (form.fieds[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })


})

module.exports = router;