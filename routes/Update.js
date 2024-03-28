const express = require("express");
const ProductModel = require("../helpers/product-helper");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Update_operations');
});


//findByIdAndUpdate()    //post patch request to http://localhost:port/update/products/adatabaseidkey
router.patch('/products/:id', (req, res) => {
    ProductModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
        .then((product)=>{
            if(!product){
                return res.status(404).send()
            }res.send(product)
        }).catch((error)=>{
            res.status(500).send(error)
        })
    })

// findOne()   // post a patch request to http://
router.patch('/productss/:id', (req, res) => {
    ProductModel.updateOne({ _id: req.params.id }, req.body)
        .then((result) => {
            if (result.n === 0) {
                return res.status(404).send({ error: 'Product not found' });
            }
            res.send({ message: 'Product updated successfully' });
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});




    

module.exports = router;