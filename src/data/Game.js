export default class Game {
  constructor (boardSize) {
    this.boardSize = boardSize
    this.x = new PlayerData(boardSize)
    this.o = new PlayerData(boardSize)
  }

  makeMove (character, i, j) {
    this[character].rows[i].push([i, j])
    this[character].columns[j].push([i, j])

    if (i === j) {
      this[character].mainDiagonal.push([i, j])
    }

    if (i + j === this.boardSize - 1) {
      this[character].secondaryDiagonal.push([i, j])
    }
  }

  getFillBoardlength () {
    return this.fillBoardLoop(this.x) + this.fillBoardLoop(this.o)
  }

  fillBoardLoop (char) {
    let boardLenght = 0

    for (let el in char.rows) {
      boardLenght += char.rows[el].length
    }
    return boardLenght
  }
  power (a, b, obj) {
    
      if(a > 0 && b > 0){
        obj["min"] = 0
        obj["max"] = 0
      }
      if(a == 0 && b == 1){
        obj["min"] = 10
        obj["max"] = -10
      }
      if(a == 1 && b == 0){
        obj["min"] = -10
        obj["max"] = 10
      }
      if(a == 0 && b == 2){
        obj["min"] = 100
        obj["max"] = -100
      }
      if(a == 2 && b == 0){
        obj["min"] = -100
        obj["max"] = 100
      }
  }
  pushRowsColumn (array, data, prop, player) {
    for(let el in array){
      let numX = 0;
      let numO = 0;
      const lData = data[prop][el]["arr"];
      for( let i = 0; i < array[el].length; i++) {
        let index = -1;
        const arr = array[el][i];
        
        for(let j = 0; j < lData.length; j++){
          if(arr[0] == lData[j][0] && arr[1] == lData[j][1]){
            index = j; 
          }
        }

        lData[index] = player
      }
      lData.forEach(item => {
        if(item == "X"){
          numX++
        }
        if(item == "O"){
          numO++
        }
      })
      this.power(numX, numO, data[prop][el])
      
    }
  }
  pushDiaganals (array, data, prop, player) {
    let numX = 0;
    let numO = 0;
    const lData = data[prop]["arr"];
    for( let i = 0; i < array.length; i++) {
      let index = -1;
      const arr = array[i];
      
      for(let j = 0; j < lData.length; j++){
        if(arr[0] == lData[j][0] && arr[1] == lData[j][1]){
          index = j; 
        }
      }
      lData[index] = player
    }
    lData.forEach(item => {
      if(item == "X"){
        numX++
      }
      if(item == "O"){
        numO++
      }
    })
    this.power(numX, numO, data[prop])
  }
  pushXinLogicData (data, logicData, player) {
    this.pushRowsColumn(data["rows"],logicData, "rows", player)
    this.pushRowsColumn(data["columns"],logicData, "columns", player)
    this.pushDiaganals(data["mainDiagonal"],logicData, "mainDiagonal", player)
    this.pushDiaganals(data["secondaryDiagonal"],logicData, "secondaryDiagonal", player)

    console.log(logicData);
  }

  board (n) {
    

    // console.log(data)
    const board = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        board.push([i, j])
      }
    }
    return board
  }

  delBordEl (char, boardArr) {
    for (let el in char.rows) {
      char.rows[el].forEach( item => {
        boardArr.forEach( el => {
          if(el[0] == item[0] && el[1] == item[1]){
            boardArr.splice(boardArr.indexOf(el),1)
          }
        }) 
      })
    }
  }

  pushArr(objArr,arr){
    for(var i = 0; i < objArr.length; i++){
      if(objArr[i] == "X" || objArr[i] == "O"){
        continue;
      }
      arr.push(objArr[i]);
    }
  }

  getCurrentBoard () {
    const data = new logicData(this.boardSize)
    this.pushXinLogicData(this.x, data, "X")
    this.pushXinLogicData(this.o, data, "O")

    var arrayWin = [];
    var arrayNWin = [];
    var arrayO = [];
    var arrayX = [];
    var empty = [];
    var noWinner = [];

    var obj = {
      arrMin:[]
    }
    for(let el in data){
      // console.log(data[el]);
      if(el != "mainDiagonal" && el != "secondaryDiagonal"){
        for(let key in data[el]){


          if(data[el][key]["min"] == 100){
            this.pushArr(data[el][key]["arr"],arrayWin)
          }

          if(data[el][key]["min"] == -100){
            this.pushArr(data[el][key]["arr"],arrayNWin)
          }

          if(data[el][key]["min"] == 10){
            this.pushArr(data[el][key]["arr"],arrayO)
          }

          if(data[el][key]["min"] == -10){
            this.pushArr(data[el][key]["arr"],arrayX)
          }

          if(data[el][key]["min"] == 1){
            this.pushArr(data[el][key]["arr"],empty)
          }

          if(data[el][key]["min"] == 0){
            this.pushArr(data[el][key]["arr"],noWinner)
          }

        }
      } else {

        if(data[el]["min"] == 100){
          this.pushArr(data[el]["arr"],arrayWin)
        }

        if(data[el]["min"] == -100){
          this.pushArr(data[el]["arr"],arrayNWin)
        }

        if(data[el]["min"] == 10){
          this.pushArr(data[el]["arr"],arrayO)
        }

        if(data[el]["min"] == -10){
          this.pushArr(data[el]["arr"],arrayX)
        }

        if(data[el]["min"] == 1){
          this.pushArr(data[el]["arr"],empty)
        }

        if(data[el]["min"] == 0){
          this.pushArr(data[el]["arr"],noWinner)
        }
      }
    }
    console.log("obj",obj)

    let arrX = arrayX.filter(item => item[0] == item[1] && item[0] + item[1] == this.boardSize-1)
    if(arrX.length == 0){
      arrX = arrayX.filter(item => item[0] == item[1] || item[0] + item[1] == this.boardSize-1)
    }
    

    console.log("arrayWin: ", arrayWin);
    console.log("arrayNWin: ", arrayNWin);
    // console.log("arrO: ", arrO);
    console.log("arrX: ", arrX);
    console.log("empty: ", empty);

    

    if(arrayWin.length > 0){
      return arrayWin;
    }
    if(arrayNWin.length > 0){
      return arrayNWin;
    }
    if( data["mainDiagonal"]["min"]<1 || data["secondaryDiagonal"]["min"]<1 ){
      let arrO = arrayO.filter(item => item[0] == item[1] && item[0] + item[1] == this.boardSize-1)
      if(arrO.length == 0){
        arrO = arrO.filter(item => item[0] == item[1] || item[0] + item[1] == this.boardSize-1)
      }
      if(arrO.length > 0){
        return arrO;
      }
    }
    if( data["mainDiagonal"]["min"]>1 || data["secondaryDiagonal"]["min"]>1 ){
      let arrO = arrayO.filter(item => item[0] != item[1] && item[0] + item[1] != this.boardSize-1)
      if(arrO.length > 0){
        return arrO;
      }
    }

    if(arrX.length > 0){
      return arrX;
    }
    
    
    if(empty.length > 0){
      return empty;
    }
    if(noWinner.length > 0){
      return noWinner;
    }

    
    const board = this.board(this.boardSize)
    this.delBordEl(this.x, board)
    this.delBordEl(this.o, board)
    console.log("board: ", board);
    return board;
  }

  getMaxLegth (character, i, j) {
    return Math.max(
      this[character].rows[i].length,
      this[character].columns[j].length,
      this[character].mainDiagonal.length,
      this[character].secondaryDiagonal.length
    )
  }
}

