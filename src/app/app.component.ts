import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import {MultiSelectModule} from 'primeng/multiselect';
import { FsService } from './shared/fs.service';
import * as moment from 'moment';
import { stringify } from 'querystring';


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
  constructor(private fsService: FsService) {
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
  projects: SelectItem[] = [];
  employees: SelectItem[];
  endDate1: any;
  startDate1: any;
  disabledvalue=true;
  selectedProjects1: string;
  selectedEmployees1: string[] = [];
   projArry = [];
   timeMap ;
   ProjEmpMap = [];
   employeeSelected;
   Effcny;
   eData = []; // cstores employee name and corresponding efficiency !
  ngOnInit() {
    this.fsService.getInformation().subscribe(data => {
      // console.log(data);
      this.timeMap = this.flateDAta(data) ;
    });


  }
  getEffcncy(strDate, endDAte, proj, emp) {
    let totalExpectedHrs = 0;
    let totalAcctualHrs = 0;

    const  dayFilter = true;
    const startDate = moment(strDate, 'DD/MM/YYYY'); // start Date
    const endDate = moment(endDAte, 'DD/MM/YYYY'); // end Date


    // Projct in array and emp name in Array

    this.timeMap[proj][emp].forEach(day => {
      this.employeeSelected=emp;
      if (!dayFilter) {
        totalExpectedHrs += day.expectedHrs;
        totalAcctualHrs += day.actualHrs;
        // console.log('in day filter');
      } else {
        const curr = moment(new Date(day.date));
        if (curr >= startDate && curr <= endDate) {
          totalExpectedHrs += day.expectedHrs;
          totalAcctualHrs += day.actualHrs;
          // console.log('else in day filter');
        }
      }
    });

    this.Effcny = (totalAcctualHrs / totalExpectedHrs) * 100;
    console.log(emp, this.Effcny, totalAcctualHrs, totalExpectedHrs);
    this.eData.push({
      empName: emp,
      efficiency:this.Effcny
    });
    console.log(this.eData);
  }

  flateDAta(timeDB) {

    const timeMap = {};
    let templateData: any = {};
    this.projArry = [];
    this.ProjEmpMap = [];
    console.log(timeDB); //add check value here
    this.disabledvalue = false;
    timeDB.forEach((week: any) => {
      templateData = {};
      templateData.employeeName = week.employeeName;
      templateData.projectName = week.projectName;

      if ( this.projArry.indexOf(week.projectName) < 0) { //(week.projectName) < 0
        this.projArry.push(
        week.projectName
            // value: week.projectName
        );
      }
      // console.log(this.ProjEmpMap)
      // this.projects = this.projArry;
      if (this.ProjEmpMap.hasOwnProperty(week.projectName) && this.ProjEmpMap[week.projectName].indexOf(week.employeeName) < 0) {
        this.ProjEmpMap[week.projectName].push(week.employeeName);
        } else {
          this.ProjEmpMap[week.projectName] = [];
          this.ProjEmpMap[week.projectName].push(week.employeeName);
        }


      week.weekData.forEach(day => {
        templateData.expectedHrs =
          moment(new Date(day.date)).isoWeekday() > 5
            ? 0
            : +(+week.expectedHrs / 5);
        templateData.actualHrs = day.hours;
        templateData.date = day.date;

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

    // console.log(this.ProjEmpMap);
    // console.log(this.ProjEmpMap['Judo Bank']);

    // this.projects = this.projArry;
    this.projects = [];
    this.projArry.forEach(element => {
      this.projects.push({
        label: element,
        value: element
      });
    });

    // console.log('sudjfgsdhjsh')
    return timeMap;
  }
 callme() {

  for (const key in (this.ProjEmpMap)) {
    if (key === this.selectedProjects1) {
      this.employees = this.ProjEmpMap[key];
    // console.log(this.employees)
      this.employees = [];
      this.ProjEmpMap[key].forEach(element => {
        this.employees.push({
          label: element,
          value: element
        });
      });
      console.log(this.ProjEmpMap[key]);
      console.log(this.employees);
    }
  }

  this.ProjEmpMap;

  // console.log(this.startDate1);
  // console.log(this.endDate1);

  console.log(this.selectedProjects1);
}

 callme2(){
   console.log(this.selectedEmployees1);
 }

 callme3(){
  console.log(this.startDate1);
 }

 callme4() {
 console.log(this.endDate1);
 // tslint:disable-next-line: whitespace
 // tslint:disable-next-line: prefer-for-of

}
finalcall(){

 for(let i=0; i<this.selectedEmployees1.length; i++) {

  this.getEffcncy(this.startDate1,this.endDate1,this.selectedProjects1,this.selectedEmployees1[i]);

  }
}
}
