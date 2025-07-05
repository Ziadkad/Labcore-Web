import {Component, Input} from '@angular/core';
import {TaskItem} from "../../../../Shared/Interfaces/Project/TaskItem/task-item";

@Component({
  selector: 'app-task-item-view',
  templateUrl: './task-item-view.component.html',
  styleUrl: './task-item-view.component.css'
})
export class TaskItemViewComponent {
  @Input() taskItem!: TaskItem;
}
