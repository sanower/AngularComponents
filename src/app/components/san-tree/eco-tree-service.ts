import {Injectable} from "@angular/core";
import {Aligment, ECONode, Orientation, Select} from "./econode";

@Injectable()
export class EcoTreeService{

  config: any;
  version = '1.1';
  canvasoffsetTop = 0;
  canvasoffsetLeft = 0;

  maxLevelHeight: any = [];
  maxLevelWidth: any = [];
  previousLevelNode:any = [];

  rootYOffset = 0;
  rootXOffset = 0;

  public nDatabaseNodes:any = [];
  mapIDs:any = {};

  root;
  iSelectedNode = -1;
  iLastSearch = 0;

  width = 0;
  height = 0;

  constructor() {
    this.config = {
      iMaxDepth: 100,
      iLevelSeparation: 40,
      iSiblingSeparation: 20,
      iSubtreeSeparation: 40,
      iRootOrientation: Orientation.RO_LEFT,
      iNodeJustification: Aligment.NJ_TOP,
      topXAdjustment: 0,
      topYAdjustment: 0,
      linkType: 'B',
      nodeColor: '#333',
      nodeBorderColor: 'white',
      nodeSelColor: '#FFFFCC',
      useTarget: true,
      selectMode: Select.SL_MULTIPLE,
      defaultNodeWidth: 80,
      defaultNodeHeight: 40,
    };

    this.version = '1.1';
    this.canvasoffsetTop = 0;
    this.canvasoffsetLeft = 0;

    this.maxLevelHeight = [];
    this.maxLevelWidth = [];
    this.previousLevelNode = [];

    this.rootYOffset = 0;
    this.rootXOffset = 0;

    this.nDatabaseNodes = [];
    this.mapIDs = {};
    this.iSelectedNode = -1;
    this.iLastSearch = 0;
    this.root = new ECONode(-1, null, null, 2, 2, null, null, null, null);

  }

  /*  _canvasNodeClickHandler(tree, target, nodeid) {
    if (target != nodeid) return;
    tree.selectNode(nodeid, true);
  }
*/
  //Layout algorithm
  _firstWalk(tree: any, node: any, level: any) {
    var leftSibling = null;

    node.XPosition = 0;
    node.YPosition = 0;
    node.prelim = 0;
    node.modifier = 0;
    node.leftNeighbor = null;
    node.rightNeighbor = null;
    tree._setLevelHeight(node, level);
    tree._setLevelWidth(node, level);
    tree._setNeighbors(node, level);
    if (node._getChildrenCount() == 0 || level == tree.config.iMaxDepth) {
      leftSibling = node._getLeftSibling();
      if (leftSibling != null)
        node.prelim =
          leftSibling.prelim +
          tree._getNodeSize(leftSibling) +
          tree.config.iSiblingSeparation;
      else node.prelim = 0;
    } else {
      const n = node._getChildrenCount();
      for (let i = 0; i < n; i++) {
        const iChild = node._getChildAt(i);
        this._firstWalk(tree, iChild, level + 1);
      }

      let midPoint = node._getChildrenCenter(tree);
      midPoint -= tree._getNodeSize(node) / 2;
      leftSibling = node._getLeftSibling();
      if (leftSibling != null) {
        node.prelim =
          leftSibling.prelim +
          tree._getNodeSize(leftSibling) +
          tree.config.iSiblingSeparation;
        node.modifier = node.prelim - midPoint;
        this._apportion(tree, node, level);
      } else {
        node.prelim = midPoint;
      }
    }
  }

  _apportion(tree: any, node: any, level: any) {
    let firstChild = node._getFirstChild();
    let firstChildLeftNeighbor = firstChild.leftNeighbor; //&& firstChildLeftNeighbor != null
    let firstChildRightNeighbor = firstChild.rightNeighbor;
    let j = 1;
    for (
      let k = tree.config.iMaxDepth - level;
      firstChild != null && j <= k;

    ) {
      let modifierSumRight = 0;
      let modifierSumLeft = 0;
      let rightAncestor = firstChild;
      let leftAncestor = firstChildLeftNeighbor;
      let totalGap;
      if(leftAncestor !==undefined){
        for (let l = 0; l < j; l++) {
          rightAncestor = rightAncestor.nodeParent;
          leftAncestor = leftAncestor.nodeParent;
          modifierSumRight += rightAncestor.modifier;
          modifierSumLeft += leftAncestor.modifier;
        }
        totalGap = firstChildLeftNeighbor.prelim +modifierSumLeft + tree._getNodeSize(firstChildLeftNeighbor) +tree.config.iSubtreeSeparation - (firstChild.prelim + modifierSumRight);
      }
      else {
        for (let l = 0; l < j; l++) {
          rightAncestor = rightAncestor.nodeParent;
          modifierSumRight += rightAncestor.modifier;
        }
        totalGap = tree._getNodeSize(firstChildRightNeighbor) +tree.config.iSubtreeSeparation - (firstChild.prelim + modifierSumRight);

        node.prelim += totalGap;
        node.modifier += totalGap;
      }



      if (totalGap > 0) {
        let subtreeAux = node;
        let numSubtrees = 0;
        for (
          ;
          subtreeAux != null && subtreeAux != leftAncestor;
          subtreeAux = subtreeAux._getLeftSibling()
        )
          numSubtrees++;

        if (subtreeAux != null) {
          let subtreeMoveAux = node;
          let singleGap = totalGap / numSubtrees;
          for (
            ;
            subtreeMoveAux != leftAncestor;
            subtreeMoveAux = subtreeMoveAux._getLeftSibling()
          ) {
            subtreeMoveAux.prelim += totalGap;
            subtreeMoveAux.modifier += totalGap;
            totalGap -= singleGap;
          }
        }
      }
      j++;
      if (firstChild._getChildrenCount() == 0)
        firstChild = tree._getLeftmost(node, 0, j);
      else firstChild = firstChild._getFirstChild();
      if (firstChild != null) firstChildLeftNeighbor = firstChild.leftNeighbor;
    }
  }

