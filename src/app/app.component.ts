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
    data: { id: 1 },
    linkColor: 'red',
    background: 'cyan',
    color: 'white',
    selected: true,
    children: [
      {
        data: { id: 2 },
        linkColor: 'pink',
        background: 'pink',
        color: 'white',
        selected: true,
        children: [
          { data: { id: 5 }, selected: true, background: 'pink' },
          {
            data: { id: 6 },
            selected: true
          },
        ],
      },
      { data: { id: 3 }, selected: true, background: 'silver' },
      {
        data: { id: 4 },
        linkColor: 'orange',
        background: 'orange',
        color: 'white',
        selected: true,
        children: [
        ],
      },
    ],
  };

  /**
  selectSlibingNodes(treeView: SanTreeComponent, node: ECONode) {
    if (node == this.nodeSelected) {
      this.nodeSelected = null;
      treeView.nodes.forEach((x:any) => {
        x.isSelected = false;
      });
    } else {
      this.nodeSelected = node;
      const nodes = treeView.getSlibingNodes(node).map((x) => x.id);
      treeView.nodes.forEach((x:any) => {
        x.isSelected = x.id == node.id || nodes.indexOf(x.id) >= 0;
      });
    }
  }
  */

}
