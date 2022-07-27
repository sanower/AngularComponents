import { Component } from '@angular/core';
import {SanTreeComponent} from "./components/san-tree/san-tree.component";
import {ECONode, IECONode, Orientation} from "./components/san-tree/econode";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public version:number = 0;
  title = 'angular-components';

  nodeSelected: ECONode | null = null;

  public data: IECONode = {
    width: 230,
    data: {text: 'CTN' },
    linkColor: '#FFE30A',
    background: '#FFE30A',
    color: '#000000',
    selected: true,
    children: [
      {
        data: {text: "TextHasTermianlPhoneNumber1" },
        children: [
          {data: {text: "CTN" }},
          {data: {text: "PhoneNumber" }},
          {data: {text: "ShortCode" }}
        ]
      },
      {
        data: {text: "ShortCode" },
        children: [
          {data: {text: "CTN" }},
          {data: {text: "PhoneNumber" }},
          {data: {text: "ShortCode" }}
        ]
      },
      {
        data: {text: "PhoneNumber" },
        children: [
          {data: {text: "CTN" }},
          {data: {text: "PhoneNumber" }},
          {data: {text: "ShortCode" }}
        ]
      },
    ],
  };


  public updateNode(event: {child:number, value: string}): void{
    if(event.child===0){
      this.version++;
      this.data.children = [
        {
          data: {text: "TextHasTermianlPhoneNumber1" },
          children: [
            {data: {text: "CTN" }},
            {data: {text: "PhoneNumber" }},
            {data: {text: "ShortCode" }}
          ]
        },
        {
          data: {text: "ShortCode" },
          children: [
            {data: {text: "CTN" }},
            {data: {text: "PhoneNumber" }},
            {data: {text: "ShortCode" }}
          ]
        }
      ]
      this.data.data.text = event.value;
    }
  }
}
