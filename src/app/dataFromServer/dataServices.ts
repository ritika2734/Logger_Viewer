import { Injectable } from '@angular/core';
import { DataFromServerModel } from './dataFromServerModel';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'


@Injectable()
export class DataServices {
   constructor( private httpClient : HttpClient) {}
   private data = { data : []};  
  
   setOption(option : any, value :any) {      
      this.data[option] = value;  
    }  
    
    getOption() {  
      return this.data;  
    }  
   
   getUserActivityByDate(data : DataFromServerModel [], user_id : String, selected_date : Date) {
    //[{name : string ,count: number}]
    let activityArr : { name : String, count_num : number} []=[]  ;
    let actionsArrName :String [] = [];
    let actionsArrCount : number [] = [];
    let userActivity = data.filter(function(currentValue, index, arr) {
      return currentValue.user_id == user_id && (currentValue.date).split('T')[0] == selected_date.toString()
    })
    
    userActivity.forEach(function(value,index){
               if(typeof actionsArrName.length == 'undefined'){
            // New Element Add with count 1
              actionsArrName.push(value.action);
            actionsArrCount.push(1);
        }else{
            // Check if it exist if yes increase the count by 1
          if(actionsArrName.includes(value.action)){
                  let index = actionsArrName.indexOf(value.action);
              actionsArrCount[index] = actionsArrCount[index]+1
          }else{
              // Add the new element
              actionsArrName.push(value.action);
            actionsArrCount.push(1);
          }
        }					 
    });

    for(let i: number=0;i<actionsArrName.length;i++ ){
         activityArr[i]= ({name :actionsArrName[i],count_num: actionsArrCount[i]});

    }
    return activityArr
}
  
   // Get the list of UserIds
   getUsers (data : DataFromServerModel []) {
      const userIds = [...new Set(data.map(item => item.user_id))];
      return userIds;
    }


     // Get all the data from the url
    getDataFromServer() : Observable<any>{
        return this.httpClient.get('https://s3.eu-west-2.amazonaws.com/sample-sray-logs-coding-interview/sray-logs.json')

    }

    
    // Get the objects of selected companies based on user_id and date
     getSelectedCompaniesByDate(data :  DataFromServerModel [], user_id : String,selected_date: Date)  {
      let selectedCompanies =[]
      selectedCompanies = data.filter(function(currentValue, index, arr) {
           
    //let  date_activity = new Date(currentValue.date);
          return currentValue.action=='SELECT_COMPANY' && currentValue.user_id == user_id && (currentValue.date).split('T')[0] == selected_date.toString()
      });
    
      return selectedCompanies;
    }
  
}