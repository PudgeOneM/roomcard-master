


var gameLogic = {}

var level_wulong = 0 // 乌龙0
var level_duizi = 1// 对子1
var level_liangdui = 2// 两对2
var level_santiao = 3// 三条3
var level_shunzi = 4// 顺子4
var level_tonghua = 5// 同花5
var level_hulu = 6// 葫芦6
var level_tiezhi = 7// 铁支7
var level_tonghuashun = 8// 同花顺8

var special_quanxiaopai = 1 //全小牌(手牌没有10以上牌)
var special_sanshun = 2//3顺子
var special_sanhua = 3//3同花
var special_liuduiban = 4
var special_liudengyishang = 5//6等以上：13张牌最小6或者6以上牌(6分) 669987jj1010kk
var special_wuduisantiao = 6//5对3条
var special_quanhongyihei = 7 // 全红一点黒：12张红牌1张牌，1张黒牌 （10分）
var special_quanheiyihong = 8 //全黑一红
var special_sisantiao = 9// 全是三张：四个三张相同余一张，赢每家  (12分) 
var special_quanhong = 10//全红
var special_quanhei = 11//全黑
var special_shisanshui = 12
var special_tonghuashisanshui = 13


gameLogic.level2Name  = 
[
    '乌龙',
    '对子',
    '两对',
    '三条',
    '顺子',
    '同花',
    '葫芦',
    '铁支',
    '同花顺'
]


gameLogic.num2Scores  = 
[
    0,
    14,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    15,
    16
]
chairFactory._initUserNode=function()
{
    var chair = this
    var userNode = chair.userNode

    /////chairSpr
    userNode.chairSpr = new cc.Sprite('#cf_chairEmptyIcon.png')
    userNode.addChild(userNode.chairSpr)

    /////headNode
    userNode.headNode = new cc.Node()
    userNode.addChild(userNode.headNode)

    userNode.headIcon = new cc.Sprite('#headIcon.png')
    var hnode = getRectNodeWithSpr(userNode.headIcon, true)
    hnode.setScale(1.13)
    userNode.headNode.addChild(hnode)
    cc.eventManager.addListener(chairFactory._headIconListener(), userNode.headIcon)
    
    userNode.bgFrame = new cc.Sprite('#cf_frame.png')
    userNode.bgFrame.y = -11
    userNode.headNode.addChild(userNode.bgFrame)

    //getLabel取行数会不准
    //所以昵称的width要足够大 不会出现昵称要显示3行就行了 
    userNode.userName = getLabel(20, 150, 2)
    userNode.userName.setFontFillColor( cc.color(242, 255, 233, 255) )
    userNode.userName.setPosition(cc.p(0, 62))
    userNode.headNode.addChild(userNode.userName)   

    // userNode.vipFrame = new cc.Sprite('#cf_vipFrame.png')
    // userNode.headNode.addChild(userNode.vipFrame)   

    userNode.userScore = cc.LabelTTF.create('', "Helvetica", 26)
    userNode.userScore.setFontFillColor( cc.color(236, 236, 0, 255) )
    userNode.userScore.setPosition(cc.p(0, -48.5))
    userNode.headNode.addChild(userNode.userScore)  

    userNode.headNode.setVisible(false)
    userNode.chairSpr.setVisible(true)
}
gameLogic.getTypeList = function(cardDatas)
{
    // cardDatas = [3+16*3,4+16*3,5+16*3,6+16*3,7+16*3,7,8,9, 9+16*2,10+16*2,11+16*2,12+16*2,13+16*2]
    //cardDatas = cardLogic.sortWithNum(cardDatas)

    var specialType = gameLogic.isSpecialType(cardDatas)
    if(specialType.specialType)
        return [specialType]

    var typeList = []
    var tailCardDatasList = combination(cardDatas, 5)
    for(var i=0;i<tailCardDatasList.length;i++)
    {
        var tailCardDatas = tailCardDatasList[i]
        var tailType = gameLogic.getType(tailCardDatas)

        var centerAndHeadCardDatas = getDiffer(cardDatas, tailCardDatas)

        var centerAndHead_typeAndCardDatas = gameLogic.getCenterAndHead(centerAndHeadCardDatas)
        var centerType = centerAndHead_typeAndCardDatas[0][0]
        var headType = centerAndHead_typeAndCardDatas[0][1]
        var centerCardDatas = centerAndHead_typeAndCardDatas[1][0]
        var headCardDatas = centerAndHead_typeAndCardDatas[1][1]

        if( gameLogic.compareType(tailType, centerType)<0
        || gameLogic.compareType(centerType, headType)<0 )
            continue

        typeList[typeList.length] = //[headCardDatas, centerCardDatas, tailCardDatas]
        {
            'specialType':0,
            'head':{cardDatas:clone(headCardDatas), type:headType},
            'center':{cardDatas:clone(centerCardDatas), type:centerType},
            'tail':{cardDatas:clone(tailCardDatas), type:tailType},
        }
    }

    var typeList_simple = []

    for(var i=0;i<typeList.length;i++)
    {
        var type = typeList[i]

        var idx = type.tail.type.level*9*4 + type.center.type.level*4 + type.head.type.level
        typeList_simple[idx] = type
    }

    for(var i=typeList_simple.length-1;i>=0;i--)
    {
        if(!typeList_simple[i])
            typeList_simple.splice(i, 1)
    }

    //去掉被打枪的
    for(var i=typeList_simple.length-1;i>=0;i--)
    {
        var currentType = typeList_simple[i]
        var isDaqiang = false
        for(var ii=0;ii<typeList_simple.length;ii++)
        {
            if(ii==i) continue
            var tempType = typeList_simple[ii]
            if(currentType.head.type.level<=tempType.head.type.level
            &&currentType.center.type.level<=tempType.center.type.level
            &&currentType.tail.type.level<=tempType.tail.type.level)
            {
                isDaqiang = true
                break
            }
        }
        if(isDaqiang)
           typeList_simple.splice(i ,1) 
    }

    return typeList_simple
}

