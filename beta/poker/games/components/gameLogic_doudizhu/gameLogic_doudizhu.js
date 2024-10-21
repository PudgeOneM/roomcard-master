
var gameLogic_doudizhu = {
    resp:'components/gameLogic_doudizhu/res/',
    onPreLoadRes:function()
    {   
        // var resp = gameLogic_doudizhu.resp
        // cc.spriteFrameCache.addSpriteFrames(resp + 'gameLogic_doudizhu.plist', resp + 'gameLogic_doudizhu.png')
    }
}

var gameLogic = gameLogic_doudizhu
//常量
var COLOR_OF_CHANGETO = 0
var MAX_CARDDATA = 80

// 取值范围：
// cardData:1-79
// laiziCardData:>79
gameLogic.getLaiziCardData = function(changeToNum, cardDataOfLaizi)
{
    //因为COLOR_OF_CHANGETO=0 所以cardDataOfChangeTo取值在0-16
    var cardDataOfChangeTo = cardLogic.getCardData(changeToNum, COLOR_OF_CHANGETO)
    var laiziCardData = MAX_CARDDATA + cardDataOfChangeTo + cardDataOfLaizi*16 

    return laiziCardData
}

gameLogic.getCardDataOfChangeTo = function(laiziCardData)
{
    var cardDataOfChangeTo = (laiziCardData - MAX_CARDDATA)%16
    return cardDataOfChangeTo
}

gameLogic.getCardDataOfLaizi = function(laiziCardData)
{
    var cardDataOfLaizi = Math.floor( (laiziCardData - MAX_CARDDATA)/16 ) 
    return cardDataOfLaizi
}

//将CardDatas分割出无癞子组合全癞子组
gameLogic.splitCardDatas = function(c_sortedCardDatas, cardDataOfLaiziTable)
{
    cardDataOfLaiziTable = cardDataOfLaiziTable || []
    var sortedCardDatasExcludeLazi = []
    var sortedCardDatasOfLaizi = []
    for(var i=0;i<c_sortedCardDatas.length;i++)
    {
        var cardData = c_sortedCardDatas[i] 
        var isLazi = cardData>=MAX_CARDDATA
        for(var ii=0;ii<cardDataOfLaiziTable.length;ii++)
        {
            if(cardData == cardDataOfLaiziTable[ii])
            {
                isLazi = true
                break
            }
        }
        if(isLazi)
            sortedCardDatasOfLaizi[sortedCardDatasOfLaizi.length] = cardData>=MAX_CARDDATA?gameLogic.getCardDataOfLaizi(cardData):cardData 
        else
            sortedCardDatasExcludeLazi[sortedCardDatasExcludeLazi.length] = cardData
    }
    //填癞子时并不能保证根据num越小越先填 即c_sortedCardDatas是有序的 但不能保证sortedCardDatasOfLaizi有序（花色）
    sortedCardDatasOfLaizi = cardLogic.sortWithNum(sortedCardDatasOfLaizi)

    return [sortedCardDatasExcludeLazi, sortedCardDatasOfLaizi]
}


gameLogic.getOriginCard = function(c_outCardDatas)
{
    var originCard = []
    for(var i=0;i<c_outCardDatas.length;i++)
    {
        var cardData = c_outCardDatas[i];
        if(cardData>=MAX_CARDDATA)
            originCard[i] = gameLogic.getCardDataOfLaizi(cardData)
        else
            originCard[i] = cardData
    }
    return originCard
}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////


/////////////////////// 解析牌型  需要cardDatas才能唯一解析 start ///////////////////////
gameLogic.getCardsType = function(c_sortedCardDatas) 
{
    var t = gameLogic.splitCardDatas(c_sortedCardDatas)

    var cardsTypes = gameLogic._getCardsTypesWithLaizi(t[0], t[1]) 
    for(var i=0;i<cardsTypes.length;i++)
    {
        var cardsType = cardsTypes[i]
        var cardDatas = cardLogic.sortWithNum( clone(cardsType.cardDatas) ) 
        var isSame = c_sortedCardDatas.length == cardDatas.length
        for(var j=0;j<c_sortedCardDatas.length;j++)
        {
            isSame = c_sortedCardDatas[j] == cardDatas[j]
            if(!isSame)
                break
        }
        if(isSame)
            return cardsType
    }

    return {typeIdx:0, typeLevel:0, typeScores:0}
}

