


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


var wangCardType = 
{   
    // typeLevel:0,
    // typeKind:0,
    // typeIdx:0,
    id:101,
    name:'sanwang',
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
        var length = 3
        is = l == length 
        if(!is)
            return false

        if(c_sortedCardDatasExcludeLazi.length != 0 && c_sortedCardDatasExcludeLazi[0] != 78)
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

        if(_79Num + _78Num < 3)
            return false

        switch(_79Num)
        {
            case 1:
            {
                return [79,78,78]
                break
            }
            case 2:
            {
                return [79, 79, 78]
                break
            }
        }
        return false
    }
}

var c1 = clone(wangCardType)

//3的score 为1
//'sange' 的kind = 4
//level = 1
//idx = 501 ???   (45678  --> 205)
// lianzhaCardType = 
// {
//     id:102,
//     name:'lianzha',//单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
//     minLen:3,
//     maxLen:6,
//     minCardCount:4,      //相同牌的最小张数
//     getType:function(typeScores, typeIdx)
//     {
//         return false
//     },
//     parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
//     {   
//         var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
//         if(l < 12)
//             return false

//         var sortOutlaizi = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//         var sortOutlaiziCardData = clone(c_sortedCardDatasExcludeLazi)
//         var maxCount = 0

//         for(var i = 0;i<c_sortedCardDatasExcludeLazi.length;i++)
//         {
//             var cardData = c_sortedCardDatasExcludeLazi[i]
//             var cardNum = cardLogic.getNum(cardData)

//             maxCount = sortOutlaizi[cardNum]

//             sortOutlaizi[cardNum]++

//             if(maxCount < sortOutlaizi[cardNum])
//                 maxCount = sortOutlaizi[cardNum]
//         }

//         var needlaiSum = 0
//         var len = 0
//         var typeScore = 0
//         var cardDatas = []

//         for(var i = 0;i<sortOutlaizi.length;i++)
//         {
//             if(sortOutlaizi[i] == 0)
//                 continue

//             if(typeScore == 0)
//                 typeScore = i
//             else if(i - typeScore != len)
//                 return false


//             needlaiSum = needlaiSum + maxCount - sortOutlaizi[i]
//             len++
//             for(var j=0;j<sortOutlaiziCardData.length;j++)
//             {
//                 var cardData = sortOutlaiziCardData[j]
//                 var cardNum = cardLogic.getNum(cardData)
//                 if(cardNum == i)
//                 {
//                     if(cardDatas.length > 0)
//                     {
//                         if(cardDatas[cardDatas.length - 1] != cardData && cardDatas.length  != maxCount && c_sortedCardDatasOfLaizi.length > 0)
//                             cardDatas[cardDatas.length] = c_sortedCardDatasOfLaizi[0]
//                     }
//                     cardDatas[cardDatas.length] = cardData
//                     sortOutlaiziCardData.splice(j,1)
//                     j--
//                 }
//             }
//         }

//         if(needlaiSum != c_sortedCardDatasOfLaizi.length || maxCount < this.minCardCount)
//             return false

//         if(len <this.minLen || len > this.maxLen)
//             return false

//         var typeLevel = maxCount + len == 7?6:maxCount + len
//         var typeKind = 0
//         var typeIdx = typeLevel * 100

//         //var typeIdx = this.typeIdx + maxCount 星级差的typeIdx 4炸是700
//         //
//         return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:typeLevel, typeScores:typeScore,typeKind:typeKind} 



        
//         return false
//     }, 
//     getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
//     {
//         return false
//     }
// }