gameLogic.isSpecialType = function(cardDatas)
{
    var type = {
            'specialType':0,
            'head':{cardDatas:null, type:0},
            'center':{cardDatas:null, type:0},
            'tail':{cardDatas:null, type:0},
        }
    var array = gameLogic.analyseCardDatas(cardDatas)
    var duiziArray = array[0]
    var santiaoArray = array[1]
    var shunziArray = array[2]
    var tonghuaArray = array[3]
    var sizhangArray = array[4]
    var tonghuashunArray = array[5]
    var sameColorArray = array[6]
    var plus1NumArray = array[7]
    var sameNumArray = array[8]

    var colorLen0 = sameColorArray[0].length
    var colorLen1 = sameColorArray[1].length
    var colorLen2 = sameColorArray[2].length
    var colorLen3 = sameColorArray[3].length

    var specialType = 0
    var headCardDatas = cardDatas.slice(0,3)
    var centerCardDatas = cardDatas.slice(3,8)
    var tailCardDatas = cardDatas.slice(8,13)

    var plus1NumArray = [[cardDatas[0]]]//顺子的处理逻辑跟三顺的处理逻辑有冲突，在此重新单独检测下三顺
    for(var i=1;i<cardDatas.length;i++)
    {
        var cardData = cardDatas[i]
        var hasInsert = false
        for(var ii=plus1NumArray.length-1;ii>=0;ii--)
        {
            var plus1NumItem = plus1NumArray[ii]
            var tailCardData = plus1NumItem[plus1NumItem.length-1]

            if(cardLogic.getNum(cardData) - cardLogic.getNum(tailCardData) == 1)
            {
                plus1NumItem[plus1NumItem.length] = cardData
                hasInsert = true
                break
            }
        }
        if(!hasInsert)
            plus1NumArray[plus1NumArray.length] = [cardData]
    }
    var A_Array = []
    for(var i=plus1NumArray.length-1;i>=0;i--)
    {
        var item = plus1NumArray[i]
        if( cardLogic.getNum(item[0]) == 1 && item.length!=5 )
        {
            A_Array[A_Array.length] = item.splice(0, 1)[0]
            if(item.length == 0)
              plus1NumArray.splice(i, 1)  
        }
    }
    for(var i=plus1NumArray.length-1;i>=0;i--)
    {
        var item = plus1NumArray[i]
        if( cardLogic.getNum(item[item.length-1]) == 13 && A_Array.length>0)
        {
            var a = A_Array.splice(0, 1)[0]
            item[item.length] = a
        }
    }

    for(var i=0;i<A_Array.length;i++)
    {
        plus1NumArray[plus1NumArray.length] = [A_Array[i]]
    }
    var shunziArray2 = []
    for(var i=0;i<plus1NumArray.length;i++)
    {
        var item = plus1NumArray[i]
        if(item.length>=5)
            shunziArray2[shunziArray2.length] = item
    }
    
    var isLiuDengYiShang = function(cardDatas)
    {
        for (var i = 0; i < cardDatas.length;i++)
        {
            if ( cardLogic.getNum(cardDatas[i]) < 6)
            {
                return false;
            }
        }
        return true;
    }
    var isQuanXiao = function(cardDatas)
    {
        for (var i = 0; i < cardDatas.length; i++)
        {
            if (cardLogic.getNum(cardDatas[i]) > 10)
            {
                return false;
            }
        }
        return true;
    };


    if(tonghuashunArray.length == 1 && tonghuashunArray[0].length == 13 )//同花十三水
        specialType = special_tonghuashisanshui
    else if(shunziArray.length == 1 && shunziArray[0].length == 13 )//十三水
        specialType = special_shisanshui
    else if ((colorLen0 == 0) && (colorLen2 == 0))//全黑
        specialType = special_quanhei;
    else if ((colorLen1 == 0) && (colorLen3 == 0))//全红
        specialType = special_quanhong;
    else if( santiaoArray.length == 4 || (santiaoArray.length == 3&&sizhangArray.length == 1) )//4套三条
        specialType = special_4santiao
    else if ((colorLen1 + colorLen3 == 12))
        specialType = special_quanheiyihong;
    else if ((colorLen0 + colorLen2 == 12))//0-4 方块，梅花，红桃，黑桃
        specialType = special_quanhongyihei;
    else if (santiaoArray.length == 1 && (sizhangArray.length * 2 + duiziArray.length) == 5)//五对三条
        specialType = special_wuduisantiao;
    else if (isLiuDengYiShang(cardDatas))
        specialType = special_liudengyishang;
    else if(sizhangArray.length*2 + duiziArray.length == 6)//6对半
        specialType = special_liuduiban
    else if( (colorLen0==0 || colorLen0==3 || colorLen0==5 || colorLen0==8 || colorLen0==10)//三花
        &&(colorLen1==0 || colorLen1==3 || colorLen1==5 || colorLen1==8 || colorLen1==10)
        &&(colorLen2==0 || colorLen2==3 || colorLen2==5 || colorLen2==8 || colorLen2==10)
        &&(colorLen3==0 || colorLen3==3 || colorLen3==5 || colorLen3==8 || colorLen3==10)
        )
    {
        specialType = special_sanhua

        if(colorLen0==3 || colorLen0==8)
            headCardDatas = sameColorArray[0].slice(0,3)
        else if(colorLen1==3 || colorLen1==8)
            headCardDatas = sameColorArray[1].slice(0,3)
        else if(colorLen2==3 || colorLen2==8)
            headCardDatas = sameColorArray[2].slice(0,3)
        else if(colorLen3==3 || colorLen3==8)
            headCardDatas = sameColorArray[3].slice(0,3)

        var differ = getDiffer(cardDatas, headCardDatas)

        differ.sort(function(a, b)
        {
            return cardLogic.getColor(a) - cardLogic.getColor(b)
        })

        centerCardDatas = differ.slice(0,5)
        tailCardDatas = differ.slice(5,10)
    }
    else if(shunziArray2.length == 2 || (shunziArray2.length==1&&shunziArray2[0].length>=10))//3顺
    {

        var combination_centerAndTail = []

        if(shunziArray2.length == 2)
        {
            var shunzi1 = shunziArray2[0]
            var shunzi2 = shunziArray2[1]
            for(var i=0;i<=shunzi1.length-5;i++)
            {
                for(var ii=0;ii<=shunzi2.length-5;ii++)
                {
                    combination_centerAndTail[combination_centerAndTail.length] = [shunzi1.slice(i, i+5), 
                    shunzi2.slice(ii, ii+5)] 
                }
            }
        }
        else
        {
            var shunzi = shunziArray2[0]
            for(var i=0;i<=shunzi.length-10;i++)
            {
                for(var ii=i+5;ii<=shunzi.length-5;ii++)
                {
                    combination_centerAndTail[combination_centerAndTail.length] = [shunzi.slice(i, i+5), 
                    shunzi.slice(ii, ii+5)] 
                }
            }  
        }


        for(var i=0;i<combination_centerAndTail.length;i++)
        {
            var center = combination_centerAndTail[i][0]
            var tail = combination_centerAndTail[i][1]

            var differ = getDiffer(cardDatas, center.concat(tail))
            differ.sort(function(a, b)
            {
                var num1 = cardLogic.getNum(a)
                if(num1 == 1)num1 = 14
                var num2 = cardLogic.getNum(b)
                if(num2 == 1)num2 = 14
                return num1 - num2
            })
            if( cardLogic.getNum(differ[0]) - cardLogic.getNum(differ[1]) == -1)
            {     
                if( (cardLogic.getNum(differ[1]) - cardLogic.getNum(differ[2]) == -1)//正常情况
                    || (cardLogic.getNum(differ[1])==13&&cardLogic.getNum(differ[2])==1)//QKA
                    || (cardLogic.getNum(differ[0])==2&&cardLogic.getNum(differ[2]) == 1)//A23
                    )
                {
                    specialType = special_sanshun
                    headCardDatas = differ
                    centerCardDatas = center
                    tailCardDatas = tail
                    break
                }
               
            }
        }
    }
    else if(shunziArray.length == 2 || (shunziArray.length==1&&shunziArray[0].length>=10))//3顺
    {
        var combination_centerAndTail = []

        if(shunziArray.length == 2)
        {
            var shunzi1 = shunziArray[0]
            var shunzi2 = shunziArray[1]
            for(var i=0;i<=shunzi1.length-5;i++)
            {
                for(var ii=0;ii<=shunzi2.length-5;ii++)
                {
                    combination_centerAndTail[combination_centerAndTail.length] = [shunzi1.slice(i, i+5), 
                    shunzi2.slice(ii, ii+5)] 
                }
            }
        }
        else
        {
            var shunzi = shunziArray[0]
            for(var i=0;i<=shunzi.length-10;i++)
            {
                for(var ii=i+5;ii<=shunzi.length-5;ii++)
                {
                    combination_centerAndTail[combination_centerAndTail.length] = [shunzi.slice(i, i+5), 
                    shunzi.slice(ii, ii+5)] 
                }
            }  
        }
        for(var i=0;i<combination_centerAndTail.length;i++)
        {
            var center = combination_centerAndTail[i][0]
            var tail = combination_centerAndTail[i][1]

            var differ = getDiffer(cardDatas, center.concat(tail))
            differ.sort(function(a, b)
            {
                var num1 = cardLogic.getNum(a)
                if(num1 == 1)num1 = 14
                var num2 = cardLogic.getNum(b)
                if(num2 == 1)num2 = 14
                return num1 - num2
            })
            if( cardLogic.getNum(differ[0]) - cardLogic.getNum(differ[1]) == -1)
            {     
                if( (cardLogic.getNum(differ[1]) - cardLogic.getNum(differ[2]) == -1)//正常情况
                    || (cardLogic.getNum(differ[1])==13&&cardLogic.getNum(differ[2])==1)//QKA
                    || (cardLogic.getNum(differ[0])==2&&cardLogic.getNum(differ[2]) == 1)//A23
                    )
                {
                    specialType = special_sanshun
                    headCardDatas = differ
                    centerCardDatas = center
                    tailCardDatas = tail
                    break
                }
               
            }
        }
    }
    if(specialType == special_sanshun || specialType == special_sanhua)
    {
        headCardDatas.sort(function(a, b)
            {
                var num1 = cardLogic.getNum(a)
                if(num1 == 1)num1 = 14
                var num2 = cardLogic.getNum(b)
                if(num2 == 1)num2 = 14
                return num1 - num2
            })
        centerCardDatas.sort(function(a, b)
            {
                var num1 = cardLogic.getNum(a)
                if(num1 == 1)num1 = 14
                var num2 = cardLogic.getNum(b)
                if(num2 == 1)num2 = 14
                return num1 - num2
            })
        tailCardDatas.sort(function(a, b)
            {
                var num1 = cardLogic.getNum(a)
                if(num1 == 1)num1 = 14
                var num2 = cardLogic.getNum(b)
                if(num2 == 1)num2 = 14
                return num1 - num2
            })
        var head_shun = (cardLogic.getNum(headCardDatas[0])- (cardLogic.getNum(headCardDatas[1])) == -1)
        if(head_shun)
            head_shun = (cardLogic.getNum(headCardDatas[1])- (cardLogic.getNum(headCardDatas[2])) == -1)
        ||(cardLogic.getNum(headCardDatas[1]) == 13 && cardLogic.getNum(headCardDatas[2]) ==1)
        ||(cardLogic.getNum(headCardDatas[0]) == 2 && cardLogic.getNum(headCardDatas[2]) ==1)
        
        var center_shun = (cardLogic.getNum(centerCardDatas[0])- (cardLogic.getNum(centerCardDatas[1])) == -1
            &&  cardLogic.getNum(centerCardDatas[1])- (cardLogic.getNum(centerCardDatas[2])) == -1 
            &&  cardLogic.getNum(centerCardDatas[2])- (cardLogic.getNum(centerCardDatas[3])) == -1)
        if(center_shun)
            center_shun = (cardLogic.getNum(centerCardDatas[3])- (cardLogic.getNum(centerCardDatas[4])) == -1)
        ||(cardLogic.getNum(centerCardDatas[3]) == 13 && cardLogic.getNum(centerCardDatas[4]) ==1)
        ||(cardLogic.getNum(centerCardDatas[0]) == 2 && cardLogic.getNum(centerCardDatas[4]) ==1)

        var tail_shun = (cardLogic.getNum(tailCardDatas[0])- (cardLogic.getNum(tailCardDatas[1])) == -1
            &&  cardLogic.getNum(tailCardDatas[1])- (cardLogic.getNum(tailCardDatas[2])) == -1 
            &&  cardLogic.getNum(tailCardDatas[2])- (cardLogic.getNum(tailCardDatas[3])) == -1)
        if(tail_shun)
            tail_shun = (cardLogic.getNum(tailCardDatas[3])- (cardLogic.getNum(tailCardDatas[4])) == -1 )
        ||(cardLogic.getNum(tailCardDatas[3]) ==13 && (cardLogic.getNum(tailCardDatas[4])) ==1)
        ||(cardLogic.getNum(tailCardDatas[0]) == 2 && cardLogic.getNum(tailCardDatas[4]) ==1)

        var isSanShun = (head_shun && center_shun && tail_shun);

        var head_hua = (
            (cardLogic.getColor(headCardDatas[0]) == cardLogic.getColor(headCardDatas[1]))
            && (cardLogic.getColor(headCardDatas[1]) == cardLogic.getColor(headCardDatas[2]))
            );
        var center_hua = (
            (cardLogic.getColor(centerCardDatas[0]) == cardLogic.getColor(centerCardDatas[1]))
            && (cardLogic.getColor(centerCardDatas[1]) == cardLogic.getColor(centerCardDatas[2]))
            && (cardLogic.getColor(centerCardDatas[2]) == cardLogic.getColor(centerCardDatas[3]))
            && (cardLogic.getColor(centerCardDatas[3]) == cardLogic.getColor(centerCardDatas[4]))
            );
        var tail_hua = (
            (cardLogic.getColor(tailCardDatas[0]) == cardLogic.getColor(tailCardDatas[1]))
            && (cardLogic.getColor(tailCardDatas[1]) == cardLogic.getColor(tailCardDatas[2]))
            && (cardLogic.getColor(tailCardDatas[2]) == cardLogic.getColor(tailCardDatas[3]))
            && (cardLogic.getColor(tailCardDatas[3]) == cardLogic.getColor(tailCardDatas[4]))
            );
        var isSanHua = (head_hua&&center_hua&&tail_hua);
        if (isSanShun)
            specialType = special_sanshun;
        else if (isSanHua)
            specialType = special_sanhua;
        else
            specialType = 0;
    }
    if(specialType == 0)
    {
        if (isQuanXiao(cardDatas))
        {
            specialType = special_quanxiaopai;
        }
    }
    type.specialType = specialType
    type.head.cardDatas = headCardDatas
    type.center.cardDatas = centerCardDatas
    type.tail.cardDatas = tailCardDatas

    return type
}