gameLogic.getCardsTypesWithCardDatas = function(c_sortedCardDatas, cardDatasOfLaiziTable) 
{
    var cardsTypesMax = []
    var t = gameLogic.splitCardDatas(c_sortedCardDatas, cardDatasOfLaiziTable)
    var cardsTypes = gameLogic._getCardsTypesWithLaizi(t[0], t[1]) 

    console.log('getCardsTypesWithCardDatas:',cardsTypes, clone(t) )

    var maxTypeLevel = 0
    for(var i in cardsTypes)
    {
        if(cardsTypes[i].typeLevel>maxTypeLevel)
            maxTypeLevel = cardsTypes[i].typeLevel
    }

    for(var i=0;;i++)
    {   
        var kind = i 
        if(gameLogic.cardsParser[maxTypeLevel][kind])
        {
            var len = cardsTypesMax.length
            for(var j in cardsTypes)
            {   
                var c = cardsTypes[j]
                if(c.typeLevel == maxTypeLevel && c.typeKind == kind)
                {
                    if(!cardsTypesMax[len] || cardsTypesMax[len].typeScores < c.typeScores )
                        cardsTypesMax[len] = c
                }
            }
        }
        else
            break
    }

    return cardsTypesMax
}

// //////////////////////内部函数
gameLogic._getCardsTypesWithLaizi = function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi) 
{
    var cardsTypes = [] 
    for(var level=gameLogic.cardsParser.length-1;level>0;level--)
    {
        var parsers = gameLogic.cardsParser[level]
        for(var i=0;i<parsers.length;i++)
        {
            var cardsParser = parsers[i]
            var cardsType = cardsParser.parser( c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi ) 
            if(cardsType)
                cardsTypes[cardsTypes.length] = cardsType
        }
    }
    return cardsTypes
}


// a、比牌型索引 
// 牌型索引为0时表示不构成牌型 返回无法比较
// 牌型索引一样的话就比牌型分 分大的大
// 牌型索引不一样的话再比牌型等级->b

// b、牌型等级一样 返回无法比较
// 牌型等级不一样的话 等级大的大 
gameLogic.compareTwoCardsType = function(cardsType1, cardsType2) 
{
    var result //0（前者大） 1（相等） 2（后者大） 3（无法比较）
    if(cardsType1.typeIdx == 0 || cardsType2.typeIdx == 0)
        result = 3
    else if(cardsType1.typeIdx == cardsType2.typeIdx)
    {
        var t = cardsType1.typeScores - cardsType2.typeScores
        if( t>0 )
            result = 0
        else if( t==0 )
            result = 1
        else if( t<0 )
            result = 2
    }
    else
    {
        if(cardsType1.typeLevel == cardsType2.typeLevel)
             result = 3
        else
        {
            var t = cardsType1.typeLevel - cardsType2.typeLevel
            if( t>0 )
                result = 0
            else if( t<0 )
                result = 2
        }           
    }

    return result
}

/////////////////////// 解析牌型  需要cardDatas才能唯一解析 end ///////////////////////


