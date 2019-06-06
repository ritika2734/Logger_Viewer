import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataServices } from './dataFromServer/dataServices';
import { DataFromServerModel } from './dataFromServer/dataFromServerModel';
import { svg } from 'd3';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  usersList : String[];
  dataFromServer : DataFromServerModel[];
  selected_date : Date;
  userId : String;
  isButtonClicked : boolean;
  selected_companies : any [];
  data_pie_activity : any [];
  svg;
  svg_rect;
  pie;
  data_ready;


  private data_pie : {name : String, count_num :number} []=[];
  
  constructor(private _userDetailsService: DataServices) {
    this.isButtonClicked = false;
    this._userDetailsService.getDataFromServer().subscribe(
      data => {
            this.dataFromServer = data.logs;
            this._userDetailsService.setOption('data', data.logs); 
            this.usersList = this._userDetailsService.getUsers(data.logs);
            
      }
    );
  }
    
  ngOnInit(): void {
    
  }

  // Function to get the pie chart
private submitUserDetails(): void{
  this.isButtonClicked =true;
  console.log(this._userDetailsService.getOption());
  let data_1 : any[] = this._userDetailsService.getOption().data ;
  let data_pie = this._userDetailsService.getUserActivityByDate(data_1,this.userId,this.selected_date);
   this.drawPie(data_pie);
   // Line chart showing the list of companies
   //let data_line = this._userDetailsService.getSelectedCompaniesByDate(data_1,this.userId,this.selected_date);
   //this.drawLineChart(data_line);
}




// Draw the Pie Chart

private drawPie(data_pie : any[]) {
  
  d3.select("svg").remove();

  // margin and radius
 let margin : { top: number, right: number, bottom: number, left: number }  = {top :0,right: 0,bottom :0 ,left :0},
 width : number = 600- margin.right-margin.left,
 height : number = 600 - margin.top -margin.bottom;
 let chart_width: number =   (width/2)-50   
 let chart_height: number =   (height/2)-50
 let chart_radius : number = chart_width/2
 //colors
let colors: any  = d3.scaleOrdinal(d3.schemeDark2);

// Define svg
this.svg = d3.select('#userActivity').append('svg')
                .attr("width",width)
                .attr("height",height)
              //  .append('g')
              //  .attr('transform', 'translate('+width/2+','+height/2+')');

 // Generate the pie with data
 this.pie = d3.pie().value(function (d: any) { console.log('d is'); console.log(d);  return d.count_num });
 this.data_ready = this.pie(data_pie)
 // Generate the arc generator for the pie chart
let segments : any = d3.arc()
          .outerRadius(chart_radius -10)
          .innerRadius(0);
    
let sections = this.svg.append('g')
                .attr('transform', 'translate('+chart_width+','+chart_height+')')
                .selectAll("path")
                .data(this.data_ready);

sections.enter().append('path').attr('d',segments).style('fill',function(d : any, i : any ){ return colors(i)}).attr("stroke", "black")
.style("stroke-width", "2px")
.style("opacity", 0.7)
       
   
let content  : any  = d3.select('g').selectAll("text").data(this.data_ready);
content.enter().append("text").each(function(d: any){
  let center : any = segments.centroid(d);
  d3.select(this).attr("x", center[0]).attr("y",center[1]).text(d.data.count_num)
});

let legends_width : number = (width/2)+100;
let legends_height : number = (height/2)-150;
let legends = this.svg.append("g").attr("transform","translate("+legends_width+","+legends_height+")")
              .selectAll('.legends')
              .data(this.data_ready);
let legend = legends.enter().append('g').classed("legends",true).attr("transform",function(d :any,i){ return "translate(0,"+(i+1)*30+")";});
legend.append("rect").attr("width",20).attr("height",20).attr("fill", function(d : any,i :any){
    return colors(i);});
legend.append("text").text(function(d : any){
    return d.data.name
  }).attr("fill", function(d : any,i){
    return colors(i);})
    .attr("x",30)
    .attr("y",15);

 }   
 
 private drawLineChart(data_line :any[]){
  d3.select("svg").remove();

  // margin and radius
 let margin : { top: number, right: number, bottom: number, left: number }  = {top :0,right: 0,bottom :0 ,left :0},
 width : number = 1200- margin.right-margin.left,
 height : number = 1200 - margin.top -margin.bottom;
 
 //colors
let colors: any  = d3.scaleOrdinal(d3.schemeDark2);

// Define svg
 let svg_rect = d3.select('#selectedCompanies').append('svg')
                .attr("width",width)
                .attr("height",height)

    svg_rect.selectAll("rect")
    .data(data_line)
    .enter()
    .append("rect")
    .attr("width", function(d){
       return d.payload.assetId
    }).attr("height","50")
    .attr("y", function(d,i){
     // create bar everyy 80 px
      return i*80
   }).attr("fill","red");
  
   svg_rect.selectAll("text").data(data_line)
            .enter()
            .append("text")
            .attr("fill", "#fffffff")
            .attr("y",function(d,i){
               return i *80 + 25;
            }).attr("x",5)
            .text(function(d){
              return d.payload.name
            })
 }

}