  _secondWalk(tree: any, node: any, level: any, X: any, Y: any) {
    if (level <= tree.config.iMaxDepth) {
      let xTmp = tree.rootXOffset + node.prelim + X;
      let yTmp = tree.rootYOffset + Y;
      let maxsizeTmp = 0;
      let nodesizeTmp = 0;
      let flag = false;

      switch (tree.config.iRootOrientation) {
        case Orientation.RO_LEFT:
          maxsizeTmp = tree.maxLevelWidth[level];
          flag = true;
          nodesizeTmp = node.w;
          break;
      }
      switch (tree.config.iNodeJustification) {
        case Aligment.NJ_TOP:
          node.XPosition = xTmp;
          node.YPosition = yTmp;
          break;

        case Aligment.NJ_CENTER:
          node.XPosition = xTmp;
          node.YPosition = yTmp + (maxsizeTmp - nodesizeTmp) / 2;
          break;

        case Aligment.NJ_BOTTOM:
          node.XPosition = xTmp;
          node.YPosition = yTmp + maxsizeTmp - nodesizeTmp;
          break;
      }
      if (flag) {
        let swapTmp = node.XPosition;
        node.XPosition = node.YPosition;
        node.YPosition = swapTmp;
      }
      switch (tree.config.iRootOrientation) {

      }
      if (node._getChildrenCount() != 0){
        this._secondWalk(
          tree,
          node._getFirstChild(),
          level + 1,
          X + node.modifier,
          Y + maxsizeTmp + tree.config.iLevelSeparation
        );
      }
      const rightSibling = node._getRightSibling();
      if (rightSibling != null){
        this._secondWalk(tree, rightSibling, level, X, Y);
      }

    }
  }

  _positionTree() {
    this.maxLevelHeight = [];
    this.maxLevelWidth = [];
    this.previousLevelNode = [];
    this._firstWalk(this, this.root, 0);

    switch (this.config.iRootOrientation) {
      case Orientation.RO_LEFT:
        this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
        this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
        break;
    }

    this._secondWalk(this, this.root, 0, 0, 0);
  }

  _setLevelHeight(node: any, level: any) {
    if (this.maxLevelHeight[level] == null) this.maxLevelHeight[level] = 0;
    if (this.maxLevelHeight[level] < node.h)
      this.maxLevelHeight[level] = node.h;
  }

  _setLevelWidth(node: any, level: any) {
    if (this.maxLevelWidth[level] == null) this.maxLevelWidth[level] = 0;
    if (this.maxLevelWidth[level] < node.w) this.maxLevelWidth[level] = node.w;
  }

  _setNeighbors(node: any, level: any) {
    node.leftNeighbor = this.previousLevelNode[level];
    if (node.leftNeighbor != null) node.leftNeighbor.rightNeighbor = node;
    this.previousLevelNode[level] = node;
  }

  _getNodeSize(node: any) {
    switch (this.config.iRootOrientation) {
      case Orientation.RO_LEFT:
        return node.h;
    }
    return 0;
  }

  _getLeftmost(node: any, level: any, maxlevel: any): any {
    if (level >= maxlevel) return node;
    if (node._getChildrenCount() == 0) return null;

    const n = node._getChildrenCount();
    for (let i = 0; i < n; i++) {
      const iChild = node._getChildAt(i);
      const leftmostDescendant = this._getLeftmost(iChild, level + 1, maxlevel);
      if (leftmostDescendant != null) return leftmostDescendant;
    }

    return null;
  }


  // ECOTree API begins here...

  UpdateTree() {
    this._positionTree();
    this.width = Math.max(...this.nDatabaseNodes.map((x: any) => x.XPosition + x.w));
    this.height = Math.max(...this.nDatabaseNodes.map((x: any) => x.YPosition + x.h));
  }

  add(id: any, pid: any, dsc: any, w: any, h: any, c: any, bc: any, lc: any, meta: any, selected = false) {
    const nw = w || this.config.defaultNodeWidth; //Width, height, colors, target and metadata defaults...
    const nh = h || this.config.defaultNodeHeight;
    const color = c || this.config.nodeColor;
    const border = bc || this.config.nodeBorderColor;
    const metadata = typeof meta != 'undefined' ? meta : '';

    let pnode = null; //Search for parent node in database
    if (pid == -1) {
      pnode = this.root;
    } else {
      for (let k = 0; k < this.nDatabaseNodes.length; k++) {
        if (this.nDatabaseNodes[k].id == pid) {
          pnode = this.nDatabaseNodes[k];
          break;
        }
      }
    }

    const node = new ECONode(id, pid, dsc, nw, nh, color, border, lc, metadata);
    node.isSelected = true;//selected; //New node creation...
    node.nodeParent = pnode; //Set it's parent
    pnode.canCollapse = true; //It's obvious that now the parent can collapse
    const i = this.nDatabaseNodes.length; //Save it in database
    node.dbIndex = this.mapIDs[id] = i;
    this.nDatabaseNodes[i] = node;
    h = pnode.nodeChildren.length; //Add it as child of it's parent
    node.siblingIndex = h;
    pnode.nodeChildren[h] = node;
  }
}