/////////////////////// 获取提示 需要cardDatas + cardDatasOfLaiziTable start ///////////////////////
//返回的是一个牌型由小到大的数组
gameLogic.getTipsArray = function(c_cardsType, sortedCardDatas, cardDatasOfLaiziTable)
{

    var cardsType = clone(c_cardsType)

    if( typeof(cardsType)=='number' )
    {
        var originLevel = cardsType-1
        cardsType = {typeLevel:cardsType, typeScores:0, typeKind:0}
    }
    else
        var originLevel = cardsType.typeLevel

    var tipsArray = []

    var t = gameLogic.splitCardDatas(sortedCardDatas, cardDatasOfLaiziTable)
    
    for(var i=0;;i++)
    {
        cardsType = gameLogic._getBiggerType(originLevel, cardsType) 
        if(!cardsType)
            break
        var parser = gameLogic.cardsParser[cardsType.typeLevel][cardsType.typeKind]
        var cardDatas = parser.getCardDatasIfHas(t[0], t[1], cardsType.typeScores, cardsType.typeIdx)
        if(cardDatas)
        {
            var tips = []
            for(var ii=0;ii<cardDatas.length;ii++)
            {          
                var cardData = cardDatas[ii]     
                if(cardData>=MAX_CARDDATA)
                    tips[ii] = gameLogic.getCardDataOfLaizi(cardData)
                else
                    tips[ii] = cardData
            }
            tipsArray[tipsArray.length] = cardLogic.sortWithNum(tips)   
        }
    }

    console.log('tipsArray:', tipsArray, sortedCardDatas)
    return tipsArray
}

////////
gameLogic._getBiggerType = function(originLevel, uc_cardsType) 
{
    var differLevel = uc_cardsType.typeLevel - originLevel

    if(differLevel<0)
        return false

    var parsers = gameLogic.cardsParser[uc_cardsType.typeLevel]
    if(!parsers)
        return false

    var parser = parsers[uc_cardsType.typeKind]
  
    if(differLevel==0)
        var typeIdx = uc_cardsType.typeIdx
    else
        var typeIdx = parser.typeIdx + parser.minLen
    biggerCardsType = parser.getType(uc_cardsType.typeScores + 1, typeIdx)
    
    
    if(biggerCardsType)
        return biggerCardsType
    else
    {
        if(originLevel==uc_cardsType.typeLevel)
        {
            uc_cardsType.typeLevel = uc_cardsType.typeLevel + 1
            uc_cardsType.typeScores = 0
            uc_cardsType.typeKind = 0
            return gameLogic._getBiggerType(originLevel, uc_cardsType)
        }
        else
        {
            if(parsers[uc_cardsType.typeKind+1])
                uc_cardsType.typeKind = uc_cardsType.typeKind + 1
            else
            {
                uc_cardsType.typeLevel = uc_cardsType.typeLevel + 1
                uc_cardsType.typeKind = 0
            }

            uc_cardsType.typeScores = 0
            return gameLogic._getBiggerType(originLevel, uc_cardsType)
        }
    }
}


/////////////////////// 排序扑克 用于显示（手牌) start ///////////////////////
gameLogic.sortCardDatasWithScore = function(cardDatas, cardDatasOfBigCardTable) 
{
    cardDatas.sort(function(a,b)
    {   
        return gameLogic._getScoreOfCardData(a, cardDatasOfBigCardTable) - gameLogic._getScoreOfCardData(b, cardDatasOfBigCardTable)
    })

    return cardDatas
}

gameLogic._getScoreOfCardData = function(cardData, cardDatasOfLaiziTable) 
{
    var cardNum = cardLogic.getNum(cardData) 
    var scores = gameLogic.num2Scores[cardNum]

    scores = scores * 4 + Math.floor(cardData/16)%4

    for(var i=0;i<cardDatasOfLaiziTable.length;i++)
    {
        if(cardDatasOfLaiziTable[i] == cardData)
        {
            scores = scores + 100
            break
        }
    }
    return scores
}
/////////////////////// 排序扑克 用于显示（手牌) end ///////////////////////


/////////////////
gameLogic.num2Scores  = 
[
    0,
    12,
    13,
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
    14,
    15
]

gameLogic.scores2Num = function(score)
{
    for(var num=0;num<16;num++)
    {
        if ( gameLogic.num2Scores[num] == score)
            return num
    }
}


///////////function for parser start//////////
//223344 len=3
gameLogic.getContinueCardNums = function(minCardNum, len, sameNum)
{
    var cardNums = []

    // var maxCardNum = minCardNum + len - 1
    // if(maxCardNum == 15)
    // {
    //     return cardNums;
    // }

    if(sameNum == 1)
    {
        for(var j=0;j<len;j++)
        {   
            cardNums[j] = minCardNum + j
            if(cardNums[j] == 14)
                cardNums[j] = 1
        }
        return cardNums
    }
    else
    {
        var cardNumst = gameLogic.getContinueCardNums(minCardNum, len, 1)
        for(var i=0;i<cardNumst.length;i++)
        {
            for(var j=0;j<len*sameNum;j++)
                cardNums[j] = cardNumst[Math.floor(j/sameNum)]
        }

    }
    return cardNums
}