gameLogic.getType = function(sortedCardDatas)
{
    var array = gameLogic.analyseCardDatas(sortedCardDatas)
    var duiziArray = array[0]
    var santiaoArray = array[1]
    var shunziArray = array[2]
    var tonghuaArray = array[3]
    var sizhangArray = array[4]
    var tonghuashunArray = array[5]

    //检查是否铁支
    if(sizhangArray.length>0)
        return { level:level_tiezhi, score:gameLogic.getScore(level_tiezhi, sortedCardDatas, sizhangArray[0]) }

    //检查是否葫芦
    if(santiaoArray.length>0 && duiziArray.length>0)
        return { level:level_hulu, score:gameLogic.getScore(level_hulu, sortedCardDatas, santiaoArray[0], duiziArray[0] ) }

    //同花 顺子
    if(tonghuashunArray.length>0)
        return { level:level_tonghuashun, score:gameLogic.getScore(level_tonghuashun, sortedCardDatas) }
    else if(tonghuaArray.length>0)
        return { level:level_tonghua, score:gameLogic.getScore(level_tonghua, sortedCardDatas) }
    else if(shunziArray.length>0)
        return { level:level_shunzi, score:gameLogic.getScore(level_shunzi, sortedCardDatas) }

    //三条
    if(santiaoArray.length>0)
        return { level:level_santiao, score:gameLogic.getScore(level_santiao, sortedCardDatas, santiaoArray[0]) }

    //两对
    if(duiziArray.length==2)
        return { level:level_liangdui, score:gameLogic.getScore(level_liangdui, sortedCardDatas, duiziArray[0], duiziArray[1]) }
    else if(duiziArray.length==1)
        return { level:level_duizi, score:gameLogic.getScore(level_duizi, sortedCardDatas, duiziArray[0]) }

    return { level:level_wulong, score:gameLogic.getScore(level_wulong, sortedCardDatas) }
}

