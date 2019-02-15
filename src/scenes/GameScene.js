import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'
import { gameConfig } from '../constants/GameConfig'
import Game from '../data/Game'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
    this.boardSize = 3
    this.spaceSize = 10
    this.gameData = new Game(this.boardSize)
  }

  getPlatformSize () {
    this.platform = this.add.image(0, 0, 'platform')
    const { width } = this.platform
    this.platform.destroy()
    return width
  }

  create () {
    // main game
    this.boardContainer = this.add.container(0, 0)
    let arr = []
    for (let i = 0; i < this.boardSize; ++i) {
      for (let j = 0; j < this.boardSize; ++j) {
        const platformContainer = this.add.container(
          i * (this.getPlatformSize() + this.spaceSize),
          j * (this.getPlatformSize() + this.spaceSize),
        )
        const platform = this.add.image(0, 0, 'platform')
        platformContainer.setInteractive(
          new Phaser.Geom.Rectangle(
            -platform.width / 2,
            -platform.height / 2,
            platform.width,
            platform.height,
          ),
          Phaser.Geom.Rectangle.Contains,
        )
        platformContainer.add(platform)
        this.boardContainer.add(platformContainer)
        platformContainer.setData({ i, j })
        arr=[i,j]
      }
    }
    this.input.on('gameobjectdown', this.drawSymbol.bind(this), false)

    this.boardContainer.x =
      (gameConfig.width - (this.boardSize-1) * (this.getPlatformSize() + this.spaceSize)) / 2
    this.boardContainer.y =
      (gameConfig.height - (this.boardSize-1) * (this.getPlatformSize() + this.spaceSize)) / 2

    let random = Math.floor(Math.random() * 2);
    if(random == 0){
      this.comp()
    }
    console.log(random);
  }
  
  drawSymbol (pointer, target) {
    const image = this.add.image(0, 0, 'x')
    const [i, j] = target.getData(['i', 'j'])
    target.add(image)
    target.removeInteractive()

    this.findWinner('x', i, j)
    this.comp()
  }

  findWinner (str,a,b) {
    this.gameData.makeMove(str, a, b)
    const maxLength = this.gameData.getMaxLegth(str, a, b)
    const getFillBoardlength = this.gameData.getFillBoardlength()
    if (getFillBoardlength === this.boardSize * this.boardSize) {
      this.noWinner()
    }
    if (maxLength === this.boardSize) {
      this.winner(str)
      this.win = true
    }
    this.gameData.getCurrentBoard()
    // console.log(this.gameData.getCurrentBoard());
  }

  comp () {
    const currentBoard = this.gameData.getCurrentBoard() 
    if(currentBoard.length == 0 || this.win){
      return
    }
    let random = Math.floor(Math.random() * currentBoard.length);
    let countBoard;
    this.boardContainer.list.forEach((item, index) => {
      if( currentBoard[random] && item.data.list.i == currentBoard[random][0] && item.data.list.j == currentBoard[random][1] ){
        countBoard = index
      }
    })
    const o = this.add.image(0, 0, 'o')
    this.boardContainer.list[countBoard].add(o)
    this.findWinner('o', currentBoard[random][0], currentBoard[random][1])
  }

  noWinner () {
    const noWinner = this.add.text(0, 100, 'No Winner', {
      font: '25px Arial',
      fill: '#fff',
    })
    noWinner.setStroke('#292929', 16)
    noWinner.setShadow(2, 2, '#743f4a', 2, true, true)
    noWinner.setX((gameConfig.width - noWinner.width) / 2)
  }

  winner (str) {
    const winner = this.add.text(0, 100, `The winner is ${str}`, {
      font: '25px Arial',
      fill: '#fff',
    })
    winner.setStroke('#292929', 16)
    winner.setShadow(2, 2, '#743f4a', 2, true, true)
    winner.setX((gameConfig.width - winner.width) / 2)

    this.scene.pause(SCENE_GAME)
  }

  update () {}
}