gameLogic.isHas = function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)
{
    var getArrIdxsIncludeSomeCardNums = function(uc_sortedCardDatas, someCardNums_sorted) 
    {
        var arrIdxsOfSortedCardDatas = []
        var currentIdxOfSortedCardDatas = -1
        for(var i=0;i<someCardNums_sorted.length;i++)
        {
            arrIdxsOfSortedCardDatas[i] = -1
            for(var j=0;j<uc_sortedCardDatas.length;j++)
            {
               if( cardLogic.getNum(someCardNums_sorted[i]) == cardLogic.getNum(uc_sortedCardDatas[j]) ) 
               {
                    currentIdxOfSortedCardDatas = currentIdxOfSortedCardDatas + j + 1 
                    arrIdxsOfSortedCardDatas[i] = currentIdxOfSortedCardDatas
                    uc_sortedCardDatas = uc_sortedCardDatas.slice(j+1, uc_sortedCardDatas.length)
                    break
               }
            }
        }

        return arrIdxsOfSortedCardDatas 
    }

    var isHasAnyOne = function(arrIdxsOfSortedCardDatas) 
    {
        var hasAnyOne = false
        for(var i=0;i<arrIdxsOfSortedCardDatas.length;i++)
        {
            if(arrIdxsOfSortedCardDatas[i]!=-1)
                hasAnyOne = true
        }

        return hasAnyOne
    }

    var arrIdxsOfSortedCardDatas = getArrIdxsIncludeSomeCardNums(clone(c_sortedCardDatasExcludeLazi), someCardNums_sorted) 
    if( !isHasAnyOne(arrIdxsOfSortedCardDatas) )
    {
        var arrIdxsOfSortedCardDatas2 = getArrIdxsIncludeSomeCardNums(clone(c_sortedCardDatasOfLaizi), someCardNums_sorted) 
        if(!isHasAnyOne(arrIdxsOfSortedCardDatas2)  || c_sortedCardDatasOfLaizi.length < someCardNums_sorted.length)
            return [false]
        else
        {
            arrIdxsOfSortedCardDatas = []
            for(var i=0;i<someCardNums_sorted.length;i++)
                arrIdxsOfSortedCardDatas[i] = -1
        }
    }

    var cardDatas = []
    var sortedCardDatasOfLaizi = ( clone(c_sortedCardDatasOfLaizi) ).reverse()
    var sortedCardDatasExcludeLazi =  clone(c_sortedCardDatasExcludeLazi) 
    for(var i=arrIdxsOfSortedCardDatas.length-1;i>=0;i--)
    {
        var arrIdx = arrIdxsOfSortedCardDatas[i]
        if(arrIdx == -1)
        {
            if(sortedCardDatasOfLaizi.length>0)
            {
                cardDatas[i] = gameLogic.getLaiziCardData(someCardNums_sorted[i], sortedCardDatasOfLaizi[0]) 
                sortedCardDatasOfLaizi.splice(0,1)
            }
            else
                return [false]
        }
        else
        {
            cardDatas[i] = sortedCardDatasExcludeLazi[arrIdx]
            sortedCardDatasExcludeLazi.splice(arrIdx,1) // i 正比于 arrIdx
        }
    }

    var remained = [ sortedCardDatasExcludeLazi, sortedCardDatasOfLaizi ]

    return [cardDatas,remained]
}
///////////function for parser end//////////


/////////////////////parserConf start//////
gameLogic.cardsParser= []
gameLogic.cardsParser[0] = []
gameLogic.cardsParser[0][0] =   
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    //所有牌型score都从1开始累加1
    getType:function(typeScores)
    {
        return false
    },
    parser:function(uc_sortedCardDatas)
    {
        return {cardDatas:uc_sortedCardDatas, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:0,typeKind:this.typeKind}
    },
    //调用前要做安全判断（getType）
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores)
    {
        return false
    }
}

