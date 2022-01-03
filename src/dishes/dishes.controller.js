const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
    res.json({data: dishes})
}

function dishExists(req, res, next) {
    const {dishId} = req.params
    const foundDish = dishes.find((dish) => dish.id === dishId)
    if (foundDish) {
        res.locals.dish = foundDish
        return next()
    }
    next({
        status: 404,
        message: `Dish id not found: ${dishId}`
    })
}

function read(req, res, next) {
    res.json({
        data: res.locals.dish
    })
}

function namePropertyExists(req, res, next) {
    const {data: {name} = {}} = req.body
    if (name) {
      res.locals.name = name
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a name"
    })
}

function namePropertyEmpty(req, res, next) {
    const {data: {name} = {}} = req.body
    if (name === "") {
        next({
            status: 400,
            message: "Dish must include a name"
        })
    }
    return next()
}

function descriptionPropertyExists(req, res, next) {
    const {data: {description} = {}} = req.body
    if (description) {
      res.locals.description = description
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a description"
    })
}

function descriptionPropertyEmpty(req, res, next) {
    const {data: {description} = {}} = req.body
    if(description === "") {
        next({
            status: 400,
            message: "Dish must include a description"
        })
    }
    return next();
}

function pricePropertyExists(req, res, next) {
    const {data: {price} = {}} = req.body
    if (price) {
      res.locals.price = price
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a price"
    })
}

function pricePropertyGreater(req, res, next) {
    const {data: {price} = {}} = req.body
    if(price === 0 || price < 0){
        next({
            status: 400,
            message: "Dish must have a price that is an integer greater than 0"
        })
    }
    return next()
}

function pricePropertyNotInteger(req, res, next) {
    const {data: {price} = {}} = req.body
    if (Number.isInteger(price)) {
        return next()
    }
    next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0"
    })
}

function imageUrlPropertyExists(req, res, next) {
    const {data: {image_url} = {}} = req.body
    if (image_url) {
      res.locals.imageUrl = image_url
        return next()
    }
    next({
        status: 400, 
        message: "Dish must include a image_url"
    })
}

function imageUrlPropertyEmpty(req, res, next) {
    const {data: {image_url} = {}} = req.body
    if(image_url === "") {
        next({
            status: 400, 
            message: "Dish must include a image_url"
        })
    }
    return next()
}

function create(req, res) {
    const {data: {name, description, price, image_url} = {}} = req.body
    const newId = new nextId()
    const newDish = {
        id: newId,
        name: res.locals.name, 
        description: res.locals.description,
        price: res.locals.price, 
        image_url: image_url
    }
    dishes.push(newDish)
    res.status(201).json({data: newDish})
}

function dishIdMatch(req, res, next) {
    const {data: {id} ={}} = req.body
    const {dishId} = req.params
    if(id === dishId || !id){
        return next()
    }
    next({
        status: 400, 
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
    })
}

function update(req, res) {
    const dish = res.locals.dish
    const{data: {name, description, price, image_url} = {}} = req.body
    dish.name = name
    dish.description = description
    dish.price = price
    dish.image_url = image_url
    res.json({data: dish})
}

module.exports = {
    list, 
    read: [dishExists, read],
    create: [
        namePropertyExists,
        namePropertyEmpty,
        descriptionPropertyExists,
        descriptionPropertyEmpty,
        pricePropertyExists,
        pricePropertyGreater,
        pricePropertyNotInteger,
        imageUrlPropertyExists,
        imageUrlPropertyEmpty,
        create
    ],

    update: [
        dishExists,
        dishIdMatch,
        namePropertyExists,
        namePropertyEmpty,
        descriptionPropertyExists,
        descriptionPropertyEmpty,
        pricePropertyExists,
        pricePropertyGreater,
        pricePropertyNotInteger,
        imageUrlPropertyExists,
        imageUrlPropertyEmpty,
        update
    ]
}