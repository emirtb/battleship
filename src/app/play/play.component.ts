import { Component, OnInit } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  board: Board = new Board();
  perdido:boolean=false;
  viewingBoats: boolean = false;
  settings: PlaySetings = new PlaySetings();
  turnosUsados:number=0;
  limiteTurnos:number=0;
  destroyedTurnos:number=0;
  constructor() {
    //this.board = new Board();
    this.board.placeboatsIntents();
  }
  playStarted: boolean = false;
  htmlStr: string = "";
  ngOnInit(): void {
    this.playStarted = true;
    let getTurnos =  localStorage.getItem("numeroTurnos");
    if (getTurnos != null ){
        this.limiteTurnos = parseInt(getTurnos);
    }else{
      this.limiteTurnos = 0;
    }
    this.board.build();
  }
  getTableClass() {
    return {
      tabla: true,
      viewBoats: this.viewingBoats
    };
  }
  startPlay() {
   // this.playStarted = true;
  
    window.document.location = window.document.location;

  }
  gameFinished:boolean=false;
  async endGame(winer:boolean){
    this.perdido = winer == false;
    this.gameFinished = true;
    let date= new Date();
    let result = `Ganaste! con ${this.turnosUsados} turnos`;
    if (winer == true){
      result = `Perdiste con ${this.turnosUsados} turnos :(`;
    }
    localStorage.setItem(date.toISOString(),  result);
  }
  viewBoats() {
    this.viewingBoats =  !this.viewingBoats;
  }
  test(cell: Cell) {
    if (cell.enabled == true && this.playStarted) {
      if (cell.isUsed()) {
        this.destroyedTurnos ++;
        cell.isDestroyed = true;
        
      }
      this.turnosUsados ++;
      cell.enabled = false;
      if (this.limiteTurnos > 0){
        if (this.limiteTurnos <= this.turnosUsados){
          this.viewingBoats = true;
          this.playStarted = false;
          if (this.destroyedTurnos == 20){
            this.endGame(true);
          }else{
            this.endGame(false);
          }
      }
    }else{
      if (this.destroyedTurnos == 20){
        this.endGame(true);
      
      }
    }
    }
  }


}



class PlaySetings {
  intents: number = 20;

}
class Board {
  rows;
  cols;
  cells = <any>[];
  rowsT: Array<any> = [];
  boatParts: Array<Array<any>> = [];
  failed: boolean;
  constructor() {

    this.rows = 10;
    this.cols = 10;
    this.cells = [];
    this.initializeCells();
    this.boatParts = [
      ["4", 4],
      ["3", 3], ["3", 3],
      ["2", 2], ["2", 2],["2", 2],
      ["1", 1], ["1", 1],["1", 1],["1", 1]
      ];
    this.failed = false;
  }

  initializeCells() {
    this.cells = [];
    for (let i = 0; i < this.cols; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j] = new Cell();
      }
    }
  }
  build() {
    // let string =
    //   "   A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z ";
    // string = string.slice(0, this.cols * 2 + 2);
    // string = string.concat('</tr>');
    let rowNew: Array<Cell> = [];
    for (let j = 0; j < this.rows; j++) {
     
      
      rowNew = [];
    
      for (let i = 0; i < this.cols; i++) {
       
        
        rowNew.push(this.cells[i][j]);
      }
   

      this.rowsT.push(rowNew)

    }
  
  }
  placeboatIntents(charLenPair: any) {
    let direction = ["v", "h"][Math.floor(Math.random() * 2)];
    let max_col = this.cols;
    let max_row = this.rows;
    if (direction === "v") max_row -= (charLenPair[1] - 1);
    if (direction === "h") max_col -= (charLenPair[1] - 1);
    if (max_row < 1 || max_col < 1) return false;
    let corner = [Math.floor(Math.random() * max_col),
    Math.floor(Math.random() * max_row)];
    let newboat = new boat(charLenPair, direction, corner, this);
    if (newboat.canInsert()) {
      newboat.insert();
      return true;
    } else {
      return false;
    }
  }
  placeboatsIntents() {
    for (let attempt = 0; attempt < 1000000; attempt++) {
      this.initializeCells();
      let attOk = true;
      for (let i = 0; i < this.boatParts.length; i++) {
        if (!this.placeboatIntents(this.boatParts[i])) {
          attOk = false;
          break;
        }
      }
      if (attOk) {
        return;
      }
    }
    this.failed = true;
  }
}

class boat {
  appearance: any;
  length: any;
  orientation: any;
  corner: any;
  name: string = "";
  board: any;
  constructor(charLenPair: any, orientation: any, corner: any, board: any) {
    this.appearance = `<td class="used" onClick="javascript:alert('sdsd')">${charLenPair[0]}</td>`;
    this.length = charLenPair[1];
    this.orientation = orientation;
    this.corner = corner;
    this.board = board;
  }
  cells() {
    let cellList = [];
    if (this.orientation === "h") {
      for (let i = 0; i < this.length; i++) {
        cellList[i] = this.board.cells[this.corner[0] + i][this.corner[1]];
      }
    }
    if (this.orientation === "v") {
      for (let i = 0; i < this.length; i++) {
        cellList[i] = this.board.cells[this.corner[0]][this.corner[1] + i];
      }
    }
    return cellList;
  }
  canInsert() {
    let cellList = this.cells();
    for (let i = 0; i < this.length; i++) {
      if (cellList[i].contains) return false;
    }
    return true;
  }
  insert() {
    let cellList = this.cells();
    for (let i = 0; i < this.length; i++) {
      cellList[i].contains = this;
    }
  }
}

class Cell {
  contains: any;
  name: string = "";
  enabled: boolean = true;
  isDestroyed: boolean = false;
  constructor() {
    this.contains = null;
  }
  isUsed() {
    return this.contains ? true : false;
  }
  
}
