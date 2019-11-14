const express = require('express');
const webpush = require('web-push');

const PUBLIC_KEY = 'BJMY72ZYq-CJHVUNGPSGFuheKPe36kN4dBCXAOaRkusxHEggbzd6qTFiAD5l9lLzQ5QWVVUkoP7zyyMvmjFoYZY';
const PRIVATE_KEY = 'yHpcx7IQKAYJ1sKRFwE9jTNt5_63CVF5ok9rilHLkbo';

/* GET home page. */
exports.indexGet = function(req, res, next) {
    res.render('index', {
        'title': 'Internet Speed and Push Notifications'
    });
};