//8张牌摆中道、头道要做具体判断 不能硬算会卡
gameLogic.getCenterAndHead = function(sortedCardDatas)
{
    var array = gameLogic.analyseCardDatas(sortedCardDatas)
    var duiziArray = array[0]
    var santiaoArray = array[1]
    var shunziArray = array[2]
    var tonghuaArray = array[3]
    var sizhangArray = array[4]
    var tonghuashunArray = array[5]

    var centerCardDatas = []
    var centerLevel = level_wulong
    var centerScore

    var headCardDatas = []
    if(tonghuashunArray.length>0)
    {   
        centerLevel = level_tonghuashun
        var tonghuashun = tonghuashunArray[0]

        var differ = getDiffer(sortedCardDatas, tonghuashun)

        if(differ.length==3)
        {
            centerCardDatas = tonghuashun
            headCardDatas = differ
        }
        else if(differ.length==2)
        {
            if(tonghuashun[0] == differ[0] || tonghuashun[0] == differ[1])
            {
                centerCardDatas = tonghuashun.slice(1,6)

                differ[2] = tonghuashun[0] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
            else //无对子则大牌放头道
            {
                centerCardDatas = tonghuashun.slice(0,5)

                differ[2] = tonghuashun[5] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
        }
        else if(differ.length==1)
        {
            if(tonghuashun[0] == differ[0] || tonghuashun[1] == differ[0])
            {
                centerCardDatas = tonghuashun.slice(2,7)

                differ[1] = tonghuashun[0] 
                differ[2] = tonghuashun[1] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
            else
            {
                centerCardDatas = tonghuashun.slice(0,5)

                differ[1] = tonghuashun[5] 
                differ[2] = tonghuashun[6] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
        }
        else
        {
            centerCardDatas = tonghuashun.slice(0,5)
            headCardDatas = tonghuashun.slice(5,8)
        }

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas)
    }
    else if(sizhangArray.length>0)
    {   
        centerLevel = level_tiezhi

        var sizhang = sizhangArray[sizhangArray.length-1]
        if(sizhangArray.length==2)
        {
            centerCardDatas =  [sizhangArray[0][0]].concat(sizhang)
            headCardDatas = sizhangArray[0].slice(1,4)
        }
        else if(santiaoArray.length>0)
        {
            headCardDatas = santiaoArray[0]
            centerCardDatas = getDiffer(sortedCardDatas, headCardDatas)
        }
        else if(duiziArray.length>0)
        {
            headCardDatas = duiziArray[duiziArray.length-1]
            centerCardDatas = sizhang

            var differ = getDiffer(sortedCardDatas, headCardDatas.concat(centerCardDatas))
            headCardDatas = cardLogic.sortWithNum( headCardDatas.concat( [differ[0]] ) )
            centerCardDatas = cardLogic.sortWithNum( centerCardDatas.concat( [differ[1]] ) )
        }
        else
        {
            var differ = getDiffer(sortedCardDatas, sizhang)
            headCardDatas = differ.slice(1, 4)
            centerCardDatas = cardLogic.sortWithNum( sizhang.concat( [differ[0]] ) )
        }

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas, sizhang[0] )
    }
    else if(santiaoArray.length>0 && duiziArray.length>0)
    {
        centerLevel = level_hulu
        var santiao = santiaoArray[santiaoArray.length-1]
        centerCardDatas = cardLogic.sortWithNum( santiao.concat(duiziArray[0]) )
    
        headCardDatas = getDiffer(sortedCardDatas, centerCardDatas)

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas, santiao[0]) 
    }
    else if(tonghuaArray.length>0)
    {  
        centerLevel = level_tonghua
        var tonghua = tonghuaArray[0]
        var color = cardLogic.getColor( tonghua[0])

        var differ = getDiffer(sortedCardDatas, tonghua)
        if(differ.length==3) //同花就5张 必须全做同花
        {
            centerCardDatas = tonghua
            headCardDatas = differ
        }
        else//同花在5张以上
        {
            if(santiaoArray.length>0)
            {
                headCardDatas = santiaoArray[0]
                centerCardDatas = getDiffer(sortedCardDatas, headCardDatas)
            }
            else if(duiziArray.length>0)
            {
                headCardDatas = duiziArray[duiziArray.length-1]
                var differ = getDiffer(sortedCardDatas, headCardDatas)

                var centerCardDatas = []
                for(var i=0;i<differ.length;i++)
                {
                    var c = differ[i]
                    if(cardLogic.getColor(c)==color && cardLogic.getNum(c)!=cardLogic.getNum(headCardDatas[0]))
                        centerCardDatas[centerCardDatas.length] = c
                }
                centerCardDatas = centerCardDatas.slice(0, 5)

                headCardDatas = getDiffer(sortedCardDatas, centerCardDatas)
            }
            else
            {
                centerCardDatas = tonghua.slice(0, 5)
                headCardDatas = getDiffer(sortedCardDatas, centerCardDatas)
            }
        }

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas )
    }
    else if(shunziArray.length>0)
    {   
        centerLevel = level_shunzi
        var shunzi = shunziArray[0]

        var differ = getDiffer(sortedCardDatas, shunzi)
        if(differ.length==3)
        {
            centerCardDatas = shunzi

            headCardDatas = differ
        }
        else if(differ.length==2)
        {
            if(shunzi[0] == differ[0] || shunzi[0] == differ[1])
            {
                centerCardDatas = shunzi.slice(1,6)

                differ[2] = shunzi[0] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
            else //无对子则大牌放头道
            {
                centerCardDatas = shunzi.slice(0,5)

                differ[2] = shunzi[5] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
        }
        else if(differ.length==1)
        {
            if(shunzi[0] == differ[0] || shunzi[1] == differ[0])
            {
                centerCardDatas = shunzi.slice(2,7)

                differ[1] = shunzi[0] 
                differ[2] = shunzi[1] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
            else
            {
                centerCardDatas = shunzi.slice(0,5)

                differ[1] = shunzi[5] 
                differ[2] = shunzi[6] 
                headCardDatas = cardLogic.sortWithNum(differ)
            }
        }
        else
        {
            centerCardDatas = shunzi.slice(0,5)

            differ[0] = shunzi[5] 
            differ[1] = shunzi[6] 
            differ[2] = shunzi[7] 
            headCardDatas = cardLogic.sortWithNum(differ)
        }

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas )
    }
    else if(santiaoArray.length>0)
    {
        centerLevel = level_santiao
        var santiao = santiaoArray[santiaoArray.length-1]
        if(santiaoArray.length == 2)
        {
            headCardDatas = santiaoArray[0]
            centerCardDatas = getDiffer(sortedCardDatas, headCardDatas)
        }
        else
        {
            centerCardDatas = santiaoArray[0]
            var differ = getDiffer(sortedCardDatas, centerCardDatas)

            headCardDatas = differ.slice(2,5)
            centerCardDatas = getDiffer(sortedCardDatas, headCardDatas)
        }

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas, santiao[0]) 
    }
    else if(duiziArray.length>=3) 
    {
        centerLevel = level_liangdui
        var duizi1 = duiziArray[duiziArray.length-1]
        var duizi2 = duiziArray[duiziArray.length-2]

        centerCardDatas = duizi1.concat(duizi2)
        headCardDatas = duiziArray[duiziArray.length-3]

        var differ = getDiffer(sortedCardDatas, centerCardDatas.concat(headCardDatas))
        centerCardDatas[4] = differ[0]
        headCardDatas[2] = differ[1]

        centerCardDatas = cardLogic.sortWithNum(centerCardDatas)
        headCardDatas = cardLogic.sortWithNum(headCardDatas)

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas, duizi1, duizi2 )
    }
    else if(duiziArray.length==2)
    {
        centerLevel = level_liangdui
        var duizi1 = duiziArray[duiziArray.length-1]
        var duizi2 = duiziArray[duiziArray.length-2]
        centerCardDatas = duizi1.concat(duizi2)

        var differ = getDiffer(sortedCardDatas, centerCardDatas)
        headCardDatas = differ.slice(1,4)
        centerCardDatas[4] = differ[0]
        centerCardDatas = cardLogic.sortWithNum(centerCardDatas)

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas, duizi1, duizi2 )
    }
    else if(duiziArray.length==1)
    {
        centerLevel = level_duizi
        var differ = getDiffer(sortedCardDatas, duiziArray[0])
        headCardDatas = differ.slice(3, 6)

        centerCardDatas = getDiffer(sortedCardDatas, headCardDatas)

        centerScore = gameLogic.getScore(centerLevel, centerCardDatas, duiziArray[0])
    }
    else
    {
        centerCardDatas = sortedCardDatas.slice(3, 8)
        centerLevel = level_wulong

        headCardDatas = sortedCardDatas.slice(0, 3)
        headLevel = level_wulong
    }


    var headLevel
    var headScore
    var headCardNum0 = cardLogic.getNum(headCardDatas[0])
    var headCardNum1 = cardLogic.getNum(headCardDatas[1])
    var headCardNum2 = cardLogic.getNum(headCardDatas[2])
    if( headCardNum0 == headCardNum1 &&  headCardNum1== headCardNum2)
    {
        headLevel = level_santiao
        headScore = gameLogic.getScore(headLevel, headCardDatas, headCardDatas)
    }
    else if(headCardNum0 == headCardNum1 || headCardNum1 == headCardNum2)
    {
        headLevel = level_duizi
        if(headCardNum0 == headCardNum1)
            headScore = gameLogic.getScore(headLevel, headCardDatas, headCardDatas.slice(0,2))
        else
            headScore = gameLogic.getScore(headLevel, headCardDatas, headCardDatas.slice(1,3))
    }
    else
    {
        headLevel = level_wulong
        headScore = gameLogic.getScore(headLevel, headCardDatas)
    }

    return [ 
    [ 
        {level:centerLevel, score:centerScore}, 
        {level:headLevel, score:headScore}, 
    ],
    [
        centerCardDatas, 
        headCardDatas
    ] 
    ]
}
gameLogic.getSpecialScore = function(sortedCardDatas)//全红，全黑，全黑一黑，全黑一红
{
    var sortWithScore = clone(sortedCardDatas)//大到小排
    sortWithScore.sort(function(a, b)
    {
        return gameLogic.num2Scores[cardLogic.getNum(b) ] - gameLogic.num2Scores[cardLogic.getNum(a) ]
    })
    var score_0 = gameLogic.num2Scores[cardLogic.getNum(sortWithScore[0]) ]  
    var score_1 = gameLogic.num2Scores[cardLogic.getNum(sortWithScore[1]) ]  
    var score_2 = gameLogic.num2Scores[cardLogic.getNum(sortWithScore[2]) ]

    var sameColorArray = [[],[],[],[]] //同一颜色归类
    for(var i = 0;i<sortWithScore.length;i++)
    {
        var s = sameColorArray[cardLogic.getColor(sortWithScore[i])]
        s[s.length] = sortWithScore[i]
    }
    var colorLen0 = sameColorArray[0].length
    var colorLen1 = sameColorArray[1].length
    var colorLen2 = sameColorArray[2].length
    var colorLen3 = sameColorArray[3].length

    var score = 0
    if(colorLen0 == 13||colorLen1 == 13||colorLen2 == 13||colorLen3 == 13)
    {
        score = score_0*4+cardLogic.getColor(sortWithScore[0])
    }
    else
    {
        var tempArr = []
        if((colorLen0+colorLen2) == 12)
            tempArr = sameColorArray[0].concat(sameColorArray[2]) 
        else if((colorLen1+colorLen3) ==12)
            tempArr = sameColorArray[1].concat(sameColorArray[3]) 
        tempArr.sort(function(a, b)
        {
            return gameLogic.num2Scores[cardLogic.getNum(b) ] - gameLogic.num2Scores[cardLogic.getNum(a) ]
        })
        score = gameLogic.num2Scores[cardLogic.getNum(tempArr[0])]+cardLogic.getColor(tempArr[0])
    }
    return score
}
gameLogic.getScore = function(type, sortedCardDatas, param1, param2)
{
    var isHead = sortedCardDatas.length == 3

    var sortWithScore = clone(sortedCardDatas)//大到小排
    sortWithScore.sort(function(a, b)
    {
        return gameLogic.num2Scores[cardLogic.getNum(b) ] - gameLogic.num2Scores[cardLogic.getNum(a) ]
    })

    var score_0 = gameLogic.num2Scores[cardLogic.getNum(sortWithScore[0]) ]  
    var score_1 = gameLogic.num2Scores[cardLogic.getNum(sortWithScore[1]) ]  
    var score_2 = gameLogic.num2Scores[cardLogic.getNum(sortWithScore[2]) ]  
    var score_3 = isHead?0:gameLogic.num2Scores[cardLogic.getNum(sortWithScore[3]) ]  
    var score_4 = isHead?0:gameLogic.num2Scores[cardLogic.getNum(sortWithScore[4]) ]  

    var score = 0
    if(type==level_wulong)
    {        
        //分别比较 score_0,score_1,score_2,score_3,score_4, color4 max9007199254740992
        score = score_0*Math.pow(13,5)*4 + score_1*Math.pow(13,4)*4 
        + score_2*Math.pow(13,3)*4 + score_3*Math.pow(13,2)*4 
        + score_4*Math.pow(13,1)*4 + cardLogic.getColor(sortWithScore[0])
    }

    if(type==level_duizi)
    {
        var getCard = function(cards,num1)
        {
            var arr = []
            for(var i = 0;i<cards.length;i++)
            {
                var val = cardLogic.getNum(cards[i])
                if(val != num1)
                    arr[arr.length]=cards[i]
            }
            return arr
        }
        var array = getCard(sortWithScore,cardLogic.getNum(param1[1]))
        array.sort(function(a, b)
        {
            return gameLogic.num2Scores[cardLogic.getNum(b) ] - gameLogic.num2Scores[cardLogic.getNum(a) ]
        })
        score_0 = gameLogic.num2Scores[cardLogic.getNum(array[0]) ]  
        score_1 = isHead?0:gameLogic.num2Scores[cardLogic.getNum(array[1]) ]  
        score_2 = isHead?0:gameLogic.num2Scores[cardLogic.getNum(array[2]) ]
        //分别比较对子score score_0,score_1,score_2,score_3,score_4, 对子color 
        var scoreDuiz = gameLogic.num2Scores[ cardLogic.getNum(param1[1]) ]
        var colorCard = cardLogic.getColor(array[0])
        score = scoreDuiz*1000000+score_0*1000+score_1*100+score_2*10+colorCard
    }

    if(type==level_liangdui)
    {
        //分别比较大对子score 小对子score score_0,score_1,score_2,score_3,score_4, 大对子color 
       
        var getCard = function(cards,num1,num2)
        {
            for(var i = 0;i<cards.length;i++)
            {
                var val = cardLogic.getNum(cards[i])
                if(val != num1 && val != num2)
                    return cards[i]
            }
        }
        var scoreDuiz1 =[]
        var scoreDuiz2 =[]
        if(cardLogic.getNum(param1[1]) == 1)
        {
            scoreDuiz1 = gameLogic.num2Scores[ cardLogic.getNum(param2[1]) ]//小对子
            scoreDuiz2 = gameLogic.num2Scores[ cardLogic.getNum(param1[1]) ]//大对子
        }
        else if(cardLogic.getNum(param2[1]) == 1)
        {
            scoreDuiz1 = gameLogic.num2Scores[ cardLogic.getNum(param1[1]) ]//小对子
            scoreDuiz2 = gameLogic.num2Scores[ cardLogic.getNum(param2[1]) ]//大对子
        }
        else
        {
            scoreDuiz1 = gameLogic.num2Scores[ cardLogic.getNum(param1[1]) ]//小对子
            scoreDuiz2 = gameLogic.num2Scores[ cardLogic.getNum(param2[1]) ]//大对子
        }
        var card = getCard(sortedCardDatas,cardLogic.getNum(param1[1]),cardLogic.getNum(param2[1]))
        var scoreCard  = gameLogic.num2Scores[ cardLogic.getNum(card) ]//一张单牌

        score = scoreDuiz2*100000//*(cardLogic.getColor(param2[1])+1)
            + scoreDuiz1*1000//*(cardLogic.getColor(param1[1])+1)
            + scoreCard*10//*(cardLogic.getColor(card)+1)
            + cardLogic.getColor(card)
    }

    if(type==level_santiao)
    {
        //分别比较三条score
        score = gameLogic.num2Scores[ cardLogic.getNum(param1[0]) ]
    }

    if(type==level_shunzi)//A2345比910JQK大
    {
        // if(score_0 == 12 && score_4 == 0) 
        //     score = score_1*4 + cardLogic.getColor(sortWithScore[1])
        // else
            score = score_0*10 + cardLogic.getColor(sortWithScore[0])
    }

    if(type==level_tonghua)
    {
        score = score_0*Math.pow(13,5)*4 + score_1*Math.pow(13,4)*4 
        + score_2*Math.pow(13,3)*4 + score_3*Math.pow(13,2)*4 
        + score_4*Math.pow(13,1)*4 + cardLogic.getColor(sortWithScore[0])
    }

    if(type==level_hulu)
    {
        //分别比较三条score
        score = gameLogic.num2Scores[ cardLogic.getNum(param1[0]) ]
    }

    if(type==level_tiezhi)
    {
        //分别比较四条score
        score = gameLogic.num2Scores[ cardLogic.getNum(param1[0]) ]
    }

    if(type==level_tonghuashun)//A2345比910JQK大
    {      
        // if(score_0 == 12 && score_4 == 0) 
        //     score = score_1*4 + cardLogic.getColor(sortWithScore[1])
        // else
            score = score_0*10 + cardLogic.getColor(sortWithScore[0])
    }

    return score
}



