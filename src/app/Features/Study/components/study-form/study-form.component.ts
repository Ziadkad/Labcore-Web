import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudyService} from "../../../../Core/Services/project-service/study.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {Study} from "../../../../Shared/Interfaces/Project/Study/study";
import {RiskLevel} from "../../../../Shared/Interfaces/Project/Study/risk-level";
import {editorModules} from "../../../../Shared/Quilljs/editorModules";

@Component({
  selector: 'app-study-form',
  templateUrl: './study-form.component.html',
  styleUrl: './study-form.component.css'
})
export class StudyFormComponent implements OnInit {
  isAdd: boolean = true;
  StudyForm! : FormGroup;
  submitted: boolean = false;
  studyId! : Guid;
  projectId!: Guid;
  study! :Study;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly studyService: StudyService,
              private readonly toastr: ToastrService,
              private readonly route : ActivatedRoute,
              private readonly router: Router,
              ) {


  }

  ngOnInit(): void {
    this.StudyForm = this.formBuilder.group({
      id: [null as unknown as Guid],
      title: ['', [Validators.required]],
      objective: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      riskLevel: [null as unknown as RiskLevel, Validators.required],
      projectId: [null],
    })

    this.route.params.subscribe(params => {
      if (params['projectId']) {
        this.isAdd = true;
        this.projectId = params['projectId'];
        this.StudyForm.patchValue({ projectId: this.projectId } as Partial<Study>);
      }
      else if (params['studyId']) {
        this.isAdd = false;
        this.studyId = params['studyId'];
        this.studyService.getStudy(this.studyId).subscribe({
          next: (study) => this.patchForm({
            id: this.studyId,
            title: study.title,
            objective: study.objective,
            description: study.description,
            startDate: new Date(study.startDate).toISOString().slice(0, 10),
            endDate: new Date(study.endDate).toISOString().slice(0, 10),
            riskLevel: study.riskLevel
          }),
          error: ():void => {this.router.navigate(['/'])}// En cas d'erreur, redirection
        });
      }
      else {
          this.router.navigate(['/']);
      }
    });

  }

  patchForm(study : any): void {
    const statusIndex = study.riskLevel as unknown as number;
    const riskLevelString = Object.values(RiskLevel)[statusIndex] as RiskLevel;
    this.StudyForm.patchValue({
      id: study.id,
      title: study.title,
      objective: study.objective,
      description: study.description,
      startDate: study.startDate,
      endDate: study.endDate,
      riskLevel: riskLevelString,
      projectId: study.projectId,
    });
  }
  onSubmitForm(){
    this.submitted = true;
    if(this.StudyForm.valid) {
      if (this.isAdd) {
        this.createStudy();

      } else {
        this.editStudy();
      }
    }
  }
  createStudy(){
    this.studyService.createStudy(this.StudyForm.value).subscribe({
      next: (data) => {
        this.toastr.success("Your study was added successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/study', data.id]);
      },
      error: (error) => {
        console.log(error.message);
        this.toastr.error("Failed to add the study. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    });
  }

  editStudy(){
    this.studyService.updateStudy(this.studyId,this.StudyForm.value).subscribe({
      next: (data) => {
        this.toastr.success("The study  was updated successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/study', data.id]);
      },
      error: (error) => {
        this.toastr.error("Failed to update the study. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    });
  }

  cancel(){
    if(this.isAdd){
      this.router.navigate(['/project', this.projectId])
    }
    else{
      this.router.navigate(['/study', this.studyId])
    }
  }
  editorModules = editorModules;
  riskLevelOptions = Object.values(RiskLevel);

}
