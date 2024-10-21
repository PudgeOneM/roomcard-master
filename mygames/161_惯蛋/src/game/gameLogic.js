


gameLogic.getTipsArrayForFirstOut = function(cardDatas)
{
    var cardsType = {typeLevel:1, typeScores:2, typeKind:0}
    var tipsArray =  gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(cardDatas), cmdBaseWorker.cbMagicCardData)

    return tipsArray
}
// Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
gameLogic.SortCardList = function(cbSortType)
{
    gameLog.log('排列扑克~~~~~~~~~~~~~~~~~')
    var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
    var cbCardCount = cmdBaseWorker.cbHandCardCount[selfChairId]
    //cmdBaseWorker.cbHandCardData[selfChairId]
    if ( cbCardCount == 0 ) 
        return;
    if ( cbSortType == ST_CUSTOM ) 
        return;
    var cbSortValue = []
    for( var i = 0 ;i < cbCardCount;i++ )
    {
        switch( cbSortType )
        {
            case ST_COUNT:     //数目排序
            {
               
                break;
            }
            case ST_ORDER:     //等级排序
            {
               
                break;
            }
            case ST_VALUE:     //数值排序
            {
               
                break;
            }
            case ST_COLOR:     //花色排序
            {
               cbSortValue[i] = gameLogic.getCardColor(cmdBaseWorker.cbHandCardData[selfChairId][i]) + gameLogic.getCardLogicValue(cmdBaseWorker.cbHandCardData[selfChairId][i],true)
                break;
            }
        }
    }

    var bSorted = true
    var cbSwitchData=0,cbLast=cbCardCount-1;
    do
    {
        bSorted = true
        for( var i = 0;i<cbLast;i++ )
        {
            if ((cbSortValue[i]<cbSortValue[i+1])||
                ((cbSortValue[i]==cbSortValue[i+1])&&(cbCardData[i]<cbCardData[i+1])))
            {
                //设置标志
                bSorted=false;

                //扑克数据
                cbSwitchData=cbCardData[i];
                cbCardData[i]=cbCardData[i+1];
                cbCardData[i+1]=cbSwitchData;

                //排序权位
                cbSwitchData=cbSortValue[i];
                cbSortValue[i]=cbSortValue[i+1];
                cbSortValue[i+1]=cbSwitchData;
            }   //if
        }//for
        cbLast--;
    }while(bSorted==false)

    
}
//获取牌值
gameLogic.getCardsRealValue = function( cbCardData )
{
    var cbCardCount = cbCardData.length;
    var cardValue ;
    
    for (var i=0;i<cbCardCount;i++)
    {
        if(cbCardData[i] != cmdBaseWorker.cbMagicCardData[0] && cbCardData[i] <= 0x4F)
        {
            cardValue = cbCardData[i]
            break
        }
    }
    return cardValue;
}
//获取牌数
gameLogic.getTypeRealNum = function( cbCardData )
{
    var cbCardCount = cbCardData.length;
    var cardNum = 0;
    for (var i=0;i<cbCardCount;i++)
    {
        if(cbCardData[i] != cmdBaseWorker.cbMagicCardData[0] && cbCardData[i] <= 0x4F)
        {
            
            cardNum++;
        }
    }
    return cardNum;
}
//获取全部非癞子牌数
gameLogic.getCardsRealNum = function( cbCardData , card )
{
    var cbCardCount = cbCardData.length;
    var cardNum = 0;
    for (var i=0;i<cbCardCount;i++)
    {
        if( gameLogic.getCardValue(cbCardData[i]) == gameLogic.getCardValue(card) && cbCardData[i] != cmdBaseWorker.cbMagicCardData[0])
        {
            
            cardNum++;
        }
    }
    return cardNum;
}
//获取花色
gameLogic.getCardColor = function( cardData )
{
    return cardData&MASK_COLOR;
}
//获取花色
gameLogic.getCardsColor=function( cbCardData )
{
    
    var cbCardCount = cbCardData.length;
    if( cbCardCount <= 0 || cbCardCount > 5 )
        return 0xF0

    //首牌花色
    var cbCardColor   //=Math.floor( cbCardData[0] / 16.0 )
    for (var i=0;i<cbCardCount;i++)
    {
        if(cbCardData[i] != cmdBaseWorker.cbMagicCardData[0] && cbCardData[i] < 0x4E)
        {
            cbCardColor=Math.floor( cbCardData[i] / 16.0 )
        }
    }
    //花色判断
    for (var i=0;i<cbCardCount;i++)
    {
        if (Math.floor( cbCardData[i] / 16.0 )!=cbCardColor && cbCardData[i] != cmdBaseWorker.cbMagicCardData[0] && cbCardData[i] < 0x4E ) 
            return 0xF0;
    }

    return cbCardColor;
}