gameLogic.initCardsParser = function(conf)
{   
    var typeIdx = 0
    for(var i=0;i<conf.length;i++)
    {
        var typeLevel = i + 1
        gameLogic.cardsParser[typeLevel] = []
        var c = conf[i]
        for(var typeKind=0;typeKind<c.length;typeKind++)
        {
            var item = conf[i][typeKind]
            var p = clone( cardsParserConf[item.id] ) || {} //自定义
            p.typeLevel = typeLevel
            p.typeKind = typeKind
            typeIdx = typeIdx + 100//要求一个牌型最多只有100种类别 比如顺子 3-13张为11种不同类别顺子
            p.typeIdx = typeIdx
            for(var j in item)
            {
                p[j] = item[j]
            }
            gameLogic.cardsParser[typeLevel][typeKind] = p
        }
    }
}

var cardsParserConf = []

cardsParserConf[1] = 
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:1,
    name:'yizhang',//单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    minLen:5,
    maxLen:12,
    minCardNum:3,
    maxCardNum:14,//顺子时 A的cardNum作为14
    getType:function(typeScores, typeIdx)
    {
        var len = typeIdx - this.typeIdx
        if(len > this.maxLen || len < this.minLen)
            return false
        if(len==1) 
        {
            var cardNum = gameLogic.scores2Num(typeScores)
            if(cardNum && cardNum>=this.minCardNum && cardNum<=this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        else 
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            if(minCardNum >= this.minCardNum && maxCardNum <= this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        return false
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        var len = l
        var typeIdx = len + this.typeIdx

        for(var typeScores=15;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores, typeIdx))
                continue

            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
            if( cardDatas && cardDatas.length == l )
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
    {       
        var len = typeIdx - this.typeIdx

        if(len==1)
        {
            var num = gameLogic.scores2Num(typeScores)
            var someCardNums_sorted = [num]
        }
        else
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var someCardNums_sorted = cardLogic.sortWithNum( gameLogic.getContinueCardNums(minCardNum, len, 1) )
        }
        
        var cardDatas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)[0]
        
        if(!cardDatas)
            return false

        if(cardLogic.getNum(cardDatas[cardDatas.length-1]) == 13 && 
            cardLogic.getNum(cardDatas[0]) == 1)
        {

            var s = cardDatas.splice(0, 1)
            cardDatas = cardDatas.concat(s)
        }

        cardDatas.reverse()
        return cardDatas
    }
}

