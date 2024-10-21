// 就出第一张 对子的话就出前两张 
gameLogic.getTipsArrayForFirstOut = function(cardDatas)
{
    var cardsType = {typeLevel:0, typeScores:0, typeKind:0}
    var tipsArray =  gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(cardDatas), cmdBaseWorker.cbMagicCardData)

    return tipsArray
}

gameLogic.getRed10Count = function(cardDatas)
{
    var count = 0
    for(var i=0;i<cardDatas.length;i++)
    {
        if(cardDatas[i] == 0x0A || cardDatas[i] == 0x2A)
            count++
    }

    return count
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

//单张：从小到大为3、4、5、6、7、8、9、10（只包括黑桃，草花），J，Q，K，A，2，小王，大王，方块10/红桃10。不分花色
//这个要自己写一个分析函数 组件的斗地主算法不分花色
//如果是重写单张 id不要变
var cardType1 = 
{
    id:1,
    name:'danzhang',
    getType:function(typeScores)
    {
        if(typeScores>16 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        var len = l
        if(len>1)
            return false

        for(var typeScores=16;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores))
                continue

            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores)
            if( cardDatas && cardDatas.length == l )
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    },
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores)
    {
        if(typeScores == 16)//红10
        {
            var cardDatas = c_sortedCardDatasExcludeLazi.concat(c_sortedCardDatasOfLaizi)
            for(var i=0;i<cardDatas.length;i++)
            {
                if(cardDatas[i] == 0x0A )
                    return [0x0A]
                if(cardDatas[i] == 0x2A )
                    return [0x2A]
            }
        }

        var num = gameLogic.scores2Num(typeScores)
        var someCardNums_sorted = [num]
        var cardDatas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)[0]
        if(!cardDatas)
            return false

        return cardDatas
    }

}

//特殊：红桃10和方块10组成的一对红10，为最大炸弹。
var cardType2 = 
{
    id:102,
    name:'zhadan',
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
        if(l!=2)
            return false

        var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
        if(cardDatas)
            return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:1,typeKind:this.typeKind} 
        
        return false
    },  
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var cardDatas = c_sortedCardDatasExcludeLazi.concat(c_sortedCardDatasOfLaizi)
        var retIdxs = []
        for(var i=0;i<cardDatas.length;i++)
        {
            if(cardDatas[i] == 0x0A )
                retIdxs[retIdxs.length] = 0x0A
            if(cardDatas[i] == 0x2A )
                retIdxs[retIdxs.length] = 0x2A
        }
        if(retIdxs.length==2)
            return retIdxs
        return false
    }
}

gameLogic.initCardsParser(
[ 
    [
        cardType1,//单张
        {id:1, minLen:3, maxLen:15, minCardNum:1, name:'shunzi'},//顺子
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, name:'duizi'}, //对子
        // {id:2, minLen:3, maxLen:15, minCardNum:1, maxCardNum:13}, //对子
    ], 
    [
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:0, name:'zhadan'},
    ],
    [
        {id:4, name:'zhadan'},
    ], 
    [
        {id:5, type:0, name:'wangzha'},
    ], 
    [
        cardType2,
    ], 
])
