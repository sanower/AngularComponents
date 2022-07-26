/*This code go from an article written some time ago (nov 2006) by Emilio Cortegoso Lobato:
 https://www.codeproject.com/Articles/16192/Graphic-JavaScript-Tree-with-Layout

Please, don't remove the comment
 */
export interface IECONode {
  data: any;
  linkColor?: string;
  background?: string;
  color?: string;
  width?: number;
  height?: number;
  children?: IECONode[];
  selected?: boolean;
}

export enum Orientation {
  RO_LEFT
}
export enum Aligment {
  NJ_TOP,
  NJ_CENTER,
  NJ_BOTTOM,
}

//Selection mode: single, multiple, no selection
export enum Select {
  SL_MULTIPLE,
  SL_SINGLE,
  SL_NONE,
}

export class ECONode {
  id;
  pid;
  dsc;
  w;
  h;
  c;
  bc;
  linkColor;
  data;

  siblingIndex = 0;
  dbIndex = 0;

  XPosition = 0;
  YPosition = 0;
  prelim = 0;
  modifier = 0;
  leftNeighbor: any = null;
  rightNeighbor:any = null;
  nodeParent: ECONode | null = null;
  nodeChildren: ECONode[] = [];

  isCollapsed = false;
  canCollapse = false;

  isSelected = false;

  constructor(id: any, pid: any, dsc: any, w: any, h: any, c: any, bc: any, lc: any, meta: any) {
    this.id = id;
    this.pid = pid;
    this.dsc = dsc;
    this.w = w;
    this.h = h;
    this.c = c;
    this.bc = bc;
    this.linkColor = lc;
    this.data = meta;

    this.siblingIndex = 0;
    this.dbIndex = 0;

    this.XPosition = 0;
    this.YPosition = 0;
    this.prelim = 0;
    this.modifier = 0;
    this.leftNeighbor = null;
    this.rightNeighbor = null;
    this.nodeParent = null;
    this.nodeChildren = [];

    this.isCollapsed = false;
    this.canCollapse = false;

    this.isSelected = false;
  }

  _getLevel():number {
    if(this.nodeParent){
      if (this.nodeParent.id == -1) {
        return 0;
      } else return this.nodeParent._getLevel() + 1;
    }
    else return 1;

  }

  _isAncestorCollapsed(): boolean {
    if(this.nodeParent){
      if (this.nodeParent.isCollapsed) {
        return true;
      } else {
        if (this.nodeParent.id == -1) {
          return false;
        } else {
          return this.nodeParent._isAncestorCollapsed();
        }
      }
    }
    return true;
  }

  _setAncestorsExpanded(): boolean{
    if(this.nodeParent){
      if (this.nodeParent.id == -1) {
        return false;
      } else {
        this.nodeParent.isCollapsed = false;
        return this.nodeParent._setAncestorsExpanded();
      }
    }
    return false;
  }

  _getChildrenCount() {
    if (this.isCollapsed) return 0;
    if (this.nodeChildren == null) return 0;
    else return this.nodeChildren.length;
  }

  _getLeftSibling() {
    if (
      this.leftNeighbor != null &&
      this.leftNeighbor.nodeParent == this.nodeParent
    )
      return this.leftNeighbor;
    else return null;
  }

  _getRightSibling() {
    if (
      this.rightNeighbor != null &&
      this.rightNeighbor.nodeParent == this.nodeParent
    )
      return this.rightNeighbor;
    else return null;
  }

  _getChildAt(i: any) {
    return this.nodeChildren[i];
  }

  _getChildrenCenter(tree: any) {
    const node = this._getFirstChild();
    const node1 = this._getLastChild();
    return (
      node.prelim + (node1.prelim - node.prelim + tree._getNodeSize(node1)) / 2
    );
  }

  _getFirstChild() {
    return this._getChildAt(0);
  }

  _getLastChild() {
    return this._getChildAt(this._getChildrenCount() - 1);
  }

  _drawChildrenLinks(tree: any) {
    let s = [];
    let xa = 0,
      ya = 0,
      xb = 0,
      yb = 0,
      xc = 0,
      yc = 0,
      xd = 0,
      yd = 0;
    let node1 = null;

    xa = this.XPosition + this.w;
    ya = this.YPosition + this.h / 2;

    const nodesSorted = this.nodeChildren.sort((a, b) => 1
      //a.isSelected && !b.isSelected ? 1 : -1
    );
    for (let k = 0; k < nodesSorted.length; k++) {
      node1 = nodesSorted[k];

      xd = node1.XPosition;
      yd = yc = node1.YPosition + node1.h / 2;
      yb = ya;
      xb = xc = xd - tree.config.iLevelSeparation / 2;

      s.push(
        'M' +
        xa +
        ' ' +
        ya +
        ' C' +
        xb +
        ' ' +
        yb +
        ' ' +
        xc +
        ' ' +
        yc +
        ' ' +
        xd +
        ' ' +
        yd
      );
    }
    return s;
  }
}
