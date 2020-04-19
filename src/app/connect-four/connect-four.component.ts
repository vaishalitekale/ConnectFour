import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-connect-four',
  templateUrl: './connect-four.component.html',
  styleUrls: ['./connect-four.component.css']
})
export class ConnectFourComponent implements OnInit {
  private rowCount = 5;
  private columnCount = 6;
  private rowData = [1,2,3,4,5,6];
  private columnData = [1,2,3,4,5,6,7];
  private currentPlayer = 'Player1';
  private winnerFlag: boolean = false;
  private Player1Obj = [];
  private Player2Obj = [];
  
  constructor() { }

  ngOnInit() {
  }

  setColor(columnIndex) {
    //calculate horizontalIndex
    let count = 0;
    if(this.Player1Obj.length === 0 && this.Player2Obj.length === 0 ) {
      count = this.rowCount;
    } else {
      const player1Count = this.Player1Obj.filter(function(player1) { 
        return player1.verticalIndex == columnIndex 
      }).length;
      const player2Count = this.Player2Obj.filter(function(player2) { 
        return player2.verticalIndex == columnIndex 
      }).length;
      count = this.rowCount - (player1Count + player2Count);
    }
    
    const obj = {
      'horizontalIndex': count,
      'verticalIndex': columnIndex
    }
    if (this.currentPlayer === 'Player1') {
      this.Player1Obj.push(obj);
    } else {
      this.Player2Obj.push(obj);
    }
    // set color according to Player
    this.checkStyles(count, columnIndex);

    // check if any one wins
    this.checkWinner(count);

    // set Player for next turn
    this.currentPlayer = this.setPlayer(this.currentPlayer);
  }

  checkStyles(rowIndex, columnIndex) { 
    const player1Found = this.Player1Obj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
    const player2Found = this.Player2Obj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
    const element = document.getElementById(rowIndex+'-'+columnIndex);
    if (player1Found === -1 && player2Found !== -1) {
      element.setAttribute("class", 'dot player2Dot');
    } else {
      element.setAttribute("class", 'dot player1Dot');
    }
  }
 
  setPlayer(currentPlayer: any) {
    return currentPlayer === 'Player1' ? 'Player2' : 'Player1';
  }

  changeState() {
    this.currentPlayer = this.currentPlayer === 'initial' ? 'final' : 'initial';
  }
  
  checkWinner(rowIndex: number) {
    let hasWinner = false;
    const finalObj = this.currentPlayer === 'Player1' ? this.Player1Obj : this.Player2Obj;
    // find horizontal
    if ( this.checkHorizontal(finalObj) || this.checkDiagonalWin(finalObj, rowIndex) || this.checkVertical(finalObj) ){
      
        alert('Winner is'+this.currentPlayer);
        this.resetGame();
    }
  }

  checkHorizontal(finalObj: any) { 
    let consecutiveMoves = 0;
    const countToWin = 4;
    for (let rowIndex = this.rowCount; rowIndex >= 0; rowIndex--) {
      for (let columnIndex = 0; columnIndex <= this.columnCount; columnIndex++) {
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
    for (let columnIndex = 0; columnIndex <= this.columnCount; columnIndex++) {
      for (let rowIndex = this.rowCount; rowIndex >= 0; rowIndex--) {
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
    
      for (let indexRow = this.rowCount; indexRow >= minRowIndex; indexRow--) {
        if (!this.winnerFlag) {
        const foundObj = finalObj.filter((x: any) => x.horizontalIndex === indexRow);
        foundObj.forEach(objFound => {
          let columnIndex = objFound.verticalIndex;
          let rowIndex = objFound.horizontalIndex;


          while (rowIndex >= 0) {
            const checkEntry = finalObj.findIndex((x: any) => x.horizontalIndex === rowIndex && x.verticalIndex === columnIndex);
            if (checkEntry !== -1) {
              consecutiveMoves += 1;
              console.log('index', rowIndex, columnIndex);
              console.log('consecutiveMoves', consecutiveMoves);
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
      for (let indexRow = this.rowCount; indexRow >= minRowIndex; indexRow--) {
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
    for (let columnIndex = 0; columnIndex <= this.columnCount; columnIndex++) {
      for (let rowIndex = 0; rowIndex <= this.rowCount; rowIndex++) {
        const element = document.getElementById(rowIndex+'-'+columnIndex);
          element.setAttribute("class", 'dot');
      }
    }
  }
}