gameLogic.getCardValue = function( cardData )
{
    if (cardData == INVALID_BYTE) 
    return 0;
    return cardData&MASK_VALUE
}
gameLogic.getCardLogicValue = function( cardData,laiZiPos)
{
    var cbCardValue = gameLogic.getCardValue( cardData )
    var cbCardColor = gameLogic.getCardColor( cardData )
    if ( cbCardValue == cmdBaseWorker.mainValue && cbCardColor == 0x20 ) 
    {
        return laiZiPos ? 16:0 
    };
    if ( cbCardValue == cmdBaseWorker.mainValue )
        return 15;
    switch( cbCardValue )
    {
        case 0x01:     
        {
               
            return 14;
        }
        case 0x0E:     
        {
               
            return 17;
        }
        case 0x0F:     
        {
               
            return 18;
        }
            
    }
    return cbCardValue
}
gameLogic.getTHuaShunArray = function( _sortedCardDatas, cardDatasOfLaiziTable)
{
    var magicNum = gameLogic.getMagicNum( _sortedCardDatas )
    var tipsArray = []
    var colorArray = [0x00,0x10,0x20,0x30]
    for( var color = 0 ;color<4;color++ )
    {
        var sortedCardDatas = gameLogic.getThuaArray(_sortedCardDatas,colorArray[color])
        var colorData = gameLogic.splitCardDatas(sortedCardDatas, cardDatasOfLaiziTable)
        var colorIndex = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        var colorIndex2Data = []
        colorIndex2Data[100] = cmdBaseWorker.cbMagicCardData[0]
        for( var i = 0 ;i<colorData[0].length;i++ )
        {
            var index = gameLogic.getCardValue(colorData[0][i]) 
            index = index == 1? 14:index
            colorIndex[index]++
            colorIndex2Data[index] = colorData[0][i]
        }//i

        //连牌
        for( var i = 0;i< 13;i++ )
        {
            if ( magicNum + colorIndex[i] + colorIndex[i+1] + colorIndex[i+2] + colorIndex[i+3] + colorIndex[i+4] >= 5 ) 
            {
                var cbIndex = [colorIndex[i] , colorIndex[i+1] ,colorIndex[i+2], colorIndex[i+3] ,colorIndex[i+4]];
                var magicNumTemp = clone(magicNum)
                var cbValidINdex = [];
                while(( magicNumTemp +  cbIndex[0] + cbIndex[1] + cbIndex[2] + cbIndex[3] + cbIndex[4] ) >= 4)
                {
                    var maxIdx = gameLogic.getArrayNum( cbIndex )
                    for( var j = 0 ; j < 5;j++ )
                    {
                        if ( cbIndex[j] > 0 ) 
                        {
                            cbIndex[j]--;
                            cbValidINdex[j] = i+j
                        }else
                        {
                            magicNumTemp--;
                            cbValidINdex[j] = 100;
                        }
                    }
                    if ( magicNumTemp >= 0   ) 
                    {
                        var sData = []
                        for( var j = 0;j<5;j++ )
                        {
                            sData[j] = colorIndex2Data[cbValidINdex[j]]
                        }
                        //给同花顺排序
                        var sortedCards = []
                        sortedCards = cardLogic.sortWithNum(sData)
                        //sortedCards.reverse()
                        //
                        tipsArray[tipsArray.length] = clone(sortedCards)
                    }else
                    {
                        break;
                    }

                }
            };
        }

    }
    return tipsArray
}
gameLogic.getArrayNum = function(_cardDatas)
{
    var num = 0;
    for( var i = 0;i < _cardDatas.length;i++ )
    {
        if ( _cardDatas[i] > 0 )
        {
            num++;
        };
    }
    return num;
}
gameLogic.getThuaArray = function( _cardDatas,type )
{
    var cardData = []
    for( var i = 0 ;i<_cardDatas.length;i++ )
    {
        if ( gameLogic.getCardColor(_cardDatas[i]) == type && _cardDatas[i] != cmdBaseWorker.cbMagicCardData[0] ) 
        {
            cardData[cardData.length] = _cardDatas[i];
        };
    }
    return cardData
}
gameLogic.getMagicNum = function(_cardDatas)
{
    var num = 0
    for( var i = 0 ;i<_cardDatas.length;i++ )
    {
        if( _cardDatas[i] == cmdBaseWorker.cbMagicCardData[0])
        {
            num++;
        }

    }
    return num;
}

