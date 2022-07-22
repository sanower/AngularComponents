import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'san-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CircleComponent implements OnInit, OnChanges {
  @Input() radius = 40;
  @Input() border = 2;
  @Input() strokeWidth = 12;
  @Input() fontSize = 20;
  @Input() percentage = 75;
  @Input() animatedPercentage = 0;
  @Input() strokeColorBG:string = "#000000";
  @Input() strokeColorFG:string = "#E8D439";
  @Input() centerColor: string = "#ffffff";
  @Input() textColor: string = "#000000";

  public radiusFG:number = this.radius;
  public strokeWidthFG = this.strokeWidth - 2*this.border;
  public cir =0;
  public cirFG = 0;
  public strokeDashArray = '0 100';
  public size = "200px";
  private interval = 0;
  constructor() { }

  async ngOnInit():Promise<any> {
    let ts = Math.floor(2000/this.percentage);
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.interval = window.setInterval(this.animateNumber, ts, this);
    this.calcCir();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['radius']){
      this.radiusFG = this.radius;
    }
    if(changes['border']){
      this.strokeWidthFG = this.strokeWidth - 2*this.border;
    }
  }


  private animateNumber(that:any){
    that.animatedPercentage++;
    if(that.animatedPercentage === that.percentage){
      clearInterval(that.interval);
    }
  }

  private calcCir(){
    this.cir = 2*3.14*this.radiusFG;
    this.cirFG = (this.cir/100)*this.percentage;
    this.strokeDashArray = this.cirFG+ ' '+this.cir;
  }
}
