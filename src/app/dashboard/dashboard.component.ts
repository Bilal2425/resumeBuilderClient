import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  resumeData: any;

  constructor(private router: Router){}

  ngOnInit(): void {

    const storedResumeData = localStorage.getItem('resumeData');
    if(storedResumeData){
      this.resumeData = JSON.parse(storedResumeData);
    }

  }

  buildResume(){

    if(this.resumeData){
      this.router.navigate(['/resume-builder'], {state: {resume: this.resumeData}});
    }
    else
    {
      this.router.navigate(['/resume-builder']);
    }

   
  }

}