//比大小
gameLogic.compareType = function(type1, type2)
{
    if(type1.level != type2.level)
        return type1.level - type2.level

    return type1.score - type2.score
}

gameLogic.getRandomArrayElements = function(arr, count)
{
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
gameLogic.analyseCardDatas = function(sortedCardDatas)
{
    var shunziArray = []//因为只有8张并且顺子必须5张以上并且这个数组只会存最长的那个 所以这个数组最多只会有一个元素
    var tonghuaArray = []//同上 这个数组最多只会有一个元素
    var tonghuashunArray = []//同上 这个数组最多只会有一个元素
    var duiziArray = []
    var santiaoArray = []
    var sizhangArray = []

    //将sortedCardDatas分类
    var cardData0 = sortedCardDatas[0]
    var sameColorArray = [[],[],[],[]] //同一颜色归类
    sameColorArray[cardLogic.getColor(cardData0)] = [cardData0]

    var plus1NumArray = [[cardData0]]//num递增1归类
    var sameNumArray = [[cardData0]]//同一num归类

    for(var i=1;i<sortedCardDatas.length;i++)
    {
        var cardData = sortedCardDatas[i]

        ///////
        var s = sameColorArray[cardLogic.getColor(cardData)]
        s[s.length] = cardData

        ///////
        var hasInsert = false
        for(var ii=plus1NumArray.length-1;ii>=0;ii--)
        {
            var plus1NumItem = plus1NumArray[ii]
            var tailCardData = plus1NumItem[plus1NumItem.length-1]

            if(cardLogic.getNum(cardData) - cardLogic.getNum(tailCardData) == 1)
            {
                plus1NumItem[plus1NumItem.length] = cardData
                hasInsert = true
                break
            }
            else if(cardLogic.getNum(cardData) - cardLogic.getNum(tailCardData) == 0)
            {
                hasInsert = true
            }
        }
        if(!hasInsert)
            plus1NumArray[plus1NumArray.length] = [cardData]


        ///////
        var sameNumItem = sameNumArray[sameNumArray.length-1]
        if(cardLogic.getNum(sameNumItem[sameNumItem.length-1]) - cardLogic.getNum(cardData) == 0)
        {
            sameNumItem[sameNumItem.length] = cardData
        }
        else
            sameNumArray[sameNumArray.length] = [cardData]
    }

    for(var i=0;i<4;i++)
    {
        if(sameColorArray[i].length>=5)
           tonghuaArray[tonghuaArray.length] = sameColorArray[i]
    }

    //////
    var A_Array = []
    for(var i=plus1NumArray.length-1;i>=0;i--)
    {
        var item = plus1NumArray[i]
        if( cardLogic.getNum(item[0]) == 1 && item.length!=5 )
        {
            A_Array[A_Array.length] = item.splice(0, 1)[0]
            if(item.length == 0)
              plus1NumArray.splice(i, 1)  
        }
    }
    for(var i=plus1NumArray.length-1;i>=0;i--)
    {
        var item = plus1NumArray[i]
        if( cardLogic.getNum(item[item.length-1]) == 13 && A_Array.length>0)
        {
            var a = A_Array.splice(0, 1)[0]
            item[item.length] = a
        }
    }

    for(var i=0;i<A_Array.length;i++)
    {
        plus1NumArray[plus1NumArray.length] = [A_Array[i]]
    }

    for(var i=0;i<plus1NumArray.length;i++)
    {
        var item = plus1NumArray[i]
        if(item.length>=5)
        //if(item.length>=3)
            shunziArray[shunziArray.length] = item
    }
    ///////


    for(var i=0;i<sameNumArray.length;i++)
    {
        var sub = sameNumArray[i]
        var len = sub.length
        if(len==2)
            duiziArray[duiziArray.length] = sub
        else if(len==3)
            santiaoArray[santiaoArray.length] = sub
        else if(len==4)
            sizhangArray[sizhangArray.length] = sub

    }

    //同花顺
    for(var i=0;i<tonghuaArray.length;i++)
    {
        var cardDatas = tonghuaArray[i]

        var plus1NumArrayT = [[cardDatas[0]]]//num递增1归类

        for(var ii=1;ii<cardDatas.length;ii++)
        {
            var cardData = cardDatas[ii]

            var hasInsert = false
            for(var iii=0;iii<plus1NumArrayT.length;iii++)
            {
                var plus1NumItem = plus1NumArrayT[iii]
                var tailCardData = plus1NumItem[plus1NumItem.length-1]

                if(cardLogic.getNum(cardData) - cardLogic.getNum(tailCardData) == 1)
                {
                    plus1NumItem[plus1NumItem.length] = cardData
                    hasInsert = true
                    break
                }
            }
            if(!hasInsert)
                plus1NumArrayT[plus1NumArrayT.length] = [cardData]
        }

        var A_Array = []
        for(var ii=plus1NumArrayT.length-1;ii>=0;ii--)
        {
            var item = plus1NumArrayT[ii]
            if( cardLogic.getNum(item[0]) == 1 && item.length!=5 && item.length!=10)
            {
                A_Array[A_Array.length] = item.splice(0, 1)[0]
                if(item.length == 0)
                  plus1NumArrayT.splice(ii, 1)  
            }
        }
        for(var ii=plus1NumArrayT.length-1;ii>=0;ii--)
        {
            var item = plus1NumArrayT[ii]
            if( cardLogic.getNum(item[item.length-1]) == 13 && A_Array.length>0)
            {
                var a = A_Array.splice(0, 1)[0]
                item[item.length] = a
            }
        }

        for(var ii=0;ii<A_Array.length;ii++)
        {
            plus1NumArrayT[plus1NumArrayT.length] = [A_Array[ii]]
        }

        for(var ii=0;ii<plus1NumArrayT.length;ii++)
        {
            var item = plus1NumArrayT[ii]
            if(item.length>=5)
                tonghuashunArray[tonghuashunArray.length] = item
        }
    }
    return [
        duiziArray,
        santiaoArray,
        shunziArray,
        tonghuaArray,
        sizhangArray,
        tonghuashunArray,
        sameColorArray,
        plus1NumArray,
        sameNumArray
    ]    
}