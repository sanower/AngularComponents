import { Component } from '@angular/core';
import {SanTreeComponent} from "./components/san-tree/san-tree.component";
import {ECONode, IECONode, Orientation} from "./components/san-tree/econode";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-components';

  nodeSelected: ECONode | null = null;

  data: IECONode = {
    width: 150,
    data: {text: 'CTN' },
    linkColor: 'blue',
    background: 'red',
    color: 'white',
    selected: true,
    children: [
      {
        data: {text: "CTN" },
        children: [
          { data: {text: "Anono" }},
          {data: {text: "abc" }},
        ],
      },
      { data: {text: "Address" }},
      {
        data: {text: "RelationShip1" },
        children: [],
      },
    ],
  };


  public updateNode(data: {child:number, value: string}): void{
    console.log(data);
  }
}
