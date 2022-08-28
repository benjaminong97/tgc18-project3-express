const express = require('express')
const router = express.Router();
const {Mouse} = require('../../models')
const {createMouseForm} = require('../../forms')

const productDataLayer = require('../../dal/mouses')

router.get('/', async(req,res)=>{
    console.log('received req')
    try{ res.send(await productDataLayer.getAllMouses())
    } catch {
        res.sendStatus(500)
    }

})

router.get('/features', async (req,res) => {
    let allFeatures = await productDataLayer.getAllFeatures()
    res.send (allFeatures)
})

router.get('/backlightings', async (req,res) => {
    let allBacklightings = await productDataLayer.getAllBacklightings()
    res.send(allBacklightings)
})

router.get('/gametypes', async(req,res) => {
    let allGameTypes = await productDataLayer.getAllGameTypes()
    res.send(allGameTypes)
})

router.get('/brands', async(req,res) => {
    let allBrands = await productDataLayer.getAllBrands()
    res.send(allBrands)
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