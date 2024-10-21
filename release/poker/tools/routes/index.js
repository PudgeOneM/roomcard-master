
var express = require('express')
var router = express.Router()
var requestHandlers = require("./requestHandlers")
var fs=require("fs")
var url = require("url")
var qs = require('querystring');



require('./functions.js')

router.get('/', function(req, res, next) {
  	res.render('index', { title: 'index' , tips: "choose a operation:"})
})

router.get('/runGame', function(req, res, next) {
    requestHandlers.getRunGame(req, res)
})

router.post('/runGame', function(req, res, next) {
    requestHandlers.postRunGame(req, res)
})

router.get('/publishGame', function(req, res, next) {
    requestHandlers.getPublishGame(req, res)
})

router.post('/publishGame', function(req, res, next) {
    requestHandlers.postPublishGame(req, res)
})

router.get('/c2js', function(req, res, next) {
    requestHandlers.getC2js(res)
})

router.get('/publishCocos', function(req, res, next) {
    requestHandlers.getPublishCocos(res)
})

router.get('/stressTest', function(req, res, next) {
  	
	requestHandlers.stressTesting(res)
  	//res.render('stressTest', { title: 'stressTest' , tips: ""})
})

router.get('/virtualUserEnter', function(req, res, next) {
    
  requestHandlers.virtualUserEnter(req, res)

})

router.get('/searchFile', function(req, res, next) {
  requestHandlers.getSearchFile(res)
})

router.post('/searchFile', function(req, res, next) {
    requestHandlers.postSearchFile(req, res)
})


router.get('/createGameModel', function(req, res, next) {
    requestHandlers.getCreateGameModel(req, res)
})

// router.post('/publishGame', function(req, res, next) {
//     requestHandlers.postPublishGame(req, res)
// })





// router.post('/stressTest', 
// function(req, res, next) 
// {
// 	if( typeof(req.body.createRoom) != 'undefined' )
// 	{	

// 		requestHandlers.createRoom(req.body.userBeginId, req.body.userEndId, req.body.sendInterval, req.body.timeout)
// 		res.redirect('/stressTest')
		
// 		//res只能render一次
// 		//有一个刷新按钮 开始测试后需要自己手动刷新查看进度  就和之前那个一样 
// 	//res.render('stressTest', { title: 'stressTest' , tips: "1111111"})


// // 创建房间(默认1-2000是用于创建房间的id,  创建成功算成功)
// // 用户起始id 用户结束id 发送间隔  超时时间
// // 确定

// 	}
// 	else if( typeof(req.body.fillRoom) != 'undefined' )
// 	{	





// 	}
// 	else if( typeof(req.body.startGame) != 'undefined' )
// 	{	





// 	}
// 	else if( typeof(req.body.playGame) != 'undefined' )
// 	{	



// 	}
// 	else 
// 	{
// 		res.redirect('/stressTesting')
// 	}
// })




module.exports = router