// var c2 = clone(lianzhaCardType)
// 
lianzhaCardType = 
{
    id:102,
    name:'lianzha',//单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    cardlength:12,
    minLen:4,
    maxLen:8,      //相同牌的张数
    typeIndex:7,  //炸弹星数 7星 8星 9星 10星 11星
    maxCount:0,  //相同牌的最大数量(当前状态)
    getType:function(typeScores)
    {
       if(typeScores>13)
            return false
        else 
            return {typeIdx:this.typeIdx + this.cardlength, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {   
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length

        if(l != this.cardlength)
            return false

        var sortOutlaizi = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        this.maxCount = 0

        for(var i = 0;i<c_sortedCardDatasExcludeLazi.length;i++)
        {
            var cardData = c_sortedCardDatasExcludeLazi[i]
            var cardNum = cardLogic.getNum(cardData)

            sortOutlaizi[cardNum]++

            if(this.maxCount < sortOutlaizi[cardNum])
                this.maxCount = sortOutlaizi[cardNum]
        }

        if(this.maxCount < this.minLen || this.maxCount > this.maxLen)
            return false

        var typeIdx = l + this.typeIdx

        for(var typeScores=13;typeScores>=1;typeScores--)
        {
            this.typeScores = typeScores
            if(!this.getType(typeScores,typeIdx))
                continue
            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores,typeIdx)
            if(cardDatas && cardDatas.length == l)
            {
                return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:this.typeIdx + this.cardlength, typeLevel:this.typeLevel, typeScores:this.typeScores,typeKind:this.typeKind} 
            }
        }

        return false
    }, 
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi,typeScores,typeIdx)
    {
        if(typeScores < 3)
            return false

        var len = typeIdx - this.typeIdx

        var maxTypeScore = -1
        var cardDatas

        for(var i = this.minLen;i<= this.maxLen;i++)
        {   

            if(len%i != 0)
                continue

            var someCardNums_sorted = cardLogic.sortWithNum( gameLogic.getContinueCardNums(typeScores, len/i,i ) )
            //console.log("lianzhaCardType :: someCardNums_sorted :: ",someCardNums_sorted)
            var isHas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)
            //console.log("lianzhaCardType :: isHas :: ",isHas)
            //var cardDatas = isHas[0]


            if(isHas[0])
            {

                if(maxTypeScore < someCardNums_sorted[someCardNums_sorted.length - 1] )
                {
                    cardDatas = isHas[0]
                    maxTypeScore = someCardNums_sorted[someCardNums_sorted.length - 1]
                }
            }

        }

        if(maxTypeScore > 0)
        {
            this.typeScores = maxTypeScore
            return cardDatas
        }

        return false

    }
}

var c2 = clone(lianzhaCardType)
c2.maxLen = 4

var c3_1 = clone(lianzhaCardType)
c3_1.typeIndex = 8
c3_1.cardlength = 16
c3_1.maxLen = 4
var c3_2 = clone(lianzhaCardType)
c3_2.typeIndex = 8
c3_2.cardlength = 15
c3_2.maxLen = 5
c3_2.minLen = 5

var c4_1 = clone(lianzhaCardType)
c4_1.typeIndex = 9
c4_1.maxLen = 6
c4_1.minLen = 6
c4_1.cardlength = 18
var c4_2 = clone(lianzhaCardType)
c4_2.typeIndex = 9
c4_2.cardlength = 20
c4_2.maxLen = 5

var c5_1 = clone(lianzhaCardType)
c5_1.typeIndex = 10
c5_1.maxLen = 7
c5_1.minLen = 7
c5_1.cardlength = 21
var c5_2 = clone(lianzhaCardType)
c5_2.typeIndex = 10
c5_2.maxLen = 6
c5_2.cardlength = 24
var c5_3 = clone(lianzhaCardType)
c5_3.typeIndex = 10
c5_3.maxLen = 5
c5_3.minLen = 5
c5_3.cardlength = 25

var c6 = clone(lianzhaCardType)
c6.typeIndex = 11
c6.minLen = 8
c6.cardlength = 24





gameLogic.initCardsParser(
[ 
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'danzhang'},
        {id:1, name:'shunzi'},
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'duizi'},
        {id:2, minLen:3, name:'liandui'},
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:0, name:'sange'},
        // {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:1, name:'sandaiyi'},
        // {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:2, name:'sandaiyidui'},
        {id:3, type:0,minLen:3, name:'feiji'},
        // {id:3, type:1, name:'feiji'},
        // {id:3, type:2, name:'feiji'},
        // c1,
        // c2,
    ], 
    [
        {id:4, length:4, name:'zhadan'},
    ], 
    [
        {id:4, length:5, name:'zhadan'},
    ], 
    [
        c1,
    ],
    [
        {id:4, length:6, name:'zhadan'},
    ],
    [
        c2,
    ], 
    [
        {id:4, length:7, name:'zhadan'},
    ],
    [
        {id:5, type:1,name:'wangzha'},
    ],
    [
        c3_1,
    ],
    [
        c3_2,
    ],
    [
        {id:4, length:8, name:'zhadan'},
    ],
    [
        c4_1,
    ],
    [
        c4_2,
    ],
    [
        {id:4, length: 9, type:2, name:'zhadan'},
    ], 
    [
        c5_1,
    ],
    [
        c5_2,
    ],
    [
        c5_3,
    ],
    [
        {id:4, length: 10, type:2, name:'zhadan'},
    ],
    [
        c6,
    ], 
    
])

