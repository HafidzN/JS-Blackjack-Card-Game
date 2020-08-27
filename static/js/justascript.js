const blackjackGame = {
    'you'     :{'scoreSpan':'#your-blackjack-result',   'div':'#your-box',   'score': 0},
    'dealer'  :{'scoreSpan':'#dealer-blackjack-result', 'div':'#dealer-box', 'score':0},
    'cards'   :['2', '3','4','5','6', '7', '8', '9','10', 'J', 'Q','K', 'A'],
    'cardsMap':{'2':2, '3':3,'4':4,'5':5,'6':6, '7':7, '8':8, '9':9, '10':10, 'J':10, 'Q':10,'K':10, 'A':[1,11] },
    'wins'    :0,
    'loses'   :0,
    'draws'   :0,
    'isStand' :false,
   'turnsOver':false
}

const YOU    = blackjackGame['you']
const DEALER = blackjackGame['dealer'] 

const hitSound = new Audio('static/sounds/swish.m4a')
const winSound = new Audio('static/sounds/cash.mp3')
const loseSound= new Audio('static/sounds/aww.mp3')

const showCard = (card, activePlayer) => {
    if (activePlayer['score']<=21){
        let cardImage = document.createElement('img')
        cardImage.src = `static/images/${card}.png`
        document.querySelector(activePlayer['div']).appendChild(cardImage)
        hitSound.play()    
    }
}

const blackjackhit = () => {
    if (blackjackGame['isStand'] === false){
        let card = randomCard()
        showCard(card, YOU)
        updateScore(card, YOU)
        showScore(YOU)
    }
}

const blackjackdeal = () => {    
    if (blackjackGame['turnsOver']===true){
        // showResult(computeWinner())
        blackjackGame['isStand'] = false

        let yourImages = document.querySelector('#your-box').querySelectorAll('img')
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img')

        for (let i=0; i<yourImages.length;i++){
            yourImages[i].remove()
        }

        for (let i=0; i<dealerImages.length;i++){
            dealerImages[i].remove()
        }

        YOU['score'] = 0
        DEALER['score'] = 0

        document.querySelector(YOU['scoreSpan']).style.color = 'white'
        document.querySelector(DEALER['scoreSpan']).style.color = 'white'
        // showScore(YOU)
        // showScore(DEALER)
        document.querySelector(YOU['scoreSpan']).textContent = 0
        document.querySelector(DEALER['scoreSpan']).textContent = 0      

        // document.getElementById('draw').textContent = blackjackGame['draws']

        document.querySelector('#blackjack-result').textContent = `Let's play` 
        document.querySelector('#blackjack-result').style.color = 'black'

        blackjackGame['turnsOver'] = true

    }
}

const randomCard = () => {
    return blackjackGame['cards'][Math.floor(Math.random()*13)]
}

const updateScore = (card, activePlayer) => {
    activePlayer['score'] += card==='A'? activePlayer['score']+11> 21? blackjackGame['cardsMap'][`${card}`][0]:blackjackGame['cardsMap'][`${card}`][1]: blackjackGame['cardsMap'][`${card}`]
}

const showScore = (activePlayer) => {
    if(activePlayer['score']>21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!!!'
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red'             
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']  
    }
}

const sleep = (ms) =>  {
    return new Promise(resolve => setTimeout(resolve, ms))
}


const dealerLogic =  async () => {
    blackjackGame['isStand'] = true

    while (DEALER['score']<16 && blackjackGame['isStand'] === true){
        let card = randomCard()
        showCard(card,DEALER)
        updateScore(card, DEALER)
        showScore(DEALER)
        await sleep(1000)
    }

        blackjackGame['turnsOver'] = true
        let winner = computeWinner()
        showResult(winner)

}



const computeWinner = () => {
    let winner

    if (YOU['score'] <= 21){
        if (YOU['score'] > DEALER['score'] || DEALER['score']>21){
            winner = YOU
            blackjackGame['wins']++
        } else
        if (YOU['score'] <DEALER['score']){
            winner = DEALER       
            blackjackGame['loses']++
        } else
        if (YOU['score']=== DEALER['score']){
            blackjackGame['draws']++
        }
    } else 
    if (YOU['score']> 21 && DEALER['score']<=21){
        winner = DEALER
        blackjackGame['loses']++
    } else 
    if (YOU['score']>21 && DEALER['score']>21){
        blackjackGame['draws']++
    }


    return winner
}

const showResult = (winner) => {
    let message, messageColor

    if (blackjackGame['turnsOver'] === true){
        if(winner === YOU){
            document.getElementById('wins').textContent = blackjackGame['wins']
            message = 'You won!!'
            messageColor = 'yellow'
            winSound.play()
        } else 
        if(winner === DEALER){
            document.getElementById('losses').textContent = blackjackGame['loses']
            message = 'You lost!!'
            messageColor = 'red'
            loseSound.play()
        } else {
            document.getElementById('draw').textContent = blackjackGame['draws']
            message = 'Draw!!'
            messageColor= 'black'
        }

        document.querySelector('#blackjack-result').textContent = message
        document.querySelector('#blackjack-result').style.color = messageColor
    }
}


document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackhit)
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic)
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackdeal)