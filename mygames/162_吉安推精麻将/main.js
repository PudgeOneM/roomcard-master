
require('src/main/CMD_Base.js')
// require('src/main/CMD_Extend.js')
require('src/main/gameResPath.js')
require('src/main/base64ResConf.js')
require('src/main')

require('src/game')
setLocalStorage('isOpenPTH_' + KIND_ID, 'open')
//setLocalStorage( 'styleArray_' + KIND_ID,  JSON.stringify(styleArray)) //强制设为‘静谧蓝’

var SERVER_CHAIR = SHOW_CHAIR = GAME_PLAYER
gameStart.runGame()