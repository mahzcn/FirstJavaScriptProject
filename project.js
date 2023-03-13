// 1. para yatırma
// 2. bahis yapacağı satır sayısını belirleme
// 3. bahis miktarı belirleme
// 4. slotu döndürme
// 5. kullanıcının kazanıp kazanmadığını kontrol et
// 6. kullanıcıya ödülünü ver
// 7. tekrar oynat

// klavyeden giriş almak için kullanılan fonksiyoun sync 
const prompt = require("prompt-sync")();

//global variable start
const ROWS = 3;
const COLS =3;

const SYMBOLS_COUNT = {
    A : 2,
    B : 4,
    C : 6,
    D : 8
};

const SYMBOLS_VALUES = {
    A : 5,
    B : 4,
    C : 3,
    D : 2
}

//global variable end

//1. para yatırma
const deposit = () => {
    while(true){
    const depositAmount = prompt("Enter a deposit amount : ");
    const numberDepositAmount = parseFloat(depositAmount);
    if(isNaN(numberDepositAmount) || numberDepositAmount <=0){
        console.log("Invalid deposit amount , try again");
    }else{
        return numberDepositAmount;
    }
}
};

// 2. bahis yapacağı satır sayısını belirleme
const getNumberOfLines = () => {
    while(true){
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);
    if(isNaN(numberOfLines) ||numberOfLines <=0|| numberOfLines >3){
        console.log("Invalid number of lines , try again");
    }else{
        return numberOfLines;
    }
}
};

// 3. bahis miktarı belirleme
const getBet = (balance , lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) ||numberBet <=0|| numberBet > balance / lines){
            console.log("Invalid bet, try again");
        }else{
            return numberBet;
        }
    }
}

// 4. slotu döndürme
const spin  = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0;i< count;i++){
            symbols.push(symbol);
        }
    }

    const reels =[];
    for(let i =0;i<COLS;i++){
            reels.push([]);
        const reelSymbols =[...symbols];
        for(let j =0;j <ROWS;j++){
            const randomIndex = Math.floor(Math.random()* reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex,1);
        }
    }
    return reels;
};

//slottaki satırların düzgün gözükmesi için transpozesini alma
const transpose = (reels) =>{
    const rows = [];

    for (let i = 0; i< ROWS;i++){
        rows.push([]);
        for(let j = 0;j < COLS;j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

// satırları yazdırma
const printRows = (rows) =>{
    for(const row of rows){
        let rowString = "";
        for(const [i,symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length -1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// 5. kullanıcının kazanıp kazanmadığını kontrol et
const getWinnings = (rows, bet,lines ) => {
    let winnings = 0;

    for(let row = 0;row < lines;row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if(symbol != symbols[0]){
                allSame= false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }

    }
    return winnings;
}

const game = () => {
    let balance =deposit();

    while (true) {
    console.log("You have a balance of $"+balance);
    const numberOfLines = getNumberOfLines();   
    const bet = getBet(balance,numberOfLines);
    balance -= bet * numberOfLines;    
    const reels =spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows,bet,numberOfLines);

    // 6. kullanıcıya ödülünü ver
    balance += winnings;
    console.log("You won ,$"+winnings.toString());   
    if(balance <=0){
        console.log("You ran out of money!");
        break;
    }
    // 7. tekrar oynat
    const playAgain = prompt("Do you want to play again (y/n)?")
    if(playAgain !="y")break;
}
};
game();