cardsParserConf[2] = 
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:2,
    name:'liangzhang',//单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    minLen:2,
    maxLen:12,
    minCardNum:3,
    maxCardNum:14,//顺子时 A的cardNum作为14
    getType:function(typeScores, typeIdx)
    {
        var len = typeIdx - this.typeIdx
        if(len > this.maxLen || len < this.minLen)
            return false
        if(len==1) 
        {
            var cardNum = gameLogic.scores2Num(typeScores)
            if(cardNum && cardNum>=this.minCardNum && cardNum<=this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        else 
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            if(minCardNum >= this.minCardNum && maxCardNum <= this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        return false
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {   
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        if(l%2!=0)
            return false

        var len = l/2
        var typeIdx = len + this.typeIdx

        for(var typeScores=15;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores, typeIdx))
                continue

            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
            if( cardDatas && cardDatas.length == l )
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
    {
        var len = typeIdx - this.typeIdx
        if(len==1)
        {
            var num = gameLogic.scores2Num(typeScores)
            var someCardNums_sorted = [num, num]
        }
        else
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var someCardNums_sorted = cardLogic.sortWithNum( gameLogic.getContinueCardNums(minCardNum, len, 2) )
        }
        
        var cardDatas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)[0]
        
        if(!cardDatas)
            return false

        if(cardLogic.getNum(cardDatas[cardDatas.length-1]) == 13 && 
            cardLogic.getNum(cardDatas[0]) == 1)
        {
            var s = cardDatas.splice(0, 2)
            cardDatas = cardDatas.concat(s)
        }

        cardDatas.reverse()
        return cardDatas
    }
}

cardsParserConf[3] = 
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:3,
    name:'sanzhang', //单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    minLen:2,
    maxLen:12,
    minCardNum:3,
    maxCardNum:14,//顺子时 A的cardNum作为14
    type:0, //0:不带  1:带1  2:带2(必须一对) 3:带2(不需要一对) 
    getType:function(typeScores, typeIdx)
    {
        var len = typeIdx - this.typeIdx
        if(len > this.maxLen || len < this.minLen)
            return false
        if(len==1)
        {
            var cardNum = gameLogic.scores2Num(typeScores)
            if(cardNum && cardNum>=this.minCardNum && cardNum<=this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        else 
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            if(minCardNum >= this.minCardNum && maxCardNum <= this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        return false
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        var n 
        switch(this.type)
        {
            case 0:
            {
                n = 3
                break
            }
            case 1:
            {
                n = 4
                break
            }
            case 2:
            {
                n = 5
                break
            }
            case 3:
            {
                n = 5
                break
            }
        }

        if(l%n!=0)
            return false

        var len = l/n
        var typeIdx = len + this.typeIdx

        for(var typeScores=15;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores, typeIdx))
                continue
            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
            if( cardDatas && cardDatas.length == l )
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
    {           
        var len = typeIdx - this.typeIdx
        if(len==1)
        {   
            var num = gameLogic.scores2Num(typeScores)
            var minCardNum = num
            var maxCardNum = num
            var someCardNums_sorted = [num, num, num]
        }
        else
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            var someCardNums_sorted = cardLogic.sortWithNum( gameLogic.getContinueCardNums(minCardNum, len, 3) )
        }
        
        var isHas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)
        var san = isHas[0]
        if(!san)
            return false

        if(cardLogic.getNum(san[san.length-1]) == 13 && 
            cardLogic.getNum(san[0]) == 1)
        {
            var s = san.splice(0, 3)
            san = san.concat(s)
        }
        san.reverse()

        if(this.type == 0)
            return san

        var remained = isHas[1]
        var sortedCardDatasExcludeLazi_remain = remained[0]
        var sortedCardDatasOfLaizi_remain = remained[1]

        var yi = []

        switch(this.type)
        {
            case 1:
            {
                var t = []
                for(var typeScores=15;typeScores>0;typeScores--)
                {
                    for(;;)
                    {
                        var num = gameLogic.scores2Num(typeScores)
                        var someCardNums_sorted = [num]

                        var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                        var cardDatas = isHas[0]
                        var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>(maxCardNum==14?13:maxCardNum) )
                        bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
                        if( bool )
                        {
                            yi[yi.length] = cardDatas
                            sortedCardDatasExcludeLazi_remain = isHas[1][0]
                            sortedCardDatasOfLaizi_remain = isHas[1][1]
                        }
                        else
                            break
                    }
                }
                // for(var typeScores=15;typeScores>0;typeScores--)
                // {
                //     var num = gameLogic.scores2Num(typeScores)
                //     var someCardNums_sorted = [num]
                //     var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                //     var cardDatas = isHas[0]

                //     var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
                //     bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
                //     if( bool )
                //     {
                //         yi[yi.length] = cardDatas
                //         sortedCardDatasExcludeLazi_remain = isHas[1][0]
                //         sortedCardDatasOfLaizi_remain = isHas[1][1]
                //     }
                // }
                yi.reverse()
                break
            }
            case 2:
            {
                for(var typeScores=1;typeScores<14;typeScores++)
                {
                    var num = gameLogic.scores2Num(typeScores)
                    var someCardNums_sorted = [num, num]
                    var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                    var cardDatas = isHas[0]
                    var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>(maxCardNum==14?13:maxCardNum) )
                    bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
                    if( bool )
                    {
                        yi[yi.length] = cardDatas
                        sortedCardDatasExcludeLazi_remain = isHas[1][0]
                        sortedCardDatasOfLaizi_remain = isHas[1][1]
                    }
                }
                break
            }
            case 3:
            {
                var t = []
                for(var typeScores=15;typeScores>0;typeScores--)
                {
                    for(;;)
                    {
                        var num = gameLogic.scores2Num(typeScores)
                        var someCardNums_sorted = [num]
                        var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                        var cardDatas = isHas[0]
                        var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>(maxCardNum==14?13:maxCardNum) )
                        bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
                        if( bool )
                        {
                            t[t.length] = cardDatas
                            sortedCardDatasExcludeLazi_remain = isHas[1][0]
                            sortedCardDatasOfLaizi_remain = isHas[1][1]
                        }
                        else
                            break
                    }
                }
                var item = []
                for(var i=t.length-1;i>=0;i--)
                {
                    item[item.length] = t[i][0]
                    if(item.length == 2)
                    {
                        yi[yi.length] = item
                        item = []
                    }
                }
                break
            }
        }

        if(yi.length<len)
            return false

        var y = []
        for(var i=0;i<len;i++)
        {
            y = y.concat(yi[i])
        }
        y.reverse()
        var cardDatas = san.concat(y)
        return cardDatas
    }
}