gameLogic.sorSanDaiEr = function( cardsData )
{
    var iType = gameLogic.getCardsType(cardsData)
    if (iType.name = 'sandaiyidui') 
    {
        var cNum = 1
        var sValue = gameLogic.getCardValue( cardsData[0] )
        for( var i = 1 ;i <cardsData.length;i++ )
        {
            var cardValue = gameLogic.getCardValue( cardsData[i] )
            if (cardValue == sValue) 
            {
                cNum ++;
            };
        }
        if ( cNum == 3) 
        {
            cardsData.reverse();
        };
    };


}

gameLogic.getMaxTipsArray = function( tipsArray,index )
{
    if (tipsArray.length == 0) {return;};
    for( var i = 0 ;i < tipsArray[index].length;i++ )
    {
        var indexType = gameLogic.getCardsType(tipsArray[i])
        var iType = gameLogic.getCardsType(tipsArray[index])
        var c = gameLogic.compareTwoCardsType(indexType, iType) 
        isBigger = c == 0
        if ( isBigger || (indexType.name == 'feiji' && iType.name == 'sandaiyidui' )) 
        {
            index = i
        };
    }
    gameLogic.sorSanDaiEr(tipsArray[index])
    return index
}

gameLogic.sortCardsByType = function( originalCards,sortedCards )
{
    if ( originalCards.length == 0 ) 
    {
        return;
    };
    var _orgCards = []
    var tipsArray = gameLogic.getTipsArray(1, originalCards, cmdBaseWorker.cbMagicCardData)
    var index =  gameLogic.getMaxTipsArray(tipsArray , tipsArray.length - 1 )// tipsArray.length - 1
    
   // for( var i = 0 ;i < tipsArray[index].length;i++ )
    for( var i = tipsArray[index].length - 1;i>=0; i-- )
    {
        sortedCards[sortedCards.length] = tipsArray[index][i];
    }

    for( var i = 0 ; i < originalCards.length ; i ++ )
    {
        for( var j = 0 ; j < tipsArray[index].length ; j++ )
        {
            if ( originalCards[i] == tipsArray[index][j] && originalCards[i] !=  INVALID_BYTE ) 
            {
                originalCards[i] = INVALID_BYTE
                tipsArray[index][j] = INVALID_BYTE
            };
        }
    }

    for( var i = 0 ; i < originalCards.length ; i ++ )
    {
        if ( originalCards[i] != INVALID_BYTE ) 
        {
            _orgCards[_orgCards.length] = originalCards[i];
        };
    }
    if( _orgCards.length > 0 )
        gameLogic.sortCardsByType( _orgCards,sortedCards )



}

gameLogic.setCardsScore = function()
{
    var roundTable = [2,3,4,5,6,7,8,9,10,11,12,13,1];
        
    var mainCard = 2
    if( cmdBaseWorker.cbCurTeam != INVALID_BYTE )
    mainCard = roundTable[cmdBaseWorker.cbTeamProcess[cmdBaseWorker.cbCurTeam]]

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
        
    var index = 1;
    for( var i = 1;i <= 13;i++ ) //2-K 
    {
        if ( i == mainCard ) 
        {
            gameLogic.num2Scores[mainCard] = 13
        }
        else if(i != mainCard && i==1 )
        {
            gameLogic.num2Scores[i] = 12
        }
        else 
        {
            gameLogic.num2Scores[i] = index
            index++
        }
    }
}
// End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

