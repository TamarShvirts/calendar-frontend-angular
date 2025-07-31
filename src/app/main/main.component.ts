import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {



  firstDayOfWeek= new Date(); 
  lastDayOfWeek= new Date();
  SubName: string = '';
  myCondition: boolean = false;


  onWeekDatesChange(date: { first: Date; last: Date }){
    console.log("ppppp");
    console.time('1');
  
    this.firstDayOfWeek = date.first;
    this.lastDayOfWeek = date.last;

  console.timeEnd('1');
  }


onsubNameChange(SubName: string) {
  console.time('2');
  this.SubName = SubName;
  console.timeEnd('2');
}


onmyConditionChange(myCondition: boolean) {
  console.time('3');
  this.myCondition = myCondition;
  console.timeEnd('3');

}
}
