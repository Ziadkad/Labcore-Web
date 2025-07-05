import {Component, Input} from '@angular/core';
import {Study} from "../../../../Shared/Interfaces/Project/Study/study";
import {Router} from "@angular/router";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrl: './study-card.component.css'
})
export class StudyCardComponent {
  @Input() study!: Study;

  riskLevelsMap: Record<number, string> = {
    0: 'Low',
    1: 'Medium',
    2: 'High'
  };
  constructor(private  router: Router) {
  }

  onClickHandler(studyId: Guid){
    this.router.navigate(['/study', studyId]);
  }

  getStatusLabel(riskLevel: number): string {
    return this.riskLevelsMap[riskLevel];
  }

  getRiskLevelClass(riskLevel: number): string {
    switch (riskLevel) {
      case 0:
        return 'bg-green-500'; // Low
      case 1:
        return 'bg-yellow-500'; // Medium
      case 2:
        return 'bg-red-500'; // High
      default:
        return 'bg-gray-400'; // Fallback
    }
  }


  protected readonly parseInt = parseInt;
}
