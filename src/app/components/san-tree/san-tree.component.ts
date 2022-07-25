import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {
  ECOTree,
  ECONode
} from './econode';

@Component({
  selector: 'san-tree',
  templateUrl: 'san-tree.component.html',
  styleUrls: ['san-tree.component.scss'],
})
export class SanTreeComponent implements OnChanges{
  public treeData = new ECOTree();
  @Input() template: TemplateRef<any> | null = null;
  //@Input() data: any;
  @Input() set data(value:any) {
    //this.tree = new ECOTree();
    //this.addNodes(this.tree, value);
    //console.log(value);
    //this.tree.UpdateTree();
  }
/*  update() {
    this.tree.UpdateTree();
  }*/
  get config() {
    return this.tree.config;
  }
 /* get nodes() {
    return this.tree.nDatabaseNodes;
  }*/
 public tree: ECOTree = new ECOTree();

 ngOnChanges(changes: SimpleChanges) {
   if(changes['data']){
     this.tree = new ECOTree();
     this.addNodes(this.tree, changes['data'].currentValue);
     this.tree.UpdateTree();
     //this.addNodes(this.treeData, changes['data'].currentValue);
     //this.treeData.UpdateTree();
   }
 }

  public getChildren(node: ECONode, nodes: ECONode[] = []) {
    const children = node.nodeChildren;
    if (children && children.length) {
      nodes = [...nodes, ...children];
      children.forEach((x) => {
        nodes = this.getChildren(x, nodes);
      });
    }
    return nodes;
  }
  getParent(node: ECONode, nodes: ECONode[] = []) {
    if (node.nodeParent) {
      nodes = [...nodes, node.nodeParent];
      nodes = this.getParent(node.nodeParent, nodes);
    }
    return nodes;
  }

  getSlibingNodes(node: ECONode) {
    return [...this.getParent(node), ...this.getChildren(node)];
  }

  private addNodes(tree: ECOTree, node: any, parent: any = null) {
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
}
