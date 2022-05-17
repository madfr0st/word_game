import { Component } from '@angular/core';

const WIDTH = 6;
const HEIGHT = 6;

interface Grid {
  grid : Row[];
}

interface Row {
  column : string[];
}

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})

export class WordComponent {
  constructor() { 
    for(let i = 0; i < HEIGHT; i++){
      for(let j = 0; j < WIDTH; j++){
        
      }
    }
  }
}
