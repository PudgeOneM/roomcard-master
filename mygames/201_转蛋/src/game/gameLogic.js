var gameLogic =
{
    cbMagicCards:[],
    GetCardValue:function(cbCardData)
    {   
        return (cbCardData & LOGIC_MASK_VALUE) - 1
    },
    GetCardColor:function(cbCardData)
    {
        return (cbCardData & LOGIC_MASK_COLOR) >> 4
    },
    //isNotMagic不处理财神
    GetCardLogicValue:function(cbCardData)
    {
        var cbCardValue = this.GetCardValue(cbCardData)
        return s_cbLogicValue[cbCardValue]
    },
    IsMagicCard:function(cbCardData)
    {
        for ( var i = 0; i < this.cbMagicCards.length; i++ )
        {
            if ( this.cbMagicCards[i] == cbCardData )
                return true
        }

        return false
    },
    GetMagicCards:function(cards)
    {
        var magicCards = []
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( this.IsMagicCard(cards[i]) )
                magicCards.push(cards[i])
        }

        return magicCards
    },
    GetMagicCount:function(cards)
    {
        var count = 0
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( this.IsMagicCard(cards[i]) )
                count++
        }

        return count
    },
    RemoveCard:function(cards, removeCards)
    {
        for ( var i = 0; i < removeCards.length; i++ )
        {
            var index = cards.indexOf(removeCards[i])
            if ( index != -1 )
                cards.splice(index, 1)
        }
    },
    IsAllPair:function(cards)
    {
        var cbSingleCount = 0;
        var cbLastLogicValue = INVALID_BYTE;
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( cards[i] == 0 || this.IsMagicCard(cards[i]) )
                continue

            var cbLogicValue = this.GetCardLogicValue(cards[i])
            if ( cbLastLogicValue == INVALID_BYTE )
            {
                cbLastLogicValue = cbLogicValue
            }
            else if ( cbLastLogicValue == cbLogicValue )
            {
                cbLastLogicValue = INVALID_BYTE
            }
            else
            {
                cbLastLogicValue = cbLogicValue
                cbSingleCount++
            }
        }

        if ( cbLastLogicValue != INVALID_BYTE )
            cbSingleCount++;

        //必须全对子
        var magicCount = this.GetMagicCount(cards)
        if ( magicCount >= cbSingleCount && ( magicCount - cbSingleCount ) % 2 == 0 )
            return true

        return false
    },
    GetCardNumByLogicValue:function(logicValue)
    {
        for ( var i = 0; i < s_cbLogicValue.length; i++ )
        {
            if ( s_cbLogicValue[i] == logicValue )
                return i + 1
        }
        
        return 0
    },
    SortCardList:function(cbCardList)
    {
        var self = this
        cbCardList.sort(function(a,b)
        {   
            var logicValue_a = self.GetCardLogicValue(a)
            var logicValue_b = self.GetCardLogicValue(b)
            if( logicValue_b == logicValue_a )
                return b - a
            else
                return logicValue_b - logicValue_a
        })

        return cbCardList
    },
    SortWeave:function(weaves)
    {
        weaves.sort(function(a, b)
        {
            return b.logicValue - a.logicValue
        })
    },
    GetSameCardCount:function(cards, cardData)
    {
        var count = 0
        var logicValue = this.GetCardLogicValue(cardData)
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( !this.IsMagicCard(cards[i]) && logicValue == this.GetCardLogicValue(cards[i]) )
                count++
        }
 
        return count
    },
    //统计同牌
    GetSameCards:function(cards, bLine)
    {
        var sameCards = []
        for ( var i = 0; i < MAX_INDEX; i++ )
            sameCards[i] = []

        for ( var i = 0; i < cards.length; i++ )
        {
            if ( cards[i] == 0 || this.IsMagicCard(cards[i]) )
                continue;

            var cbLogicValue = this.GetCardLogicValue(cards[i])

            //A后顺
            if ( bLine && cbLogicValue == 13 )
                sameCards[0].push(cards[i])

            sameCards[cbLogicValue].push(cards[i]);
        }

        var magicCards = this.GetMagicCards(cards)
        if ( magicCards.length > 0 )
        {
            for ( var i = 0; i < WANG_VALUE1; i++ )
            {
                if ( sameCards[i].length == 0 && !bLine )
                    continue

                sameCards[i] = sameCards[i].concat(magicCards)
            }
        }

        return sameCards
    },
    //分析扑克
    AnalyzeCard:function(cards)
    {
        var self = this
        var AnalyzeResult =
        {
            PairWeave:[],
            ThreeWeave:[],
            BombWeave:[],
            WangZhaWeave:[],
            LineWeave:[],
            LineFlushWeave:[],
            LinePairWeave:[],
            LineThreeWeave:[],
        }

        //统计同牌
        if ( cards.length >= 2 )
            this.AnalyzeSameCardWeave(cards, AnalyzeResult)

        //统计顺子
        if ( cards.length >= MIN_LINE_LEN )
            this.AnalyzeLineWeave(cards, AnalyzeResult, CT_LINE)

        //统计连对
        if ( cards.length >= MIN_LINE_PAIR_LEN )
            this.AnalyzeLineWeave(cards, AnalyzeResult, CT_PAIR_LINE)

        //统计飞机
        if ( cards.length >= MIN_LINE_THREE_LEN )
            this.AnalyzeLineWeave(cards, AnalyzeResult, CT_THREE_LINE)

        //统计同花组合
        if ( typeof(CT_FLUSH_LINE) != 'undefined' && cards.length >= MIN_LINE_LEN )
            this.AnalyzeFlushWeave(cards, AnalyzeResult);

        this.SortWeave(AnalyzeResult.BombWeave)
        this.SortWeave(AnalyzeResult.LineFlushWeave)

        return AnalyzeResult
    },
    //分析同牌
    AnalyzeSameCardWeave:function(cards, AnalyzeResult)
    {
        var self = this
        var PushWeave = function(cardDatas)
        {
            var logicValue = self.GetCardLogicValue(cardDatas[0])
            if ( cardDatas.length >= 2 )
                self.PushWeave(cardDatas, logicValue, AnalyzeResult, CT_PAIR)
            if ( cardDatas.length >= 3 )
                self.PushWeave(cardDatas, logicValue, AnalyzeResult, CT_THREE)
            if ( cardDatas.length >= 4 )
                self.PushWeave(cardDatas, logicValue, AnalyzeResult, CT_BOMB)
        }

        //普通同牌组合
        var sameCards = this.GetSameCards(cards, false)
        for ( var i = 0; i < MAX_INDEX; i++ )
        {
            PushWeave(sameCards[i])
        }

        //纯财神组合
        var magicCards = this.GetMagicCards(cards)
        PushWeave(magicCards)

        //王炸组合
        if ( typeof(CT_WANG_ZHA) != 'undefined' && sameCards[WANG_VALUE1].length == MAX_SAME_DATA && sameCards[WANG_VALUE2].length == MAX_SAME_DATA )
        {
            var cbWangCards = []
            for ( var i = 0; i < MAX_SAME_DATA; i++ )
                cbWangCards.push(0x4F)
            for ( var i = 0; i < MAX_SAME_DATA; i++ )
                cbWangCards.push(0x4E)

            this.PushWeave(cbWangCards, this.GetCardLogicValue(cbWangCards[0]), AnalyzeResult, CT_WANG_ZHA);
        }
   },
   //分析连牌
   AnalyzeLineWeave:function(cards, AnalyzeResult, cbCardType)
   {
        var cbLineSize = 0;
        var cbMinLen = 0; 
        var cbMaxLen = 0;
        switch ( cbCardType )
        {
        case CT_LINE:
            {
                cbLineSize = 1
                cbMinLen = MIN_LINE_LEN
                cbMaxLen = MAX_LINE_LEN
                break
            }
        case CT_PAIR_LINE:
            {
                cbLineSize = 2
                cbMinLen = MIN_LINE_PAIR_LEN
                cbMaxLen = MAX_LINE_PAIR_LEN
                break
            }
        case CT_THREE_LINE:
            {
                cbLineSize = 3
                cbMinLen = MIN_LINE_THREE_LEN
                cbMaxLen = MAX_LINE_THREE_LEN
                break
            }
        }

        if ( typeof(CT_FLUSH_LINE) != 'undefined' && cbCardType == CT_FLUSH_LINE )
        {
            cbLineSize = 1
            cbMinLen = MIN_LINE_LEN
            cbMaxLen = MAX_LINE_LEN
        }

        var sameCards = this.GetSameCards(cards, true);
        var magicCards = this.GetMagicCards(cards)

        for ( var i = MAX_LINE_VALUE; i >= MIN_LINE_VALUE; i-- )
        {
            if ( sameCards[i].length < cbLineSize )
                continue

            var cbLineCards = []
            for ( var j = i; j >= MIN_LINE_VALUE; j-- )
            {
                cbLineCards = cbLineCards.concat(sameCards[j].slice(0, cbLineSize))

                if ( j == MIN_LINE_VALUE || 
                    sameCards[j - 1].length < cbLineSize || 
                    this.GetMagicCount(cbLineCards) + this.GetMagicCount(sameCards[j - 1].slice(0, cbLineSize)) > magicCards.length || 
                    cbLineCards.length >= cbMaxLen )
                {
                    if ( cbLineCards.length >= cbMinLen )
                    {
                        //处理重复使用的财神
                        var cbMaginIndex = 0
                        for ( var n = 0; n < cbLineCards.length; n++ )
                        {
                            if ( this.IsMagicCard(cbLineCards[n]) )
                                cbLineCards[n] = magicCards[cbMaginIndex++]
                        }

                        this.PushWeave(cbLineCards, j + cbLineCards.length / cbLineSize - 1, AnalyzeResult, cbCardType)
                    }

                    break
                }
            }
        }
   },
   AnalyzeFlushWeave:function(cards, AnalyzeResult)
   {
        var magicCards = this.GetMagicCards(cards)
        var cbColorCards = []
        for ( var i = 0; i < MAX_BASE_COLOR; i++ )
            cbColorCards[i] = []

        for ( var i = 0; i < cards.length; i++ )
        {
            if ( cards[i] == 0 || this.IsMagicCard(cards[i]) )
                continue

            var cbCardColor = this.GetCardColor(cards[i])
            if ( cbCardColor < MAX_BASE_COLOR )
                cbColorCards[cbCardColor].push(cards[i])
        }

        //统计同花顺
        for ( var i = 0; i < MAX_BASE_COLOR; i++ )
        {
            if ( magicCards.length > 0 )
                cbColorCards[i] = cbColorCards[i].concat(magicCards)

            if ( typeof(CT_FLUSH_LINE) != 'undefined' && cbColorCards[i].length >= MIN_LINE_LEN )
                this.AnalyzeLineWeave(cbColorCards[i], AnalyzeResult, CT_FLUSH_LINE);
        }
   },
   PushWeave:function(cards, cbLogicValue, AnalyzeResult, cbCardType)
   {
        switch ( cbCardType )
        {
        case CT_PAIR:
            {
                AnalyzeResult.PairWeave.push({cards:cards.slice(0, 2), logicValue:cbLogicValue})
                return
            }
        case CT_THREE:
            {
                AnalyzeResult.ThreeWeave.push({cards:cards.slice(0, 3), logicValue:cbLogicValue})
                return
            }
        case CT_BOMB:
            {
                if ( cards.length < 6 )
                    cbLogicValue += cards.length * 1000
                else
                    cbLogicValue += (cards.length + 1) * 1000
                AnalyzeResult.BombWeave.push({cards:cards, logicValue:cbLogicValue})
                return
            }
        case CT_LINE:
            {
                AnalyzeResult.LineWeave.push({cards:cards, logicValue:cbLogicValue})
                return
            }
            break;
        case CT_PAIR_LINE:
            {
                AnalyzeResult.LinePairWeave.push({cards:cards, logicValue:cbLogicValue})
                return
            }
        case CT_THREE_LINE:
            {
                AnalyzeResult.LineThreeWeave.push({cards:cards, logicValue:cbLogicValue})
                return
            }
        }

        if ( typeof(CT_FLUSH_LINE) != 'undefined' && cbCardType == CT_FLUSH_LINE )
            AnalyzeResult.LineFlushWeave.push({cards:cards, logicValue:cbLogicValue + 6000})
        else if ( typeof(CT_WANG_ZHA) != 'undefined' && cbCardType == CT_WANG_ZHA )
            AnalyzeResult.WangZhaWeave.push({cards:cards, logicValue:cbLogicValue + 30000})
    },
    //获取类型
    GetCardType:function(cards, cbCompareType, cbHandTotalCount)
    {
        //----------------------------------------------------
        //注：因为带财神，所以需要提供比较类型
        //----------------------------------------------------
        
        var self = this
        var CardTypeObj = function(type, logicValue, length, cardDatas, takeType)
        {
            takeType = takeType || TAKE_NONE
            cardDatas = cardDatas || []

            return {
                cbType:type, 
                cbLogicValue:logicValue, 
                cbLength:length,
                wTakeType:takeType,
                cards:cardDatas,
            }
        }

        var Regroup = function(weaveCards)
        {
            var tempCards = clone(cards)
            self.RemoveCard(tempCards, weaveCards)

            return weaveCards.concat(tempCards)
        }

        cbHandTotalCount = cbHandTotalCount || MAX_COUNT
        
        //单牌
        if ( cards.length == 1 )
            return CardTypeObj(CT_SINGLE, this.GetCardLogicValue(cards[0]), cards.length, cards)

        var AnalyzeResult = this.AnalyzeCard(cards)

        //王炸
        var WangZhaWeave = AnalyzeResult.WangZhaWeave
        if ( typeof(CT_WANG_ZHA) != 'undefined' && WangZhaWeave.length > 0 )
        {
            for ( var i = 0; i < WangZhaWeave.length; i++ )
            {
                if ( WangZhaWeave[i].cards.length == cards.length )
                    return CardTypeObj(CT_WANG_ZHA, WangZhaWeave[i].logicValue, WangZhaWeave[i].cards.length, WangZhaWeave[i].cards)
            }
        }

        //同花顺
        var LineFlushWeave = AnalyzeResult.LineFlushWeave
        if ( typeof(CT_FLUSH_LINE) != 'undefined' && LineFlushWeave.length > 0)
        {
            for ( var i = 0; i < LineFlushWeave.length; i++ )
            {
                if ( LineFlushWeave[i].cards.length == cards.length )
                    return CardTypeObj(CT_FLUSH_LINE, LineFlushWeave[i].logicValue, LineFlushWeave[i].cards.length, LineFlushWeave[i].cards)
            }
        }

        //炸弹
        var BombWeave = AnalyzeResult.BombWeave
        if ( BombWeave.length > 0 )
        {
            for ( var i = 0; i < BombWeave.length; i++ )
            {
                if ( BombWeave[i].cards.length == cards.length )
                {   
                    return CardTypeObj(CT_BOMB, BombWeave[i].logicValue, BombWeave[i].cards.length, cards)
                }
                else if ( typeof(CT_BOMB_TAKE) != 'undefined' && (cbCompareType == CT_ERROR || cbCompareType == CT_BOMB_TAKE) )
                {
                    //炸弹带牌
                    var wTakeType = this.CheckTakeCard(cards, BombWeave[i].cards, BOMB_TAKE_TYPE, BombWeave[i].cards.length, cbHandTotalCount)
                    if ( wTakeType != TAKE_ERROR )
                        return CardTypeObj(CT_BOMB_TAKE, BombWeave[i].logicValue, BombWeave[i].cards.length, Regroup(BombWeave[i].cards), wTakeType)
                }
            }
        }

        //飞机
        var LineThreeWeave = AnalyzeResult.LineThreeWeave
        if ( LineThreeWeave.length > 0 && (cbCompareType == CT_ERROR || cbCompareType == CT_THREE_LINE) )
        {
            //取最长的
            var cbMaxLen = 0
            var cbMaxLenIndex = 0
            for ( var i = 0; i < LineThreeWeave.length; i++ )
            {
                if ( LineThreeWeave[i].cards.length > cbMaxLen )
                {
                    cbMaxLen = LineThreeWeave[i].cards.length
                    cbMaxLenIndex = i
                }
            }

            var wTakeType = this.CheckTakeCard(cards, LineThreeWeave[cbMaxLenIndex].cards, LINE_THREE_TAKE_TYPE, 3, cbHandTotalCount)
            if ( wTakeType != TAKE_ERROR )
            {
                return CardTypeObj(CT_THREE_LINE, LineThreeWeave[cbMaxLenIndex].logicValue, LineThreeWeave[cbMaxLenIndex].cards.length, Regroup(LineThreeWeave[cbMaxLenIndex].cards), wTakeType)
            }
            else if ( cbMaxLen > MIN_LINE_THREE_LEN ) //带牌不够, 拆小三张
            {
                for (var i = cbMaxLen - 3; i >= MIN_LINE_THREE_LEN; i -= 3)
                {
                    var cbTempCards = LineThreeWeave[cbMaxLenIndex].cards.slice(0, i)
                    var wTakeType = this.CheckTakeCard(cards, cbTempCards, LINE_THREE_TAKE_TYPE, 3, cbHandTotalCount)
                    if ( wTakeType != TAKE_ERROR )
                        return CardTypeObj(CT_THREE_LINE, LineThreeWeave[cbMaxLenIndex].logicValue, i, Regroup(cbTempCards), wTakeType)
                }
            }
        }

        //连对
        var LinePairWeave = AnalyzeResult.LinePairWeave
        if ( LinePairWeave.length > 0 && (cbCompareType == CT_ERROR || cbCompareType == CT_PAIR_LINE) )
        {
            for ( var i = 0; i < LinePairWeave.length; i++ )
            {
                if ( LinePairWeave[i].cards.length == cards.length )
                    return CardTypeObj(CT_PAIR_LINE, LinePairWeave[i].logicValue, LinePairWeave[i].cards.length, LinePairWeave[i].cards)
            }
        }

        //顺子
        var LineWeave = AnalyzeResult.LineWeave
        if ( LineWeave.length > 0 && (cbCompareType == CT_ERROR || cbCompareType == CT_LINE) )
        {
            for ( var i = 0; i < LineWeave.length; i++ )
            {
                if ( LineWeave[i].cards.length == cards.length )
                    return CardTypeObj(CT_LINE, LineWeave[i].logicValue, LineWeave[i].cards.length, LineWeave[i].cards)
            }
        }

        //三张
        var ThreeWeave = AnalyzeResult.ThreeWeave
        if ( ThreeWeave.length > 0 && (cbCompareType == CT_ERROR || cbCompareType == CT_THREE) )
        {
            for ( var i = 0; i < ThreeWeave.length; i++ )
            {
                var wTakeType = this.CheckTakeCard(cards, ThreeWeave[i].cards, THREE_TAKE_TYPE, 3, cbHandTotalCount)
                if ( wTakeType != TAKE_ERROR )
                {
                    return CardTypeObj(CT_THREE, ThreeWeave[i].logicValue, ThreeWeave[i].cards.length, Regroup(ThreeWeave[i].cards), wTakeType)
                }
            }
        }

        //对子
        var PairWeave = AnalyzeResult.PairWeave
        if ( PairWeave.length > 0 && (cbCompareType == CT_ERROR || cbCompareType == CT_PAIR) )
        {
            for ( var i = 0; i < PairWeave.length; i++ )
            {
                if ( PairWeave[i].cards.length == cards.length )
                    return CardTypeObj(CT_PAIR, PairWeave[i].logicValue, PairWeave[i].cards.length, PairWeave[i].cards)
            }
        }

        return CardTypeObj(CT_ERROR, 0, 0)
    },
    //带牌检查
    CheckTakeCard:function(cards, weaveCards, wTakeType, cbSize, cbHandTotalCount)
    {
        //不带
        if ( wTakeType & TAKE_NONE )
        {
            if ( cards.length == weaveCards.length )
                return TAKE_NONE
        }

        var cbWeaveLen = weaveCards.length / cbSize

        //带1张带牌
        if ( wTakeType & TAKE_SINGLE )
        {
            var cbNeedCount = weaveCards.length + cbWeaveLen * 1
            if ( cards.length == cbNeedCount || (cards.length < cbNeedCount && cards.length == cbHandTotalCount) )
                return TAKE_SINGLE
        }

        //带2张带牌
        if ( wTakeType & TAKE_SINGLE2 )
        {
            var cbNeedCount = weaveCards.length + cbWeaveLen * 2;
            if ( cards.length == cbNeedCount || (cards.length < cbNeedCount && cards.length == cbHandTotalCount) )
                return TAKE_SINGLE2
        }

        //带3张带牌
        if ( wTakeType & TAKE_SINGLE3 )
        {
            var cbNeedCount = weaveCards.length + cbWeaveLen * 3;
            if ( cards.length == cbNeedCount || (cards.length < cbNeedCount && cards.length == cbHandTotalCount) )
                return TAKE_SINGLE3
        }

        //带1个对子
        if  ( wTakeType & TAKE_PAIR )
        {
            var cbNeedCount = weaveCards.length + cbWeaveLen * 2;
            if ( cards.length == cbNeedCount || (cards.length < cbNeedCount && cards.length == cbHandTotalCount) )
            {
                var cbTempCards = clone(cards)
                this.RemoveCard(cbTempCards, weaveCards)

                //必须全对子
                if ( cbTempCards.length == 0 || this.IsAllPair(cbTempCards) )
                    return TAKE_PAIR
            }
        }

        //带2个对子
        if  ( wTakeType & TAKE_PAIR2 )
        {
            var cbNeedCount = weaveCards.length + cbWeaveLen * 4;
            if ( cards.length == cbNeedCount || (cards.length < cbNeedCount && cards.length == cbHandTotalCount) )
            {
                var cbTempCards = clone(cards)
                this.RemoveCard(cbTempCards, weaveCards)

                //必须全对子
                if ( cbTempCards.length == 0 || this.IsAllPair(cbTempCards) )
                    return TAKE_PAIR2
            }
        }

        return TAKE_ERROR
    },
    //比较扑克 四王》六张和六张以上炸弹》同花顺》五张炸弹》四张炸弹》其它牌型
    CompareCard:function(cards, cbHandTotalCount, lastCardType)
    {
        var CardType = this.GetCardType(cards, lastCardType.cbType, cbHandTotalCount)
        if ( CardType.cbType == CT_ERROR )
            return false

        if ( lastCardType.cbType == CT_ERROR )
            return true

        //比较炸弹
        var hasBomb = false
        if ( typeof(CT_WANG_ZHA) != 'undefined' && (CardType.cbType == CT_WANG_ZHA || lastCardType.cbType == CT_WANG_ZHA) )
            hasBomb = true

        if ( typeof(CT_FLUSH_LINE) != 'undefined' && (CardType.cbType == CT_FLUSH_LINE || lastCardType.cbType == CT_FLUSH_LINE) )
            hasBomb = true

        if ( hasBomb || CardType.cbType == CT_BOMB || lastCardType.cbType == CT_BOMB )
            return CardType.cbLogicValue > lastCardType.cbLogicValue

        //类型、长度、带牌类型必须相同
        if ( CardType.cbType != lastCardType.cbType || 
            CardType.cbLength != lastCardType.cbLength || 
            CardType.wTakeType != lastCardType.wTakeType )
        {
            return false
        }

        return CardType.cbLogicValue > lastCardType.cbLogicValue
    },
    //主动出牌
    SearchFirstCard:function(cards)
    {
        var SearchResult = []

        //取最小牌
        var SearchLogicValue = INVALID_BYTE
        for ( var i = 0; i < cards.length; i++ )
        {
            var logicValue = this.GetCardLogicValue(cards[i])
            if ( logicValue < SearchLogicValue )
                SearchLogicValue = logicValue
        }

        var self = this
        var AnalyzeResult = this.AnalyzeCard(cards)

        var Search = function(weaves, cbTakeType)
        {
            if ( weaves.length == 0 )
                return

            for( var i = 0; i < weaves.length; i++ )
            {
                for( var j = 0; j < weaves[i].cards.length; j++ )
                {
                    if( self.GetCardLogicValue(weaves[i].cards[j]) == SearchLogicValue )
                    {
                        if ( cbTakeType && cbTakeType != TAKE_NONE )
                        {
                            var tempCards = clone(cards)
                            self.RemoveCard(tempCards, weaves[i].cards)
                            var takeCard = self.getTakeCard(tempCards, cbTakeType, 1, TAKE_NONE)
                            if ( takeCard.bSuccess )
                                SearchResult.push(weaves[i].cards.concat(takeCard.cards))
                        }
                        else
                        {
                            SearchResult.push(weaves[i].cards)
                        }

                        break
                    }
                }
            }
        }

        var SearchLine = function(weaves, cbSize, cbMinLineLen, cbTakeType)
        {
            if ( weaves.length == 0 )
                return

            var tempWeave = []
            for( var i = 0; i < weaves.length; i++ )
            {
                var splitCount = 0
                var tempCards = clone(weaves[i].cards)
                tempCards.reverse()
                for(var j = 0; j < tempCards.length; j += cbSize)
                {
                    if( self.GetSameCardCount(cards, tempCards[j]) > cbSize )
                    {
                        if( j >= cbMinLineLen )
                        {
                            tempCards = tempCards.slice(0, j)
                            break
                        }

                        splitCount++
                    }
                }

                //过半不拆牌
                if ( splitCount * cbSize * 2 < tempCards.length )
                { 
                    tempCards.reverse()
                    tempWeave.push(tempCards)
                }
            }

            for( var i = 0; i < tempWeave.length; i++ )
            {
                for( var j = 0; j < tempWeave[i].length; j += cbSize )
                {
                    if( self.GetCardLogicValue(tempWeave[i][j]) == SearchLogicValue )
                    {
                        if ( cbTakeType && cbTakeType != TAKE_NONE )
                        {
                            var tempCards = clone(cards)
                            self.RemoveCard(tempCards, tempWeave[i])
                            var takeCard = self.getTakeCard(tempCards, cbTakeType, tempWeave[i].length / cbSize, TAKE_NONE)
                            if ( takeCard.bSuccess )
                                SearchResult.push(tempWeave[i].concat(takeCard.cards))
                        }
                        else
                        {
                            SearchResult.push(tempWeave[i])
                        }
                    }
                }
            }
        }

        //王炸
        if ( typeof(CT_WANG_ZHA) != 'undefined' )
            Search(AnalyzeResult.WangZhaWeave)

        //炸弹
        Search(AnalyzeResult.BombWeave)

        //炸弹带牌
        if ( typeof(CT_BOMB_TAKE) != 'undefined' ) 
            Search(AnalyzeResult.BombWeave, BOMB_TAKE_TYPE)

        //飞机
        SearchLine(AnalyzeResult.LineThreeWeave, 3, MIN_LINE_THREE_LEN, LINE_THREE_TAKE_TYPE)

        //连对
        SearchLine(AnalyzeResult.LinePairWeave, 2, MIN_LINE_PAIR_LEN)

        //同花顺
        if ( typeof(CT_FLUSH_LINE) != 'undefined' )
            SearchLine(AnalyzeResult.LineFlushWeave, 1, MIN_LINE_LEN)

        //顺子
        SearchLine(AnalyzeResult.LineWeave, 1, MIN_LINE_LEN)

        //三条
        Search(AnalyzeResult.ThreeWeave, THREE_TAKE_TYPE)

        //对子
        Search(AnalyzeResult.PairWeave)
        
        //单牌
        for ( var i = 0; i < cards.length; i++ )
        {
            if ( this.GetCardLogicValue(cards[i]) == SearchLogicValue )
            {
                SearchResult.push([cards[i]])
                break
            }
        }

        //排序(带财神的放排后)
        SearchResult.sort(function(a, b)
        {
            return self.GetMagicCount(a) - self.GetMagicCount(b)
        })

        return SearchResult
    },
    SearchCompareCard:function(cards, lastCardType)
    {
        var self = this
        var SearchResult = []
        var AnalyzeResult = this.AnalyzeCard(cards)

        var Search = function(weave, cbTakeType)
        {
            if ( weave.length == 0 )
                return

            for ( var i = 0; i < weave.length; i++ )
            {
                if ( weave[i].logicValue > lastCardType.cbLogicValue )
                {
                    if ( cbTakeType && cbTakeType != TAKE_NONE )
                    {
                        var tempCards = clone(cards)
                        self.RemoveCard(tempCards, weave[i].cards)
                        var takeCard = self.getTakeCard(tempCards, cbTakeType, 1, lastCardType.wTakeType)
                        if ( takeCard.bSuccess )
                            SearchResult.push(weave[i].cards.concat(takeCard.cards))
                    }
                    else
                    {
                        SearchResult.push(weave[i].cards)
                    }
                }
            }
        }

        var SearchLine = function(weave, cbLineSize, cbTakeType)
        {
            if ( weave.length == 0 )
                return 

            for ( var i = 0; i < weave.length; i++ )
            {
                for ( var j = 0; j < weave[i].cards.length; j += cbLineSize )
                {
                    if ( weave[i].logicValue - j > lastCardType.cbLogicValue && weave[i].cards.length - j >= lastCardType.cbLength )
                    {
                        var tempWeaveCards = weave[i].cards.slice(j, j + lastCardType.cbLength)
                        if ( cbTakeType && cbTakeType != TAKE_NONE )
                        { 
                            var tempCards = clone(cards)
                            self.RemoveCard(tempCards, tempWeaveCards)
                            var takeCards = self.getTakeCard(tempCards, cbTakeType, tempWeaveCards.length / cbLineSize, lastCardType.wTakeType)
                            if ( takeCards.bSuccess )
                                tempWeaveCards = tempWeaveCards.concat(takeCards.cards)
                        }

                        SearchResult.push(tempWeaveCards)
                    }
                }
            }
        }

        switch(lastCardType.cbType)
        {
            case CT_SINGLE:
                var sameCards = self.GetSameCards(cards, false)
                for ( var i = 0; i < sameCards.length; i++ )
                {
                    if ( sameCards[i].length < 1 || this.GetCardLogicValue(sameCards[i][0]) <= lastCardType.cbLogicValue )
                        continue

                    var sortCards = self.SortCardWithPriorityLv(cards, sameCards[i]).sortCards
                    SearchResult.push([sortCards[0]])
                }
                break
            case CT_PAIR:
                Search(AnalyzeResult.PairWeave)
                break
            case CT_THREE:
                Search(AnalyzeResult.ThreeWeave, THREE_TAKE_TYPE)
                break
            case CT_LINE:
                SearchLine(AnalyzeResult.LineWeave, 1)
                break
            case CT_PAIR_LINE:
                SearchLine(AnalyzeResult.LinePairWeave, 2)
                break
            case CT_THREE_LINE:
                SearchLine(AnalyzeResult.LineThreeWeave, 3, LINE_THREE_TAKE_TYPE)
                break
        }

        if ( typeof(CT_BOMB_TAKE) != 'undefined' && lastCardType.cbType == CT_BOMB_TAKE )
            Search(AnalyzeResult.BombWeave, BOMB_TAKE_TYPE)

        //炸弹
        Search(AnalyzeResult.BombWeave)

        //王炸
        if ( typeof(CT_WANG_ZHA) != 'undefined' )
            Search(AnalyzeResult.WangZhaWeave)

        //同花顺(这里用Search, SearchLine会截断)
        if ( typeof(CT_FLUSH_LINE) != 'undefined' )
            Search(AnalyzeResult.LineFlushWeave)

        //sort---------------------------------------------
        var getMaxPriorityLv = function(weaveCards)
        {
            var PriorityLevel = self.GetPriorityLevel(cards)
            var maxLv = 0
            for ( var i = 0; i < weaveCards.length; i++ )
            {
                var minLv = INVALID_WORD
                var lvIndex = INVALID_BYTE
                for ( var j = 0; j < cards.length; j++ )
                {
                    if ( weaveCards[i] == cards[j] && PriorityLevel[j] < minLv )
                    {
                        lvIndex = j
                        minLv = PriorityLevel[lvIndex]
                    }
                }

                if ( lvIndex != INVALID_BYTE && minLv > maxLv )
                {
                    maxLv = minLv
                    PriorityLevel[lvIndex] = INVALID_WORD
                }
            }

            return maxLv
        }
        
        SearchResult.sort(function(a, b)
        {
            return getMaxPriorityLv(a) - getMaxPriorityLv(b)
        })

        return SearchResult
    },
    SearchOutCard:function(cards, lastCardType, bSelfOut)
    {
        if ( bSelfOut )
            return this.SearchFirstCard(cards)
        else
            return this.SearchCompareCard(cards, lastCardType)
    },
    getTakeCard:function(cardDatas, wTakeType, cbTakeNum, wCompareTakeType)
    {
        if ( cardDatas.length == 0 )
            return { cards:[], bSuccess:true }

        //不带牌
        if ( (wTakeType & TAKE_NONE) && wCompareTakeType == TAKE_NONE )
            return { cards:[], bSuccess:true }

        var self = this
        var cards = clone(cardDatas)
        var PriorityLevel = this.GetPriorityLevel(cards)

        var SearchSingle = function(cbTakeCount)
        {
            cards = self.SortCardWithPriorityLv(cards).sortCards
            if ( cbTakeCount > cards.length )
                cbTakeCount = cards.length

            var takeCards = cards.splice(0, cbTakeCount)
            PriorityLevel = self.GetPriorityLevel(cards)
            var takePriorityLevel = self.GetPriorityLevel(takeCards)
            for ( var i = 0; i < cards.length; i++ )
            {
                var lv = PriorityLevel[i]
                var maxLv = 0
                var maxIndex = -1
                for ( j = 0; j < takeCards.length; j++ )
                {
                    var takeLv = takePriorityLevel[j] || 0
                    if ( Math.floor(lv/100) == Math.floor(takeLv/100) && lv < takeLv && takeLv > maxLv )
                    {
                        maxLv = takeLv
                        maxIndex = j
                    }
                }

                //尽量不拆牌。 例如733，带2张选33而不是73
                if ( maxIndex >= 0 )
                {
                    var temp = cards[i]
                    cards[i] = takeCards[maxIndex]
                    takeCards[maxIndex] = cards[i]
                }
            }

            return { cards:takeCards, bSuccess:takeCards.length > 0 }
        }

        var SearchPair = function(cbTakeCount)
        {   
            var takeCards = []
            var sameCards = self.GetSameCards(cards, false)
            var pairs = []

            for ( var i = 0; i < sameCards.length; i++ )
            {
                if ( sameCards[i].length < 2 )
                    continue

                var sortCardInfo = self.SortCardWithPriorityLv(cards, sameCards[i])
                for ( var n = 0; n < sortCardInfo.sortCards.length - 1; n += 2 )
                {
                    pairs.push({cards:[sortCardInfo.sortCards[n], sortCardInfo.sortCards[n+1]], lv:PriorityLevel[sortCardInfo.sortIndexs[n+1]]})
                }
            }

            pairs.sort(function(a, b)
            {
                return a.lv - b.lv
            })

            //替换财神
            var magicCards = self.GetMagicCards(cards)
            if ( magicCards.length > 0 )
            {
                var magicIndex = 0
                for ( var i = 0; i < pairs.length; i++ )
                {
                   for ( var n = 0; n < pairs[i].cards.length; n++ )
                   {
                        if ( self.IsMagicCard(pairs[i].cards[n]) )
                        {
                            if ( magicIndex < magicCards.length )
                            {
                                pairs[i].cards[n] = magicCards[magicIndex]
                                magicIndex++
                            }
                            else
                            {
                                pairs.splice(i, 1)
                                i--
                            }
                        }
                   }
                }
            }

            if ( cbTakeCount > pairs.length )
            {
                if ( pairs.length * 2 == cards.length )
                    cbTakeCount = pairs.length
                else
                    return
            }

            for ( var i = 0; i < cbTakeCount; i++ )
            {
                takeCards = takeCards.concat(pairs[i].cards) 
            }

            return { cards:takeCards, bSuccess:takeCards.length > 0 }
        }

        var CheckType = function(type)
        {
            if ( wCompareTakeType & type )
                return true

            if ( wCompareTakeType == TAKE_NONE && (wTakeType & type) )
                return true

            return false
        }

        //带1个单牌
        if ( CheckType(TAKE_SINGLE) )
            return SearchSingle(cbTakeNum * 1)

        //带2个单牌
        if ( CheckType(TAKE_SINGLE2) )
            return SearchSingle(cbTakeNum * 2)

        //带3个单牌
        if ( CheckType(TAKE_SINGLE3) )
            return SearchSingle(cbTakeNum * 3)

        //带1个对子
        if ( CheckType(TAKE_PAIR) )
            return SearchPair(cbTakeNum * 1)

        //带2个对子
        if ( CheckType(TAKE_PAIR2) )
            return SearchPair(cbTakeNum * 2)

        return { cards:[], bSuccess:false }
    },
    GetPriorityLevel:function(cardDatas)
    {
        var self = this
        var cards = this.SortCardList(clone(cardDatas))
        var PriorityLevel = []

        var PushPriority = function(cardData, lv)
        {
            for ( var i = 0; i < cardDatas.length; i++ )
            {
                if ( !PriorityLevel[i] && cardDatas[i] == cardData )
                {   
                    PriorityLevel[i] = lv
                    break
                }
            }
        }

        var CalcPriorityLevel = function(weave, cbLineSize, sortValue, bNotCheckSplit)
        {
            if ( weave.length == 0 )
                return false

            sortValue = sortValue || 0
            for ( var i = 0; i < weave.length; i++ )
            {
                if ( cbLineSize > 0 && !bNotCheckSplit )
                {
                    var splitCount = 0
                    for ( var j = 0; j < weave[i].cards.length; j += cbLineSize )
                    {
                        if ( self.GetSameCardCount(cards, weave[i].cards[j]) > cbLineSize )
                            splitCount++
                    }

                    //拆牌不能过半
                    if( splitCount * cbLineSize * 2 >= weave[i].cards.length )
                        continue
                }

                for ( var j = 0; j < weave[i].cards.length; j++ )
                {
                    var logicValue = cbLineSize == 0 ? weave[i].logicValue : (weave[i].logicValue - Math.floor(j / cbLineSize))
                    PushPriority(weave[i].cards[j], logicValue + sortValue)
                    cards.splice(cards.indexOf(weave[i].cards[j]), 1)
                }

                return true
            }

            return false
        }

        while( true )
        {
            var AnalyzeResult = this.AnalyzeCard(cards)

            if( CalcPriorityLevel(AnalyzeResult.WangZhaWeave, 0) )
                continue

            if ( AnalyzeResult.BombWeave.length > 0 )
            {
                var BombWeave1 = []  //小炸弹4-5
                var BombWeave2 = []  //大炸弹6-max
                for ( var i = 0; i < AnalyzeResult.BombWeave.length; i++ )
                {
                    if ( AnalyzeResult.BombWeave[i].cards.length < 6 )
                        BombWeave1.push(AnalyzeResult.BombWeave[i])
                    else
                        BombWeave2.push(AnalyzeResult.BombWeave[i])
                }

                if( CalcPriorityLevel(BombWeave2, 0) )
                    continue

                if( CalcPriorityLevel(AnalyzeResult.LineFlushWeave, 1, 0, true) )
                    continue

                if( CalcPriorityLevel(BombWeave1, 0) )
                    continue
            } 
            else
            {
                if( CalcPriorityLevel(AnalyzeResult.LineFlushWeave, 1, 0, true) ) 
                    continue
            }

            if( CalcPriorityLevel(AnalyzeResult.LineThreeWeave, 3, 500) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.LinePairWeave, 2, 400) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.LineWeave, 1, 300) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.ThreeWeave, 0, 200) )
                continue

            if( CalcPriorityLevel(AnalyzeResult.PairWeave, 0, 100) )
                continue

            break
        }

        //单牌
        for ( var i = 0; i < cards.length; i++ )
            PushPriority(cards[i], this.GetCardLogicValue(cards[i]))

        return PriorityLevel
    },
    SortCardWithPriorityLv:function(cards, subCards)
    {
        var PriorityLevel = this.GetPriorityLevel(cards)
        var sortCardItems = []

        if ( subCards )
        {
            for ( var i = 0; i < subCards.length; i++ )
            {
                var index = cards.indexOf(subCards[i])
                if ( index != -1 )
                {
                    sortCardItems.push({cardData:subCards[i], cardIndex:index})
                }
            }
        }   
        else
        {
             for ( var i = 0; i < cards.length; i++ )
             {
                sortCardItems.push({cardData:cards[i], cardIndex:i})
             }
        }

        sortCardItems.sort(function(a, b)
        {
            if ( PriorityLevel[a.cardIndex] == PriorityLevel[b.cardIndex] )
            {   
                var logicValueA = gameLogic.GetCardLogicValue(a.cardData)
                var logicValueB = gameLogic.GetCardLogicValue(b.cardData) 
                if ( logicValueA == logicValueB )
                    return a.cardData - b.cardData
                else
                    return logicValueA - logicValueB
            }
            else
            {
                return PriorityLevel[a.cardIndex] - PriorityLevel[b.cardIndex]
            }
        })

        var sortCards = []
        var sortIndexs = []
        for ( var i = 0; i < sortCardItems.length; i++ )
        {
            sortCards.push(sortCardItems[i].cardData)
            sortIndexs.push(sortCardItems[i].cardIndex)
        }

        return {sortCards:sortCards, sortIndexs:sortIndexs}
    },
}