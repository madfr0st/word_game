import { Component, HostListener } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

const WIDTH = 6;
const HEIGHT = 6;


interface row {
  column : box[];
}

interface box{
  text : string;
  x: number;
  y: number;
  state: states;
}

enum states{
  NOT_SELECTED,
  SELECTED,
  RIGHT,
}

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})


export class WordComponent {

  Grid : row[] = [];
  CurrentWord: box[] = [];
  Word: string = '';
  selected = states.SELECTED;
  right = states.RIGHT;
  wrong = states.NOT_SELECTED;

  box_id : number = 0;

  mouse_hold : boolean = false;

  currentX: number = -1;
  currentY: number = -1;
  preX: number = -1;
  preY: number = -1;

  constructor() { 
    for(let i = 0; i < HEIGHT; i++){
      const column : box[] = [];
      for(let j = 0; j < WIDTH; j++){
        let char : string = this.generate_char();
        column.push({text : char, x : j, y : i, state: states.NOT_SELECTED});
        this.box_id++;
      }
      this.Grid.push({column});
    }
  }

  //generates random character;
  generate_char(){
    let char : string = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return char;
  }

  // this is executed when mouse is over the letter box and click is pressed.
  mymethod_over(x: number, y : number){
    // console.log(x, y);
    this.currentX = x; 
    this.currentY = y;
    if(this.mouse_hold){
      this.Grid[y].column[x].state = states.SELECTED;
      const char = this.Grid[y].column[x].text;
      this.Word += char.toLowerCase();
      this.CurrentWord.push(this.Grid[y].column[x]);
    }
  }

  // this is executed when mouse is not over the letter box or when mouse leaves the box.
  mymethod_out(x: number, y : number){
    this.currentX = -1; 
    this.currentY = -1;
  }

  // listen to the mouseclick is pressed.
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    // console.log(this.mouse_hold);
    this.mouse_hold = true;
    if(this.currentX != -1 || this.currentY != -1)this.mymethod_over(this.currentX, this.currentY);
  }

  // listen to when click is left.
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    console.log(this.Word);

    // check it the word formed is valid or not.
    if(this.isValid(this.Word)){
      for(let i = 0; i < this.CurrentWord.length; i++){
        this.CurrentWord[i].state = this.right;
      }

      //generate new characters after 0.5sec.
      setTimeout(() => {
        for(let i = 0; i < this.CurrentWord.length; i++){
          let char: string = this.generate_char();
          this.CurrentWord[i].state = this.wrong;
          this.CurrentWord[i].text = char;
        }

        //reset the current word.
        this.Word = '';
        this.CurrentWord = [];
      }, 500);
    }else{
      for(let i = 0; i < this.CurrentWord.length; i++){
        this.CurrentWord[i].state = this.wrong;
      }

      //reset the current word.
      this.Word = '';
      this.CurrentWord = [];
    }

    this.mouse_hold = false;
  }

  // function to check if the word is valid or not.
  private isValid(word: string){
    return false;
  }
  
}
