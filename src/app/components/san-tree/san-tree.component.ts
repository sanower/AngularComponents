import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, EventEmitter} from '@angular/core';
import {
  ECONode
} from './econode';
import {EcoTreeService} from "./eco-tree-service";

@Component({
  selector: 'san-tree',
  templateUrl: 'san-tree.component.html',
  styleUrls: ['san-tree.component.scss'],
  providers: [EcoTreeService]
})
export class SanTreeComponent implements OnChanges{
  public updated:boolean = false;
  public databaseNodes: any = [];
  @Input() template: TemplateRef<any> | null = null;
  //@Input() data: any;
  @Input() data ={};
  @Output() emitNodeClick = new EventEmitter();

  constructor(public ECOTree: EcoTreeService) {
  }
  get config() {
    return this.tree.config;
  }
 /* get nodes() {
    return this.tree.nDatabaseNodes;
  }*/
  public tree = new EcoTreeService();
 //public tree: ECOTree = new ECOTree();

 ngOnChanges(changes: SimpleChanges) {
   if(changes['data']){
     this.tree = new EcoTreeService();
     this.addNodes(this.tree, changes['data'].currentValue);
     this.tree.UpdateTree();
     this.updated = true;
   }
 }

  private addNodes(tree: EcoTreeService, node: any, parent: any = null) {
    parent = parent || {
      id: -1,
      width: null,
      height: null,
      color: null,
      background: null,
      linkColor: null,
    };
    node.width = node.width || parent.width;
    node.height = node.height || parent.height;
    node.color = node.color || parent.color;
    node.background = node.background || parent.background;
    node.linkColor = node.linkColor || parent.linkColor;
    node.id = tree.nDatabaseNodes.length;
    tree.add(
      node.id,
      parent.id,
      node.title,
      node.width,
      node.height,
      node.color,
      node.background,
      node.linkColor,
      node.data,
      node.selected
    );
    if (node.children) {
      node.children.forEach((x: any) => {
        this.addNodes(tree, x, node);
      });
    }
  }

  public nodeClick(arg: {child: number, value: string}){
   this.emitNodeClick.emit(arg);
  }


}
