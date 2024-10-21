var gameLogic =
{
    GetCardLogicValue:function(bCardData)
    {
        var bCardValue = cardLogic.getNum(bCardData)
        return (bCardValue<=2)?(bCardValue+13):bCardValue
    },
    GetCardNumByLogicValue:function(logicValue)
    {
        return logicValue>13?logicValue-13:logicValue
    },
    SortCardList:function(cbCardList)
    {
        var self = this
        cbCardList.sort(function(a,b)
        {   
            if(self.GetCardLogicValue(b) == self.GetCardLogicValue(a))
                return b - a
            else
                return self.GetCardLogicValue(b) - self.GetCardLogicValue(a)
        })

        return cbCardList
    },
    GetCardCountByLogicValue:function(cardData, cards)
    {
        var count = 0
        var logicValue = this.GetCardLogicValue(cardData)
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( logicValue == this.GetCardLogicValue(cards[i]) )
                count++
        }
 
        return count
    },
    GetSameCardCount:function(cards, cardData)
    {
        var count = 0
        var logicValue = this.GetCardLogicValue(cardData)
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( this.GetCardLogicValue(cards[i]) == logicValue )
                count++
        }

        return count
    },
    //是否相邻
    IsLineCard:function(cbLogicValue1, cbLogicValue2)
    {
        return cbLogicValue1 < 15 && cbLogicValue2 < 15 && cbLogicValue1 - cbLogicValue2 == 1
    },
    //是否存在3A炸弹
    Has3ABomb:function (cbThreeCardData)
    {
        // for ( var i = 0; i < cbThreeCardData.length; i++ )
        // {
        //     if ( this.IsThreeBomb(cbThreeCardData[i][0]) )
        //         return true
        // }

        return false
    },
    //是否3张炸弹
    IsThreeBomb:function(cardData)
    {
        if ( this.GetCardLogicValue(cardData) == 14 )
            return true

        return false
    },
    //分析扑克
    AnalyzeCard:function(cbCardData)
    {
        var self = this
        var AnalyzeResult =
        {
            cbSingleCardData: [],
            cbDoubleCardData: [],
            cbThreeCardData: [],
            cbFourCardData: [],
            cbLineSingleCardData: [],
            cbLineDoubleCardData: [],
            cbLineThreeCardData: [],
        }

        //统计同值
        for (var i = 0; i < cbCardData.length; i++)
        {
            var cbSameCardData = []
            cbSameCardData.push(cbCardData[i])

            var cbLogicValue = this.GetCardLogicValue(cbCardData[i])
            for ( var n = i + 1; n < cbCardData.length; n++)
            {
                if (cbLogicValue != this.GetCardLogicValue(cbCardData[n]))
                    break

                if ( cbSameCardData.length < MAX_SAME )
                    cbSameCardData.push(cbCardData[n])
            }

            if ( cbSameCardData.length >= 4 ) //炸弹不拆
            {
                AnalyzeResult.cbFourCardData.push(cbSameCardData.slice(0, 4))
            }
            else
            {
                if ( cbSameCardData.length >= 1 )
                    AnalyzeResult.cbSingleCardData.push(cbSameCardData.slice(0, 1))
                if ( cbSameCardData.length >= 2)
                    AnalyzeResult.cbDoubleCardData.push(cbSameCardData.slice(0, 2))
                if ( cbSameCardData.length >= 3 )
                    AnalyzeResult.cbThreeCardData.push(cbSameCardData.slice(0, 3))
            }

            i += cbSameCardData.length - 1;
        }

        var AnalyzeLineWeave = function(weave, minLen) 
        {
            var lineWeave = []
            for (var i = 0; i < weave.length; i++) 
            {
                var cbWeaveCardData = weave[i]
                var cbLastLogicValue = self.GetCardLogicValue(weave[i][0]);
                var n = i + 1
                for ( ; n < weave.length; n++ ) 
                {
                    var cbLogicValue = self.GetCardLogicValue(weave[n][0]);
                    if (cbLogicValue == cbLastLogicValue) 
                        continue

                    if ( !self.IsLineCard(cbLastLogicValue, cbLogicValue) )
                        break;

                    cbWeaveCardData = cbWeaveCardData.concat(weave[n])
                    cbLastLogicValue = cbLogicValue;
                }

                if ( cbWeaveCardData.length >= minLen )
                    lineWeave.push(cbWeaveCardData)
                
                i += n - ( i + 1 );
            }

            return lineWeave
        }

        //连牌组合
        AnalyzeResult.cbLineSingleCardData = AnalyzeLineWeave(AnalyzeResult.cbSingleCardData, MIN_LINE_SINGLE_LEN)
        AnalyzeResult.cbLineDoubleCardData = AnalyzeLineWeave(AnalyzeResult.cbDoubleCardData, MIN_LINE_DOUBLE_LEN)
        AnalyzeResult.cbLineThreeCardData = AnalyzeLineWeave(AnalyzeResult.cbThreeCardData, MIN_LINE_THREE_LEN)

        return AnalyzeResult
    },
    //判断是否包含炸弹的牌
    IsIncludeBombCard:function(cards, totalCards)
    {
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( this.GetSameCardCount(totalCards, cards[i]) == 4 )
                return true
        }

        return false
    },
    //获取类型      
    GetCardType:function(cbCardData, totalCards, totalCardCount, bSelfOut)
    {
        var self = this
        var totalCardCount = totalCardCount || MAX_COUNT
        var AnalyzeResult = this.AnalyzeCard(cbCardData)

        var CheckCount = function(limitCount)
        {
            if ( cbCardData.length == limitCount )
                return true

            if ( bSelfOut && cbCardData.length < limitCount && cbCardData.length == totalCardCount )
                return true

            return false
        }

        var TypeObj = function(cbType, cbWeaveCards)
        {
            var cbLogicValue = 0
            var cbLength = 0
            var cbTempCards = []
            if ( cbWeaveCards )
            {
                cbLogicValue = self.GetCardLogicValue(cbWeaveCards[0])
                cbLength = cbWeaveCards.length
                
                cbTempCards = clone(cbCardData)
                for ( var i = 0; i < cbWeaveCards.length; i++ )
                    cbTempCards.splice(cbTempCards.indexOf(cbWeaveCards[i]), 1)

                cbTempCards = cbWeaveCards.concat(cbTempCards)
            }

            return { cbType:cbType, cbLogicValue:cbLogicValue, cbLength:cbLength, cbCards:cbTempCards }
        }

        //4张
        if (AnalyzeResult.cbFourCardData.length > 0 && cbCardData.length == 4)
            return TypeObj(CT_BOMB, AnalyzeResult.cbFourCardData[0])

        //不拆炸弹
        if ( totalCards && this.IsIncludeBombCard(cbCardData, totalCards) )
            return TypeObj(CT_ERROR)

        if (typeof(CT_BOMB_TAKE) != 'undefined' && AnalyzeResult.cbFourCardData.length > 0 && CheckCount(4 + MAX_FOUR_TAKE) )
            return TypeObj(CT_BOMB_TAKE, AnalyzeResult.cbFourCardData[0])

        //飞机
        if (AnalyzeResult.cbLineThreeCardData.length > 0)
        {
            //取最长的
            var maxLineThreeleWeave = []
            for ( var i = 0; i < AnalyzeResult.cbLineThreeCardData.length; i++ )
            {
                if ( AnalyzeResult.cbLineThreeCardData[i].length > maxLineThreeleWeave.length )
                    maxLineThreeleWeave = AnalyzeResult.cbLineThreeCardData[i]
            }

            if ( CheckCount(maxLineThreeleWeave.length + maxLineThreeleWeave.length / 3 * MAX_THREE_TAKE) )
            {
                return TypeObj(CT_THREE_LINE, maxLineThreeleWeave)
            }
            else if ( maxLineThreeleWeave.length > MIN_LINE_THREE_LEN )
            {
                //带牌不够, 拆小三张
                for( var n = maxLineThreeleWeave.length - 3; n >= MIN_LINE_THREE_LEN; n -= 3 )
                { 
                    if( n + n / 3 * MAX_THREE_TAKE == cbCardData.length )
                        return TypeObj(CT_THREE_LINE, maxLineThreeleWeave.slice(0, n))
                }
            }
        }
        
        //三张
        if (AnalyzeResult.cbThreeCardData.length > 0 && CheckCount(3 + MAX_THREE_TAKE))
            return TypeObj(CT_THREE, AnalyzeResult.cbThreeCardData[0])

        //连对
        if (AnalyzeResult.cbLineDoubleCardData.length > 0 && AnalyzeResult.cbLineDoubleCardData[0].length == cbCardData.length)
            return TypeObj(CT_DOUBLE_LINE, AnalyzeResult.cbLineDoubleCardData[0])

        //顺子
        if (AnalyzeResult.cbLineSingleCardData.length > 0 && AnalyzeResult.cbLineSingleCardData[0].length == cbCardData.length)
            return TypeObj(CT_SINGLE_LINE, AnalyzeResult.cbLineSingleCardData[0])

        //对子
        if ( AnalyzeResult.cbDoubleCardData.length > 0 && 2 == cbCardData.length)
            return TypeObj(CT_DOUBLE, AnalyzeResult.cbDoubleCardData[0])

        //单张
        if ( AnalyzeResult.cbSingleCardData.length > 0 && 1 == cbCardData.length )
            return TypeObj(CT_SINGLE, AnalyzeResult.cbSingleCardData[0])

        return TypeObj(CT_ERROR)
    },
    CompareCard:function(currCardType, lastCardType)
    {
        if ( currCardType.cbType == CT_ERROR )
            return false;

        if ( lastCardType.cbType == CT_ERROR )
            return true;

        if ( currCardType.cbType == CT_BOMB )
        {
            if ( lastCardType.cbType != CT_BOMB )
                return true;
        }
        else if ( lastCardType.cbType == CT_BOMB )
        {
            return false;
        }

        //类型和长度必须相同
        if ( currCardType.cbType != lastCardType.cbType || currCardType.cbLength != lastCardType.cbLength )
            return false;

        return currCardType.cbLogicValue > lastCardType.cbLogicValue;
    },
    //主动出牌
    SearchFirstCard:function(bCardData, bWarn)
    {
        var self = this
        var SearchResult = []
        var AnalyzeResult = this.AnalyzeCard(bCardData)

        //取最小牌
        var minLogicValue = INVALID_BYTE
        var maxLogicValue = 0
        for ( var i = 0; i < bCardData.length; i++ )
        {
            var logicValue = this.GetCardLogicValue(bCardData[i])
            if ( logicValue < minLogicValue )
                minLogicValue = logicValue
            if ( logicValue > maxLogicValue )
                maxLogicValue = logicValue
        }   

        var SearchLogicValue = bWarn ? maxLogicValue : minLogicValue

        var pushResult = function(cards)
        {
            SearchResult.push(cards)
        }

        var Search = function(weave, cbSameCount, cbTakeCount, cbMinLineLen)
        {
            if ( weave.length == 0 )
                return

            var tempWeave =[]
            if ( cbMinLineLen > 0 )
            {
                for(var i = 0; i < weave.length; i++ )
                {
                    var meorCount = 0
                    var tempCards = clone(weave[i]);
                    tempCards.reverse();
                    for(var j = 0; j < tempCards.length; j += cbSameCount)
                    {
                        if( self.GetCardCountByLogicValue(tempCards[j], bCardData) > cbSameCount )
                        {
                            if( j >= cbMinLineLen )
                            {
                                tempCards = tempCards.slice(0, j)
                                break
                            }

                            meorCount++
                        }
                    }

                    //拆牌不能过半
                    if ( meorCount * cbSameCount * 2 < tempCards.length )
                    { 
                        tempCards.reverse()
                        tempWeave.push(tempCards)
                    }
                }
            }
            else
            {
                tempWeave = weave
            }

            for(var i = 0; i < tempWeave.length; i++ )
            {
                for(var j = 0; j < tempWeave[i].length; j += cbSameCount)
                {
                    if( self.GetCardLogicValue(tempWeave[i][j]) == SearchLogicValue )
                    {
                        if ( cbTakeCount > 0 )
                        {
                            var tempTakeCount = cbTakeCount
                            if ( cbSameCount == 3 )
                                tempTakeCount = tempWeave[i].length / 3 * cbTakeCount

                            pushResult(tempWeave[i].concat(self.getTakeCard(bCardData, tempWeave[i], tempTakeCount)))
                        }
                        else
                        {
                            pushResult(tempWeave[i])
                        }
                    }
                }
            }
        }
       
        Search(AnalyzeResult.cbFourCardData,4,0,0)
        if ( typeof(CT_BOMB_TAKE) != 'undefined' )
            Search(AnalyzeResult.cbFourCardData,4,MAX_FOUR_TAKE,0)
        Search(AnalyzeResult.cbLineThreeCardData,3,MAX_THREE_TAKE,MIN_LINE_THREE_LEN)
        Search(AnalyzeResult.cbLineDoubleCardData,2,0,MIN_LINE_DOUBLE_LEN)
        Search(AnalyzeResult.cbLineSingleCardData,1,0,MIN_LINE_SINGLE_LEN)
        Search(AnalyzeResult.cbThreeCardData,3,MAX_THREE_TAKE,0)
        Search(AnalyzeResult.cbDoubleCardData,2,0,0)
        Search(AnalyzeResult.cbSingleCardData,1,0,0)

        return SearchResult
    },
    SearchCopareCard:function(bCardData, lastCardType, bSelfOut)
    {
        var self = this
        var SearchResult = []
        var AnalyzeResult = this.AnalyzeCard(bCardData)

        var pushResult = function(cards)
        {
            SearchResult.push(cards)
        }

        var Search = function(weave, cbLineSize, cbTakeCount)
        {
            if ( weave.length == 0 )
                return 

            for ( var i = weave.length - 1; i >= 0; i-- )
            {
                if ( cbLineSize > 0 )
                {
                    for ( var j = 0; j < weave[i].length; j += cbLineSize )
                    {
                        if ( self.GetCardLogicValue(weave[i][j]) > lastCardType.cbLogicValue && weave[i].length - j >= lastCardType.cbLength )
                        {
                            var tempWeaveCards = weave[i].slice(j, j + lastCardType.cbLength)
                            if ( cbTakeCount > 0 )
                            {
                                if ( cbTakeCount + tempWeaveCards.length > bCardData.length )
                                    continue

                                tempWeaveCards = tempWeaveCards.concat(self.getTakeCard(bCardData, tempWeaveCards, cbTakeCount))
                            }

                            pushResult(tempWeaveCards)
                        }
                    }
                }
                else if ( self.GetCardLogicValue(weave[i][0]) > lastCardType.cbLogicValue )
                {
                    var takeCards = []
                    if ( cbTakeCount > 0 )
                    {
                        if ( cbTakeCount + weave[i].length > bCardData.length )
                            continue

                        takeCards = self.getTakeCard(bCardData, weave[i], cbTakeCount)
                    }
                    
                    pushResult(weave[i].concat(takeCards))
                }
            }
        }

        if ( lastCardType.cbType != CT_BOMB )
        {
            for ( var i = AnalyzeResult.cbFourCardData.length - 1; i >= 0; i-- )
                pushResult(AnalyzeResult.cbFourCardData[i])
            
            for ( var i = AnalyzeResult.cbThreeCardData.length - 1; i >= 0; i-- )
            {
                if ( this.IsThreeBomb(AnalyzeResult.cbThreeCardData[i][0]) )
                    pushResult(AnalyzeResult.cbThreeCardData[i])
            }
        }

        switch(lastCardType.cbType)
        {
            case CT_SINGLE:
                var lastLogicValue = INVALID_BYTE
                for(var i = bCardData.length-1; i >= 0; i-- )
                {
                    var logicValue = this.GetCardLogicValue(bCardData[i])
                    if ( lastLogicValue != INVALID_BYTE && logicValue == lastLogicValue )
                        continue

                    if ( logicValue > lastCardType.cbLogicValue && !this.IsIncludeBombCard([bCardData[i]], bCardData) )
                        pushResult([bCardData[i]])

                    lastLogicValue = logicValue
                }
                break;
            case CT_DOUBLE:
                Search(AnalyzeResult.cbDoubleCardData, 0, 0);
                break;
            case CT_THREE:
                Search(AnalyzeResult.cbThreeCardData, 0, MAX_THREE_TAKE);
                break;
            case CT_SINGLE_LINE:
                Search(AnalyzeResult.cbLineSingleCardData, 1, 0);
                break;
            case CT_DOUBLE_LINE:
                Search(AnalyzeResult.cbLineDoubleCardData, 2, 0);
                break;
            case CT_THREE_LINE:
                Search(AnalyzeResult.cbLineThreeCardData, 3, MAX_THREE_TAKE * lastCardType.cbLength / 3);
                break;
            case CT_BOMB:
                Search(AnalyzeResult.cbFourCardData, 0, 0);
                break;
        }

        if ( typeof(CT_BOMB_TAKE) != 'undefined' && lastCardType.cbType == CT_BOMB_TAKE )
            Search(AnalyzeResult.cbFourCardData, 0, MAX_FOUR_TAKE);

        //sort
        var PriorityLevel = this.GetPriorityLevel(bCardData)
        SearchResult.sort(function(a, b)
        {
            var getMaxPriority = function(cards)
            {
                var maxPriority = 0
                for ( var i = 0; i < cards.length; i++ )
                {
                    if ( PriorityLevel[cards[i]] > maxPriority )
                        maxPriority = PriorityLevel[cards[i]]
                }

                return maxPriority
            }

            return getMaxPriority(a) - getMaxPriority(b)
        })

        return SearchResult
    },
    SearchOutCard:function(bCardData, lastCardType, bSelfOut, bWarn)
    {
        if ( bSelfOut )
            return this.SearchFirstCard(bCardData, bWarn)
        else
            return this.SearchCopareCard(bCardData, lastCardType, bSelfOut)
    },
    getTakeCard:function(bCardData, weaveCards, cbTakeCount)
    {
        var cards = clone(bCardData)

        for ( var i = 0; i < weaveCards.length; i++ )
            cards.splice(cards.indexOf(weaveCards[i]), 1)

        if ( cbTakeCount > cards.length )
            cbTakeCount = cards.length

        //sort
        var PriorityLevel = this.GetPriorityLevel(cards)
        cards.sort(function(a, b)
        {
            return PriorityLevel[a] - PriorityLevel[b]
        })

        var takeCards = cards.splice(0, cbTakeCount)
        PriorityLevel = this.GetPriorityLevel(cards)
        var takePriorityLevel = this.GetPriorityLevel(takeCards)
        for ( var i = 0; i < cards.length; i++ )
        {
            var lv = PriorityLevel[cards[i]]
            var maxLv = 0
            var maxIndex = -1
            for ( j = 0; j < takeCards.length; j++ )
            {
                var takeLv = takePriorityLevel[takeCards[j]] || 0
                if ( Math.floor(lv/100) == Math.floor(takeLv/100) && lv < takeLv && takeLv > maxLv )
                {
                    maxLv = takeLv
                    maxIndex = j
                }
            }

            if ( maxIndex >= 0 )
            {
                var temp = cards[i]
                cards[i] = takeCards[maxIndex]
                takeCards[maxIndex] = temp
            }
        }

        return takeCards
    },
    GetPriorityLevel:function(bCardData)
    {
        var self = this
        var cards = this.SortCardList(clone(bCardData))
        var PriorityLevel = []

        var CalcPriorityLevel = function(weave, baseValue, cbLineSize)
        {
            if ( weave.length == 0 )
                return false

            for ( var i = 0; i < weave.length; i++ )
            {
                if ( cbLineSize > 0 )
                {
                    var meorCount = 0
                    for ( var j = 0; j < weave[i].length; j += cbLineSize )
                    {
                        if ( self.GetCardCountByLogicValue(weave[i][j], bCardData) > cbLineSize )
                            meorCount++
                    }

                    //拆牌不能过半
                    if( meorCount * cbLineSize * 2 >= weave[i].length )
                        continue
                }

                for ( var j = 0; j < weave[i].length; j++ )
                {
                    PriorityLevel[weave[i][j]] = PriorityLevel[weave[i][j]] || 0
                    PriorityLevel[weave[i][j]] = baseValue
                    cards.splice(cards.indexOf(weave[i][j]),1);
                }

                return true
            }

            return false
        }

        while( true )
        {
            var AnalyzeResult = this.AnalyzeCard(cards)

            if( CalcPriorityLevel(AnalyzeResult.cbFourCardData, 600, 0) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.cbLineThreeCardData, 500, 3) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.cbLineSingleCardData, 400, 1) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.cbThreeCardData, 300, 0) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.cbLineDoubleCardData, 200, 2) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.cbDoubleCardData, 100, 0) )
                continue

            break
        }

        for ( var i = 0; i < bCardData.length; i++ )
        {
            PriorityLevel[bCardData[i]] = PriorityLevel[bCardData[i]] || 0
            PriorityLevel[bCardData[i]] += this.GetCardLogicValue(bCardData[i])
        }

        return PriorityLevel
    },
}