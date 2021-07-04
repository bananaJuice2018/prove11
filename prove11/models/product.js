// Product model

const fs = require('fs');

// Using node-fetch
const fetch = require('node-fetch');

module.exports = class Product {
    static fetchAll(page, cb) {
        const productsUrl = 'https://name-list-socket.herokuapp.com/fetchAll?offset=' + (page - 1) * 10 + '&limit=10';
        fetch(productsUrl)
            .then(res => res.json())
            .then(result => {
                let products = result.results;
                const lastPage = Math.ceil(result.count / 10);
                cb(products, lastPage);
            })
            .catch(err => console.log(err));
    }   
};