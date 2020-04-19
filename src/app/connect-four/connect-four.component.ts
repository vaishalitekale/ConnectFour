import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.css']
})
export class ConnectFourComponent implements OnInit {
  private rowData = [0,0,0,0,0,0];
  private columnData = [0,0,0,0,0,0,0];
  private maxMoves: Number = 42;
  private currentPlayer = 'Player1';
  private finalResult = '';
  private winnerFlag: boolean = false;
  private Player1Obj = [];
  private Player2Obj = [];
  
  constructor() { }

  ngOnInit() {
  }

  setColor(columnIndex) {
    //calculate horizontalIndex
    let rowIndex = 0;
    this.finalResult='';
    if(this.Player1Obj.length === 0 && this.Player2Obj.length === 0 ) {
      rowIndex = this.rowData.length - 1;
    } else {
      const player1Count = this.Player1Obj.filter(function(player1) { 
        return player1.verticalIndex == columnIndex 
      }).length;
      const player2Count = this.Player2Obj.filter(function(player2) { 
        return player2.verticalIndex == columnIndex 
      }).length;
      rowIndex = (this.rowData.length - 1) - (player1Count + player2Count);
    }

    const obj = {
      'horizontalIndex': rowIndex,
      'verticalIndex': columnIndex
    }
    if (this.currentPlayer === 'Player1') {
      this.Player1Obj.push(obj);
    } else {
      this.Player2Obj.push(obj);
    }
    // set color according to Player
    this.checkStyles(rowIndex, columnIndex); 

    // check if any one wins
    this.checkWinner(rowIndex);

    // set Player for next turn
    this.currentPlayer = this.setPlayer(this.currentPlayer);
  }

  checkStyles(rowIndex, columnIndex) { 
    const player1Found = this.Player1Obj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
    const player2Found = this.Player2Obj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
    const element = (<HTMLInputElement>document.getElementById(rowIndex+'-'+columnIndex));
    if (player1Found === -1 && player2Found !== -1) {
      element.style.animation = 'player2 0.3s';
      element.setAttribute("class", 'baseIndicator player2Indicator');
    } else {
      element.style.animation = 'player1 0.3s';
      element.setAttribute("class", 'baseIndicator player1Indicator');
    }
  }
 
  setPlayer(currentPlayer: any) {
    return currentPlayer === 'Player1' ? 'Player2' : 'Player1';
  }

  checkWinner(rowIndex: number) {
    const finalObj = this.currentPlayer === 'Player1' ? this.Player1Obj : this.Player2Obj;
    // find horizontal
    if ( this.checkHorizontal(finalObj) || this.checkDiagonalWin(finalObj, rowIndex) || this.checkVertical(finalObj) ){
        this.finalResult = 'Winner is ' + this.currentPlayer;
        this.resetGame();
    } else {
      // check if no one wins 
      if (this.checkMatchDraw()) {
          this.finalResult = 'Match Draw, Play Again';
          this.resetGame();
      }
    }
  }

  checkHorizontal(finalObj: any) { 
    let consecutiveMoves = 0;
    const countToWin = 4;
    for (let rowIndex = (this.rowData.length - 1); rowIndex >= 0; rowIndex--) {
      for (let columnIndex = 0; columnIndex < this.columnData.length; columnIndex++) {
        const checkEntry = finalObj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
        if (checkEntry !== -1) {
          consecutiveMoves += 1;
        } else {
          // Reset the count if found gap
          consecutiveMoves = 0;
        }
        if (consecutiveMoves === countToWin) {
          this.winnerFlag = true;
        }
      }

      // After each row, reset the consecutiveMoves
      consecutiveMoves = 0;
    }

    // No horizontal win was found.
    return this.winnerFlag;
  }

  checkVertical(finalObj: any) { 
    let consecutiveMoves = 0;
    const countToWin = 4;
    for (let columnIndex = 0; columnIndex < this.columnData.length; columnIndex++) {
      for (let rowIndex = (this.rowData.length - 1); rowIndex >= 0; rowIndex--) {
        const checkEntry = finalObj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
        if (checkEntry !== -1) {
          consecutiveMoves += 1;
        } else {
          // Reset the count if found gap
          consecutiveMoves = 0;
        }
        if (consecutiveMoves === countToWin) {
          this.winnerFlag = true;
        }
      }

      // After each column, reset the consecutiveMoves
      consecutiveMoves = 0;
    }

    // No vertical win was found.
    return this.winnerFlag;
  }

  checkDiagonalWin(finalObj: any, rowIndex: number) {
    let consecutiveMoves = 0;
    const countToWin = 4;
    const minRowIndex = 2;
    // check right diagonal
    
      for (let indexRow = (this.rowData.length - 1); indexRow >= minRowIndex; indexRow--) {
        if (!this.winnerFlag) {
        const foundObj = finalObj.filter((x: any) => x.horizontalIndex === indexRow);
        foundObj.forEach(objFound => {
          let columnIndex = objFound.verticalIndex;
          let rowIndex = objFound.horizontalIndex;


          while (rowIndex >= 0) {
            const checkEntry = finalObj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
            if (checkEntry !== -1) {
              consecutiveMoves += 1;
              if (consecutiveMoves === countToWin) {
                this.winnerFlag = true;
              }
            }
            else {
              // reset consecutiveMoves to 0 if found gap
              consecutiveMoves = 0;
            }
            columnIndex ++;
            rowIndex --;
          }
          // Reset the count after each iteration
          consecutiveMoves = 0;
        });
        }
    }
    // check diagonal on other side
      for (let indexRow = (this.rowData.length - 1); indexRow >= minRowIndex; indexRow--) {
        if (!this.winnerFlag) {
        const foundObj = finalObj.filter((x: any) => x.horizontalIndex === indexRow);
        foundObj.some(objFound => {
          let columnIndex = objFound.verticalIndex;
          let rowIndex = objFound.horizontalIndex;
          
          while (rowIndex >= 0) {
            const checkEntry = finalObj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
            if (checkEntry !== -1) {
              consecutiveMoves += 1;
              if (consecutiveMoves === countToWin) {
                this.winnerFlag = true;
              }
            }
            else {
              // After each interation, reset the consecutiveMoves
              consecutiveMoves = 0;
            }
            columnIndex --;
            rowIndex --;
          }
          // Reset the count after each iteration
          consecutiveMoves = 0;
        });
      }
    }
    return this.winnerFlag;
  }
  resetGame() {
    this.Player1Obj = [];
    this.Player2Obj = [];
    this.winnerFlag = false;
    this.currentPlayer = 'Player1';
    for (let columnIndex = 0; columnIndex < this.columnData.length; columnIndex++) {
      for (let rowIndex = 0; rowIndex < this.rowData.length; rowIndex++) {
        const element = (<HTMLInputElement>document.getElementById(rowIndex+'-'+columnIndex));
          element.setAttribute("class", 'baseIndicator');
      }
    }
  }
  checkMatchDraw() {
    const matchDraw = this.Player1Obj.length + this.Player2Obj.length;
    return matchDraw === this.maxMoves ? true : false;
  }
}
