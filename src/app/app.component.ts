import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import {MultiSelectModule} from 'primeng/multiselect';
import { FsService } from './shared/fs.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
  :host ::ng-deep .ui-multiselected-item-token,
  :host ::ng-deep .ui-multiselected-empty-token {
      padding: 2px 4px;
      margin: 0 0.286em 0 0;
      display: inline-block;
      vertical-align:middle;
      height: 1.857em;
  }

  :host ::ng-deep .ui-multiselected-item-token {
      background: #007ad9;
      color: #ffffff;
  }

  :host ::ng-deep .ui-multiselected-empty-token {
      background: #d95f00;
      color: #ffffff;
  }
`]
})
export class AppComponent implements OnInit {
  constructor(private fsService: FsService)
  {
    // this.employees = this.ProjEmpMap;
  //   this.projects = [
  //     {label: 'PRO 1', value: 'PRO 1'},
  //     {label: 'PRO 2', value: 'PRO 2'},
  //     {label: 'PRO 3', value: 'PRO 3'},
  //     {label: 'PRO 4', value: 'PRO 4'},
  //     {label: 'PRO 5', value: 'PRO 5'},

  // ];
  }
  title = 'finTimesheet';

  projects: SelectItem[] =[];
  employees: SelectItem[];
  endDate1: any;
  startDate1: any;
  selectedProjects1: string;
  selectedEmployees1: string[] = [];
   projArry =[];
   ProjEmpMap = [];
  ngOnInit() {
    this.fsService.getInformation().subscribe(data => {
      console.log(data);
      this.getEffcncy(this.flateDAta(data));
    });
  }
  getEffcncy(timeMap) {
    let totalExpectedHrs = 0;
    let totalAcctualHrs = 0;

    let  dayFilter = true;
    let startDate = moment('10/02/2020', 'DD/MM/YYYY'); // start Date
    let endDate = moment('16/02/2020', 'DD/MM/YYYY'); // end Date

    // Projct in array and emp name in Array

    timeMap['Judo Bank']['Himanshu Rajpurohit'].forEach(day => {
      if (!dayFilter) {
        totalExpectedHrs += day.expectedHrs;
        totalAcctualHrs += day.actualHrs;
      } else {
        let curr = moment(new Date(day.date));
        if (curr >= startDate && curr <= endDate) {
          totalExpectedHrs += day.expectedHrs;
          totalAcctualHrs += day.actualHrs;
        }
      }
    });

    const Effcny = (totalAcctualHrs / totalExpectedHrs) * 100;
    console.log(Effcny);
  }

  flateDAta(timeDB) {

    let timeMap = {};
    let templateData = {};
    this.projArry = [];
    this.ProjEmpMap = [];
    // console.log(timeDB)
    timeDB.forEach(week => {
      templateData = {};
      templateData['employeeName'] = week.employeeName;
      templateData['projectName'] = week.projectName;

      if( this.projArry.indexOf(week.projectName) < 0) {
        this.projArry.push(
        week.projectName
            // value: week.projectName
        );
      }
      // this.projects = this.projArry;
      if (this.ProjEmpMap.hasOwnProperty(week.projectName) && this.ProjEmpMap[week.projectName].indexOf(week.employeeName) < 0) {
        this.ProjEmpMap[week.projectName].push(week.employeeName);
        } else {
          this.ProjEmpMap[week.projectName] = [];
          this.ProjEmpMap[week.projectName].push(week.employeeName);
        }


      week.weekData.forEach(day => {
        templateData['expectedHrs'] =
          moment(new Date(day.date)).isoWeekday() > 5
            ? 0
            : +(+week.expectedHrs / 5);
        templateData['actualHrs'] = day.hours;
        templateData['date'] = day.date;

        if (timeMap[week.projectName]) {
          timeMap[week.projectName][week.employeeName]
            ? timeMap[week.projectName][week.employeeName].push(
                JSON.parse(JSON.stringify(templateData))
              )
            : (timeMap[week.projectName][week.employeeName] = [
                ...[JSON.parse(JSON.stringify(templateData))]
              ]);
        } else {
          timeMap[week.projectName] = {}; // creating project map
          timeMap[week.projectName][week.employeeName] = [
            ...[JSON.parse(JSON.stringify(templateData))]
          ]; // creating employee []
        }
      });
    });
    // console.log(this.projArry);

    console.log(this.ProjEmpMap);
    console.log(this.ProjEmpMap['Judo Bank']);

    // this.projects = this.projArry;
    this.projects = []
    this.projArry.forEach(element => {
      this.projects.push({
        label: element,
        value: element
      })
    });
    // console.log('sudjfgsdhjsh')
    return timeMap;
  }
 callme()
 {
  for(let key in (this.ProjEmpMap)){
    if(key === this.selectedProjects1){
      this.employees = this.ProjEmpMap[key];
    // console.log(this.employees)
    this.employees=[];
      this.ProjEmpMap[key].forEach(element => {
        this.employees.push({
          label: element,
          value: element
        })
      });
      console.log(this.ProjEmpMap[key]);
      console.log(this.employees);
    }
  }
  this.ProjEmpMap
   console.log(this.selectedProjects1);
   console.log(this.selectedEmployees1);
   console.log(this.startDate1);
   console.log(this.endDate1);

 }

}
