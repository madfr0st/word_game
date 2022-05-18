import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';

const WIDTH = 8;
const HEIGHT = 8;


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
  WRONG
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
  Alphabets: string[] = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'C', 'C', 'C',
   'D', 'D', 'D', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H',
   'H', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'J', 'K', 'L', 'L', 'L', 'L', 'L', 'M', 'M', 'M', 'N', 'N',
   'N', 'N', 'N', 'N', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'P', 'P', 'P', 'Q', 'R', 'R', 'R', 'R',
   'R', 'R', 'R', 'S', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'U', 'U', 'U', 'U', 'V',
   'W', 'X', 'Y', 'Y', 'Z'];

  not_selected = states.NOT_SELECTED;
  selected = states.SELECTED;
  right = states.RIGHT;
  wrong = states.WRONG;

  box_id : number = 0;

  mouse_hold : boolean = false;

  currentX: number = -1;
  currentY: number = -1;
  preX: number = -1;
  preY: number = -1;

  game_score: number = 0;
  score_updated: boolean = false;

  show_menu: boolean = false;

  // fetch here.

  array_length: number = 0;
  url_const: string = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  final_url: string = '';

  constructor() {
    // show the main menu
    this.show_menu = true;
    //make the grid.
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
    // let char : string = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let char : string = this.Alphabets[Math.floor(Math.random() * 100)];
    return char;
  }

  // this is executed when mouse is over the letter box and click is pressed.
  mymethod_over(x: number, y : number){
    // console.log(x, y);
    this.currentX = x; 
    this.currentY = y;
    if(this.mouse_hold && this.Grid[y].column[x].state === this.not_selected){
      const char = this.Grid[y].column[x].text;
      this.Word += char.toLowerCase();
      this.CurrentWord.push(this.Grid[y].column[x]);
      this.Grid[y].column[x].state = this.selected;
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
  async onMouseUp(event: MouseEvent) {
    // lift the mouse first.
    this.mouse_hold = false;

    console.log(this.Word);

    if(this.Word.length !== 0){
      // make the url;
      this.final_url = this.url_const + this.Word;
      //call async http req. to set the array_length from the json data.
      console.log('sending', this.array_length);

      const url: string = this.final_url;
      //check word from the dictonary.
      const options = {
        method: 'GET',
      };
      
      await fetch(url, options)
        .then(response => response.json())
        .then((data) => {
          console.log(data);
          console.log(data.length);
          this.array_length = data.length;
        })
        .catch(err => console.error(err));

      console.log('receiving', this.array_length);
      
      // check it the word formed is valid or not.
      if(this.array_length !== undefined && this.array_length !== 0){
        for(let i = 0; i < this.CurrentWord.length; i++){
          this.CurrentWord[i].state = this.right;
        }

        //generate new characters after 0.5sec.
        setTimeout(() => {
          for(let i = 0; i < this.CurrentWord.length; i++){
            let char: string = this.generate_char();
            this.CurrentWord[i].state = this.not_selected;
            this.CurrentWord[i].text = char;
          }
          
          //add the score.
          this.game_score += this.CurrentWord.length * this.CurrentWord.length;
          this.score_updated = true;
          setTimeout(() => {
            this.score_updated = false;
          }, 1500);
          console.log('score_updated', this.score_updated);


          //reset the current word.
          this.Word = '';
          this.CurrentWord = [];
          this.array_length = 0;
        }, 500);
      }else{
        for(let i = 0; i < this.CurrentWord.length; i++){
          this.CurrentWord[i].state = this.wrong;
        }

        //reset the current word.
        setTimeout(() => {
          for(let i = 0; i < this.CurrentWord.length; i++){
            this.CurrentWord[i].state = this.not_selected;
          }
          this.Word = '';
          this.CurrentWord = [];
        }, 500);
      }
    }
  }

  //for touch screen
  // touch_over(x: number, y: number){
  //   console.log(x, y);
  // }

  // el: HTMLElement = document.getElementById('time');
  // st: HTMLDivElement = <div id = "time" class ="timer"> </div>;


  // change the lenght of bar according to time.
  bar_length: number = 100;
  start_time = setInterval(() => {
    if(this.show_menu === false) this.bar_length -= (100/60);  // for 1 minutes
  }, 1000);
  
  main_menu(){
    this.bar_length = 100;
    this.show_menu = false;
    this.game_score = 0; 
    setTimeout(() => {
      this.show_menu = true;
    }, 60000);
  }

}