cardsParserConf[4] = 
{   
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:4,
    name:'zhadan',
    length:4, 
    type:0,//0带不带癞子都算 1不能带癞子（硬炸） 2必须带癞子（软炸） 3全都是癞子
    getType:function(typeScores)
    {
        if(typeScores>13 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        var is = true
        is = l == this.length
        if(!is)
            return false
        for(var typeScores=13;typeScores>=1;typeScores--)
        {
            if(!this.getType(typeScores))
                continue
            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores)
            if(cardDatas)
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    },  
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores)
    {
        for(var num=0;num<16;num++)
        {
            if ( gameLogic.num2Scores[num] == typeScores)
                break
        }

        var someCardNums_sorted = []
        for(var i=0;i<this.length;i++)
        {   
            someCardNums_sorted[i] = num
        }
        var isHas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)
        var cardDatas = isHas[0]
       
        if(!cardDatas)
            return false

        var remained = isHas[1]
        var sortedCardDatasExcludeLazi_remain = remained[0]
        var sortedCardDatasOfLaizi_remain = remained[1]  

        var usedLaziNum = c_sortedCardDatasOfLaizi.length-sortedCardDatasOfLaizi_remain.length
        // var isYinzha = usedLaziNum == 0
        // var isAllLaizi = usedLaziNum == this.length
        
        if(this.type==1)
        {
            if(usedLaziNum>0) return false
        }
        else if(this.type==2)
        {
            if(usedLaziNum==0) return false
        }
        else if(this.type==3)
        {
            if(usedLaziNum!=this.length) return false
        }
        cardDatas.reverse()
        return cardDatas
    }
}

cardsParserConf[5] = 
{   
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:5,
    name:'wangzha',
    type:0,//0王炸(2) 1天王炸(4张)
    typeIdx:0,
    getType:function(typeScores)
    {
        if(typeScores>1 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        var is = true
        var length
        switch(this.type)
        {
            case 0:
            {
                length = 2
                break
            }
            case 1:
            {
                length = 4
                break
            }
        }
        is = l == length
        if(!is)
            return false

        var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
        if(cardDatas)
            return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:1,typeKind:this.typeKind} 
        
        return false
    },  
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var t = c_sortedCardDatasExcludeLazi.concat(c_sortedCardDatasOfLaizi)
        var _78Num = 0
        var _79Num = 0
        for(var i=0;i<t.length;i++)
        {
            if(t[i] == 78)
                _78Num = _78Num + 1

            if(t[i] == 79)
                _79Num = _79Num + 1
        }

        switch(this.type)
        {
            case 0:
            {
                if(_78Num>0 && _79Num>0 )
                    return [79, 78]
                break
            }
            case 1:
            {
                if(_78Num>1 && _79Num>1 )
                    return [79, 79, 78, 78]
                break
            }
        }
        return false
    }
}
////////////parserConf end//////



