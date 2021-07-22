import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { Router , ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { data } from 'jquery';
declare var $: any;
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  subjectId: any;
  notes: any;
  noteTitle: any;
  noteId: any;
  notesName: any;
  subject = '';
  summariesData: any;
  cuesData = [];
  constructor(private commonService: CommonService, private _router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.subjectId = params.subjectId;
    });
    this.getNotesForSubje();
  }

  getNotesForSubje(){
    this.spinner.show();
    this.commonService.get(`getNotesBySubject/${this.subjectId}`).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data.data)
      if (data?.data?.length > 0){
        this.notes = data.data;
        this.subject = data.data[0].subjectId.subjectName;
        localStorage.setItem('location', this.subject);
      }else{
        this.notes = [];
      }
    });

  }
  editNotes(note, id){
   // alert(note)
    this.noteTitle = note;
    this.noteId = id;
  }

  createNotes(){
    let body = {
      subjectId: this.subjectId ? this.subjectId : '',
      notesName: this.notesName
    };
    this.spinner.show();

      this.commonService.post('createNotes', body).subscribe((data: any) => {
        this.spinner.hide();

        if (data.status == 200){
          this.notesName = '';
          this.getNotesForSubje()
          $('#exampleModalCenter1').modal('hide');
        }
        else if (data.status == 204){
          Swal.fire('Notes already exists!!',
          'please try another Notes name !!',
          'error');
        }
      },
      (error) => {

      });
  }

  updateNote(){
    this.spinner.show();
    let body = {
      noteTitle: this.noteTitle,
      noteId: this.noteId
    };
    console.log(body);
    this.commonService.post('updateNotes', body).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data)
      if (data.status == 200){
        $('#exampleModalCenter3').modal('hide');
      }
      else if (data.status == 204){
        Swal.fire('Notes already exists!!',
        'please try another Notes name !!',
        'error');
      }
    },
    (error) => {

    });
  }

  deleteNotes(id){
    this.commonService.delete('deleteNotes', id).subscribe((data: any) => {
      console.log(data)
      if (data.status == 200){
        this.getNotesForSubje()
      }
    });
  }
  cuesmodal() {
    $('#cuesmodal').modal('show');
  }
  summarymodal() {
    $('#summarymodal').modal('show');
  }
  routeOnNotes(notesName, id){
    this._router.navigate([`notesWriting/${id}`]);
  }
  openNewTabnote(id){
    window.open(`/notesWriting/${id}` , '_blank');
  }

}
