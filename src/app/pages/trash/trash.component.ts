import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  deletedData: any = [];
  constructor(private commonService: CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getDeletedData();
  }

  getDeletedData(): void {
    this.spinner.show();
    this.commonService.get(`getDeletedData`).subscribe((data: any) => {
      this.spinner.hide();
      if (data?.success) {
        this.deletedData = data.data.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
      }
    }, (error) => {
      console.log(error);
      this.spinner.hide();
    });
  }

  restoresubject(id): void {
    this.spinner.show();
    this.commonService.post('restoreSubject', { subjectId: id }).subscribe((data: any) => {
      this.spinner.hide();
      if (data?.success){
        this.getDeletedData();
      }
    }, (error) => {
      console.log(error);
      this.spinner.hide();
    });
  }

  restorNote(id): void {
    this.spinner.show();
    this.commonService.post('restoreNote', { notesId: id }).subscribe((data: any) => {
      this.spinner.hide();
      if (data?.success) {
        this.deletedData = this.deletedData.filter(({_id}) => _id !== id);
      }
    }, (error) => {
      console.log(error);
      this.spinner.hide();
    });
  }

  private checkKey(data,key: string) {
    // console.log(data,key)
    console.log(data.hasOwnProperty(key))
    return(data.hasOwnProperty(key))
   // this.mapToSearch[newKey] = newValue;
  }

}