class PlayerData {
  constructor (boardSize) {
    this.rows = this.getRowsColumnsData(boardSize)
    this.columns = this.getRowsColumnsData(boardSize)
    this.mainDiagonal = []
    this.secondaryDiagonal = []
  }

  getRowsColumnsData (boardSize) {
    const object = {}
    for (let i = 0; i < boardSize; i++) {
      object[i] = []
    }
    return object
  }
}

class logicData {
  constructor (boardSize) {
    this.rows = this.getRowsData(boardSize)
    this.columns = this.getColumnsData(boardSize)
    this.mainDiagonal = this.getMainDiaganalData(boardSize)
    this.secondaryDiagonal = this.getSecondDiaganalData(boardSize)
  }

  getRowsData (boardSize) {
    const object = {}
    for (let i = 0; i < boardSize; i++) {
      const obj = { arr: [], min: 1, max: 1}
      for(let j = 0; j < boardSize; j++) {
        obj["arr"][j] = [i,j];
      }
      object[i] = obj
    }
    return object
  }

  getColumnsData (boardSize) {
    const object = {}
    for (let i = 0; i < boardSize; i++) {
      const obj = { arr: [], min: 1, max: 1}
      for(let j = 0; j < boardSize; j++) {
        obj["arr"][j] = [j,i];
      }
      object[i] = obj
    }
    return object
  }

  getMainDiaganalData (boardSize) {
    const obj = { arr: [], min: 1, max: 1}
    for (let i = 0; i < boardSize; i++) {
      for(let j = 0; j < boardSize; j++) {
        if(i == j){
          obj["arr"][j] = [i,j];
        }
      }
    }
    return obj
  }

  getSecondDiaganalData (boardSize) {
    const obj = { arr: [], min: 1, max: 1}
    for (let i = 0; i < boardSize; i++) {
      for(let j = 0; j < boardSize; j++) {
        if( i + j == boardSize-1 ){
          obj["arr"][j] = [i,j];
        }
      }
    }
    return obj
  }

}
