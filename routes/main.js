const express = require('express');
const router = express.Router();

/* Category GET & POST Api */
router.route('/categories')
.get((req, res, next) => {
    Category.find({}, (err, category) => {
       res.json({
           success: true,
           message: 'successfully got categories',
           category: category
       })
    })
})
.post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
        success: true,
        message: 'successfully posted'
    });
});