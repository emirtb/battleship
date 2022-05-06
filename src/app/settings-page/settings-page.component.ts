import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  constructor() { }
  turnos:number=0;
  ngOnInit(): void {
  }
  onChange(value:any){

    //console.log(event);
    this.turnos = parseInt(value);
    
  }
  setLevel(){
    localStorage.setItem("numeroTurnos", this.turnos.toString());
    
  }

}
