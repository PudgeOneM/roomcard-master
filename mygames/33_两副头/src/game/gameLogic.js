


gameLogic.getTipsArrayForFirstOut = function(cardDatas)
{
    var cardsType = {typeLevel:0, typeScores:0, typeKind:0}
    var tipsArray =  gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(cardDatas), cmdBaseWorker.cbMagicCardData)

    return tipsArray
}

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
        // if(gameLogic.num2Scores[num] == score && score==15)
        // {
        //     return 14
        // }
        if ( gameLogic.num2Scores[num] == score)
            return num
    }
}

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
    
    if(differLevel==0&&originLevel==1&&uc_cardsType.typeScores==14)
        biggerCardsType=false
    
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


gameLogic.compareTwoCardsType = function(cardsType1, cardsType2) 
{
    var result //0（前者大） 1（相等） 2（后者大） 3（无法比较）
    if(cardsType1.typeIdx == 0 || cardsType2.typeIdx == 0)
        result = 3
    else if(cardsType1.typeIdx == cardsType2.typeIdx)
    {
        var t = cardsType1.typeScores - cardsType2.typeScores
        if((cardsType1.typeScores==14||cardsType1.typeScores==15)&&(cardsType2.typeScores==14||cardsType2.typeScores==15))
            t=0

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


//四代2
var cardType = 
{
    id:101,
    name:'sidaier',
    minLen:1,
    maxLen:1,
    minCardNum:1,
    maxCardNum:13,//顺子时 A的cardNum作为14
    type:0,//0带2单 1带2对
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
                n = 6
                break
            }
            case 1:
            {
                n = 8
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
            var someCardNums_sorted = [num, num, num, num]
        }
        else
        {   
            //不做连顺
            // var minCardNum = typeScores-1 + this.minCardNum
            // var maxCardNum = minCardNum + len - 1
            // var someCardNums_sorted = cardLogic.sortWithNum( cardLogic.getContinueCardNums(minCardNum, len, 3) )
        }
        var isHas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)
        var san = isHas[0]
        
        if(!san)
            return false

        //不做连顺
        // if(cardLogic.getNum(san[san.length-1]) == 13 && 
        //     cardLogic.getNum(san[0]) == 1)
        // {
        //     var s = san.splice(0, 3)
        //     san = san.concat(s)
        // }
        san = san.reverse()

        // if(this.type == 0)
        //     return san

        var remained = isHas[1]
        var sortedCardDatasExcludeLazi_remain = remained[0]
        var sortedCardDatasOfLaizi_remain = remained[1]

        var yi = []

        switch(this.type)
        {
            case 0:
            {
                for(var typeScores=15;typeScores>0;typeScores--)
                {
                    for(;;)
                    {
                        var num = gameLogic.scores2Num(typeScores)
                        var someCardNums_sorted = [num]
                        var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                        var cardDatas = isHas[0]
                        var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
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
                yi = yi.reverse()
                break
            }
            case 1:
            {
                for(var typeScores=1;typeScores<14;typeScores++)
                {
                    var num = gameLogic.scores2Num(typeScores)
                    var someCardNums_sorted = [num, num]
                    var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                    var cardDatas = isHas[0]
                    var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
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
        }

        if(yi.length<len*2)
            return false

        var y = []
        for(var i=0;i<len*2;i++)
        {
            y = y.concat(yi[i])
        }

        y = y.reverse()
        var cardDatas = san.concat(y)
        
        return cardDatas
    }
}
var zhadan = 
{   
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:4,
    name:'炸弹',
    length:4, 
    type:0,//0带不带癞子都算 1不能带癞子（硬炸） 2必须带癞子（软炸）
    getType:function(typeScores)
    {
        if(typeScores>13 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        var is = true
        is = l == this.length
        if(!is)
            return false
        for(var typeScores=13;typeScores>=1;typeScores--)
        {
            if(!this.getType(typeScores))
                continue
            var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores)
            if(idxs)
              return {id:this.id, idxs:idxs, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    },  
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores)
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
        var isHas = cardLogic.isHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, someCardNums_sorted)
        var idxs = isHas[0]
       
        if(!idxs)
            return false

        var remained = isHas[1]
        var sortedIdx54sExcludeLazi_remain = remained[0]
        var sortedIdx54sOfLaizi_remain = remained[1]  

        var usedLaziNum = c_sortedIdx54sOfLaizi.length-sortedIdx54sOfLaizi_remain.length
        var isYinzha = usedLaziNum == 0 || usedLaziNum == this.length

        if(this.type==1 && !isYinzha)
            return false

        if(this.type==2 && isYinzha)
            return false
        idxs = cardLogic.getReverseArray(idxs)
        return idxs
    }
}

var c1 = clone(cardType)
c1.name = 'sidaier'
var c2 = clone(cardType)
c2.id = 102
c2.type = 1
c2.name = 'sidailiangdui'

gameLogic.initCardsParser(
[ 
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'danzhang'},
        {id:1, name:'shunzi'},
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'duizi'},
        {id:2, minLen:3, name:'liandui'},
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, type:0, name:'sange'},
        // {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:0, name:'sanzhang'},
        // {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:2, name:'sandaiyidui'},
        // {id:3, type:0, name:'feiji'},
        // {id:3, type:1, name:'feiji'},
        // {id:3, type:2, name:'feiji'},
        // c1,
        // c2,
    ], 
    [
        {id:4,length:4, type:0, name:'zhadan'},
    ], 
    [
        {id:4,length:5,type:0,name:'zhadan'},
    ],
    [
        {id:4,length:6,type:0,name:'zhadan'},
    ],
    [
        {id:4,length:7,type:0,name:'zhadan'},
    ],
    [
        {id:4,length:8,type:0,name:'zhadan'},
    ],
    [
        {id:4,length:9,type:0,name:'zhadan'},
    ],
    [
        {id:4,length:10,type:0,name:'zhadan'},
    ],
    [
        {id:4,length:11,type:0,name:'zhadan'},
    ],
    [
        {id:4,length:12,type:0,name:'zhadan'},
    ],
    [
        {id:5, type:1,name:'wangzha'},
    ], 
])



