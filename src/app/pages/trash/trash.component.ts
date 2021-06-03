import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  deletedData:any;
  constructor(private commonService: CommonService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getDeletedData();
  }

  getDeletedData(){
    this.spinner.show();
    this.commonService.get(`getDeletedData`).subscribe((data: any)=>{
      if(data.status==200){
        console.log("........",data.data)
      this.deletedData=data.data.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      this.spinner.hide();
      console.log(this.deletedData)

      }else{
        this.deletedData=[]
        this.spinner.hide();
      }

  })



}

restoresubject(id){
  let body={
    subjectId:id
  }
  this.spinner.show();
  this.commonService.post('restoreSubject',body).subscribe((data: any)=>{
    if(data && data.status==200){

      this.getDeletedData();
      this.spinner.hide();
    }else{
      this.spinner.hide();
    }
  })
}
restorNote(id){
  this.spinner.show();
  let body={
    notesId:id
  }
  this.commonService.post('restoreNote',body).subscribe((data: any)=>{
    if(data && data.status==200){
      this.getDeletedData();
      this.spinner.hide();
    }else{
      this.spinner.hide();

    }
  })

}
private checkKey(data,key: string) {
  // console.log(data,key)
  return(data.hasOwnProperty(key))
 // this.mapToSearch[newKey] = newValue;
}

}
