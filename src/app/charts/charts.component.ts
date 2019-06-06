import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { DataServices } from '../dataFromServer/dataServices';
//import * as d3 from "d3";

//configure the component and meta data which tell angular what to do with it
@Component({
    //selector as string
    selector :'app-charts',
    templateUrl :'./charts.component.html'

})
export class ChartsComponent implements OnInit{
  ngOnInit(): void {
    console.log(this.isButtonClicked);
  }
  data_ready;
  @Input('userId') userId : String;
  @Input('selected_date')  selected_date : Date;
  @Input('isButtonClicked')  isButtonClicked : boolean;
  pie;
  svg;
  data_pie ;
  constructor(private _dataService : DataServices){}
  
  
  
  
  // Draw the Pie Chart
  draw() {
    let margin : { top: number, right: number, bottom: number, left: number }  = {top :20,right: 20,bottom :20 ,left :20},
    width : number = 500- margin.right-margin.left,
    height : number = 500 - margin.top -margin.bottom,
    radius = width/2;

    this.svg = d3.select("#selectedCompany")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," +
        height / 2 + ")");

    // set the color scale
    let color = d3.scaleOrdinal()
      .domain(Object.keys(this.data_pie))
      .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
   this.pie = d3.pie()
      .value(function (d: any) { return d.value })
    
    this.data_ready = this.pie(d3.entries(this.data_pie))

    this.svg
      .selectAll('whatever')
      .data(this.data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(100)         // This is the size of the donut hole
        .outerRadius(radius))
      .attr('fill',(d) => { return (color(d.data.key)) })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
  }


  }
  