//顺子
var cardType = 
{
    id:101,
    name:'shunzi',
    minLen:5,
    maxLen:5,
    minCardNum:1,
    maxCardNum:14,//顺子时 A的cardNum作为14
    colorType:0,//0普通顺子 1同花顺
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

            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx, false)
            if(!cardDatas && c_sortedCardDatasExcludeLazi[4] && c_sortedCardDatasExcludeLazi[4] == 1)
                cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx, true)
            if( cardDatas && cardDatas.length == l )
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx,isRevers)
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
        if (isRevers)
        {   
            for(var i=0;i<4;i++)
            {
                someCardNums_sorted[i] =someCardNums_sorted[i+1]
            }
            someCardNums_sorted[4] = 1
        }
        var cardDatas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)[0]
        
        if(!cardDatas)
            return false

        switch(this.colorType)
        {
            case 0:     //普通顺子
            {
                if( this.getCardColor(c_sortedCardDatasExcludeLazi) != 0xF0 )
                    return false;
                break;
            }
            case 1:     //同花顺
            {
                if( this.getCardColor(c_sortedCardDatasExcludeLazi) == 0xF0 )
                    return false;
                break;
            }
        }
       
        if(cardLogic.getNum(cardDatas[cardDatas.length-1]) == 13 && 
            cardLogic.getNum(cardDatas[0]) == 1)
        {

            var s = cardDatas.splice(0, 1)
            cardDatas = cardDatas.concat(s)
        }
        
        cardDatas.reverse()
        


        var isSanWang = false;
        for(var i=0;i<5;i++ )
        {
            if ( cardDatas[i] == 0x4E || cardDatas[i] == 0x4F ) 
            {
                isSanWang = true;
                break;
            };
        }
        if (isSanWang) 
            return;

        return cardDatas
    }
    ,
    //获取花色
    getCardColor:function( cbCardData )
    {
    
        var cbCardCount = cbCardData.length;
        if( cbCardCount <= 0 || cbCardCount > 5 )
            return 0xF0

        //首牌花色
        var cbCardColor=Math.floor( cbCardData[0] / 16.0 )

        //花色判断
        for (var i=0;i<cbCardCount;i++)
        {
            if (Math.floor( cbCardData[i] / 16.0 )!=cbCardColor) 
                return 0xF0;
        }

        return cbCardColor;
    }
}

//三代一对
var sanDaiEr = 
{
    id:201,
    name:'sandaiyidui',
    minLen:1,
    maxLen:1,
    minCardNum:1,
    maxCardNum:15,//顺子时 A的cardNum作为14
    type:2,//0带2单 1带2对
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
        /**/
        gameLogic.setCardsScore();
        /**/
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

        if(this.type == 0){

            var isSanWang = false;
            for(var i=0;i<3;i++ )
            { 
                if ( san[i] == 0x4E || san[i] == 0x4F ) 
                {
                    isSanWang = true;
                    break;
                };
            }
            if (isSanWang) 
                return
            return san
        }

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
              
                yi.reverse()
                break
            }
            case 2:
            {
                for(var typeScores=1;typeScores<16;typeScores++)
                {
                    var num = gameLogic.scores2Num(typeScores)
                    var someCardNums_sorted = [num, num]
                    var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                    var cardDatas = isHas[0]
                    var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
                    bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 16)
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
                        var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
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

        var isSanWang = false;
        for(var i=0;i<3;i++ )
        { 
            if ( san[i] == 0x4E || san[i] == 0x4F ) 
            {
                isSanWang = true;
                break;
            };
        }
        
        for( var i=0;i<2;i++ )
        {
            if( (y[i] == 0x4E || y[i] == 0x4F )  && y[0] != y[1] )
            {
                isSanWang = true;
                break;
            }
        }
        if (isSanWang) 
            return;

        return cardDatas
    }
}
gameLogic.scores2Num = function(score)
{
    for(var num=0;num<16;num++)
    {
        if ( gameLogic.num2Scores[num] == score)
            return num
    }
}

var ptShun = clone(cardType)
ptShun.colorType = 0
ptShun.name = 'shunzi'

var thShun = clone(cardType)
thShun.colorType = 1
thShun.name = 'tonghuashun'

var sanDaiEr = clone(sanDaiEr)
sanDaiEr.type = 2
sanDaiEr.name = 'sandaiyidui'

var sanGe = clone(sanDaiEr)
sanGe.type = 0
sanGe.name = 'sange'

gameLogic.initCardsParser(
[ 
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'danzhang'},
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'duizi'},
        //{id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:14, type:0, name:'sange'},
        //{id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, type:2, name:'sandaiyidui'},
        sanGe,
        sanDaiEr,
        ptShun,
        {id:2, minLen:3, maxLen:3, minCardNum:1, maxCardNum:14, name:'liandui'},
        {id:3, minCardNum:1,maxCardNum:14,type:0, minLen:2, maxLen:2, name:'feiji'},
    ], 
    [
        {id:4, length:4, type:0, name:'zhadan'},
    ], 
    [
        {id:4, length:5, type:0, name:'zhadan'},
    ], 
    [
        thShun,
       // {id:1,minCardNum:5,maxCardNum:5, name:'tonghuashun'},
    ],
    [
        {id:4, length:6, type:0, name:'zhadan'},
    ],
    [
        {id:4, length:7, type:0, name:'zhadan'},
    ], 
    [
        {id:4, length:8, type:0, name:'zhadan'},
    ],  
    [
        {id:5, type:1,name:'wangzha'},
    ], 
])