cardFactory.showChairId2Direction=function(showChairId)
    {
        if(GAME_PLAYER == 6)
            var map =[0,1,2,3,4,5]
        else if(GAME_PLAYER == 4)
            var map = [0, 1, 2, 3]
        else if(GAME_PLAYER == 3)
            var map = [0, 1, 3]

        return map[showChairId]
    },
cardFactory.direction2ShowChairIdn=function(direction)
    {
        if(GAME_PLAYER == 6)
            var map =[0,1,2,3,4,5]
        else if(GAME_PLAYER == 4)
            var map = [0, 1, 2, 3]
        else if(GAME_PLAYER == 3)
            var map = [0, 1, null, 2]

        return map[direction]
    },
cardFactory.deleteHandCards = function(handCards, direction, cardDatas)
{
        var cards = handCards
        // if(cards.length==0)
        //     return 
        var handGroupNode = cards[0].getParent()
        for(var i=0;i<cardDatas.length;i++)
        {
            var deleteIdx = null
            for(var ii=0;ii<cards.length;ii++)
            {
                if(cards[ii].cardData == cardDatas[i])  
                {
                    deleteIdx = ii
                    break
                }
            }
            if(deleteIdx == null)
                return
            cards[deleteIdx].removeFromParent()
            cards.splice(deleteIdx, 1)
        }

        for(var i=0;i<cards.length;i++)
        {
            var card = cards[i]
            card.idxInHandCards = i
            var pos = cardFactory.getHandCardPosAndTag(cards.length, card.idxInHandCards, direction)
            card.x = pos.x
            card.y = pos.y
            card.setLocalZOrder(pos.zOrder)
            card.originY = pos.y
        }

        //////
        var size = cardFactory._getHandGroupNodeSize(cards.length, direction)
        handGroupNode.width = size.width
        handGroupNode.height = size.height

        ///////
        var length = cards.length
        var maxLine = Math.floor((cardFactory.maxHandCount-1)/cardFactory.handCountOneRowMax) 
        var handCountOneRow = 0
        if(length>(maxLine+1)*cardFactory.handCountOneRowMin)
            handCountOneRow = Math.ceil(length/(maxLine+1))
        else
            handCountOneRow = cardFactory.handCountOneRowMin

        var downHandIntervalX = (cardFactory.handGroupNodeWidth - cardFactory.down_handWidth*cardFactory.scale_hand)/(handCountOneRow-1)/cardFactory.scale_hand

        handGroupNode.handCountOneRow = handCountOneRow
        handGroupNode.downHandIntervalX = downHandIntervalX
}
