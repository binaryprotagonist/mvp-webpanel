import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

// import * as $ from 'jquery';

declare var $: any;
declare global {
  interface Window {
    FB: any;
    attachEvent: any;
  }
}
@Component({
  selector: 'app-quick-acess',
  templateUrl: './quick-acess.component.html',
  styleUrls: ['./quick-acess.component.css']
})

export class QuickAcessComponent implements OnInit {
  subjectTitle: any;
  subjects: any;
  searchSubjects: any;
  selectedSub: any;
  subjectId: any;
  notesName: any;
  notes: any;
  noteTitle: any;
  noteId: any;
  PlanStatus: any;

  filteredNotes;
  filteredSubjects = [];
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

  constructor(private commonService: CommonService,
              private _router: Router,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService) { }
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const apiList = [
      this.commonService.get(`getUser`).pipe(catchError(error => of(null))),
      this.commonService.get(`getSubjects`).pipe(catchError(error => of(null))),
      this.commonService.get(`getNotes`).pipe(catchError(error => of(null)))
    ];

    this.spinner.show();
    forkJoin(apiList).subscribe((results) => {
      this.spinner.hide();
      if (results[0]?.success) {
        this.PlanStatus = results[0].result.PlanStatus;
      }
      if (results[1]?.success) {
        this.subjects = results[1].data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        this.filteredSubjects = [...this.subjects];
      }
      if (results[2]?.success) {
        this.notes = results[2].data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        this.filteredNotes = [...this.notes];
      }
    }, (error) => {
      this.spinner.hide();
    });
  }

  addModal() {
    this.subjectTitle = '';
    $('#exampleModalCenter').modal('show');

  }
  addNotesModal() {
    this.notesName = '';
    this.selectedSub = '';
    this.searchSubjects = [];
    $('#exampleModalCenter1').modal('show');

  }
  getUser() {
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        console.log(data.result);
        this.PlanStatus = data.result.PlanStatus;
      }
    });
  }
  creteSubject() {
    if (this.PlanStatus == 'Active') {
      this.spinner.show();
      let body = {
        subjectTitle: this.subjectTitle
      };
      this.commonService.post('createSubject', body).subscribe((data: any) => {
        this.spinner.hide();
        if (data.status == 200) {
          console.log('data: ' + data);

          $('#exampleModalCenter').modal('hide');
          this.getSubjects();
        }
        else if (data.status ==204){
          Swal.fire('Subject already exists!!',
          'please try another subject name !!',
          'error');
        }
        if (data.status == 403) {
          this.spinner.hide();

          Swal.fire('Please Subscribe new Plan !!',
            'Your subscription subject limit reached!!',
            'error');
          $('#exampleModalCenter').modal('hide');
        }
        else {
        }
      },
        (error) => {
          this.spinner.hide();
        });
    }
    else {
      Swal.fire('Please Subscribe new Plan !!',
        'Your subscription are Expired',
        'error');
      $('#exampleModalCenter').modal('hide');
    }
  }
  updateSubject() {
    if (this.PlanStatus == 'Active') {
      this.spinner.show();
      let body = {
        subjectTitle: this.subjectTitle,
        subjectId: this.subjectId
      };
      this.commonService.post('updateSubject', body).subscribe((data: any) => {
        this.spinner.hide();
        if (data.status == 200) {
          $('#exampleModalCenter2').modal('hide');
          this.getSubjects();
        }
        else if (data.status ==204){
          Swal.fire('Subject already exists!!',
          'please try another subject name !!',
          'error');
        }
      },
        (error) => {
        });
    }
    else {
      Swal.fire('Please Subscribe new Plan !!',
        'Your subscription are Expired',
        'error');
      $('#exampleModalCenter2').modal('hide');
    }
  }
  editNotes(note, id) {
    // alert(note)
    this.noteTitle = note;
    this.noteId = id;

  }
  updateNote() {
    if (this.PlanStatus == 'Active') {

      let body = {
        notesName: this.noteTitle,
        noteId: this.noteId
      };
      this.spinner.show();
      this.commonService.post('updateNotes', body).subscribe((data: any) => {
        // console.log(data)
        this.spinner.hide();
        if (data.status == 200) {
          $('#exampleModalCenter3').modal('hide');
          this.getNotes();
        }
        else if (data.status ==204){
          Swal.fire('Notes already exists!!',
          'please try another Notes name !!',
          'error');
        }
      },
        (error) => {
        });
    }
    else {
      Swal.fire('Please Subscribe new Plan !!',
        'Your subscription are Expired',
        'error');
      $('#exampleModalCenter3').modal('hide');
    }
  }
  getSubjects() {
    this.spinner.show();
    this.commonService.get(`getSubjects`).subscribe((data: any) => {
      // console.log(data.data)
      if (data.status == 200) {
        this.subjects = data.data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        this.filteredSubjects = this.subjects;
        this.spinner.hide();
      } else {
        this.subjects = [];
        this.spinner.hide();
      }
    });
  }

  searchSubject(event) {
    let value = event.target.value;
    let body = {
      subjectName: value
    };
    this.commonService.post('searchSubject', body).subscribe((data: any) => {
      if (data.status == 200) {
        this.searchSubjects = data.data;
      } else {
        this.searchSubjects = [];
      }

    });
  }
  routeOnSubject(selectedSub, id) {
    this.selectedSub = selectedSub;
    this.subjectId = id;
    this._router.navigate([`notes/${this.subjectId}`]);

  }
  openNewTabSubject(id) {
    this.subjectId = id;
    window.open(`/notes/${this.subjectId}`, '_blank');
  }

  routeOnNotes(notesName, id) {
    this._router.navigate([`notesWriting/${id}`]);
  }
  openNewTabnote(id) {
    window.open(`/notesWriting/${id}`, '_blank');
  }
  selectSubject(selectedSub, id) {
    // alert(id)
    this.selectedSub = selectedSub;
    this.subjectId = id;
    this.searchSubjects = [];
    //this._router.navigate([`notes/${this.subjectId}`]);



  }
  createNotes() {
    if (this.PlanStatus == 'Active') {
      this.spinner.show();
      let body = {
        subjectId: this.subjectId ? this.subjectId : '',
        notesName: this.notesName
      };
      this.commonService.post('createNotes', body).subscribe((data: any) => {
        console.log(data);
        this.spinner.hide();
        if (data.status == 200) {
          this.getNotes();
          $('#exampleModalCenter1').modal('hide');
        }  else if (data.status ==204){
          Swal.fire('Notes already exists!!',
          'please try another Notes name !!',
          'error');
        }

      },
        (error) => {
        });
    }
    else {
      Swal.fire('Please Subscribe new Plan !!',
        'Your subscription are Expired',
        'error');
      $('#exampleModalCenter2').modal('hide');
    }
  }

  getNotes() {
    this.spinner.show();
    this.commonService.get(`getNotes`).subscribe((data: any) => {
      console.log(data.data);
      if (data.status == 200) {
        this.notes = data.data;
        this.notes = this.notes.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        this.filteredNotes = this.notes;
        this.spinner.hide();
      }
    });
  }
  //
  onDeleteSubject(id) {
    Swal.fire({
      title: 'Move to trash',
      text: 'Are you sure to move this Subject to Trash?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((willDelete) => {
        if (willDelete.value) {
          this.deleteSubject(id);
        }
        console.log(willDelete);
      });
  }
  //
  deleteSubject(id) {
    this.spinner.show();
    this.subjectId = id;
    this.commonService.delete('deleteSubject', this.subjectId).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        this.getSubjects();
      } else {
        this.spinner.hide();
      }
    }, (error) => {
        this.spinner.hide();
    });
  }
  onDeleteNotes(id) {
    Swal.fire({
      title: 'Move to trash',
      text: 'Are you sure to move this Note to Trash?',
      confirmButtonColor: 'Red',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.deleteNotes(id);
        } else {
          // Swal.fire("Fail");
        }
      });
  }
  deleteNotes(id) {
    this.spinner.show();
    this.commonService.delete('deleteNotes', id).subscribe((data: any) => {
      console.log(data);
      if (data.status == 200) {
        this.spinner.hide();
        this.getNotes();
      }
    });
  }
  editSubject(subject, id) {
    // alert("enter")
    this.subjectTitle = subject;
    this.subjectId = id;
  }


  onValueChange(value: Date): void {
    this.filteredNotes = this.notes.filter(m => moment(m.createdAt).format('MMM Do YYYY') === moment(value).format('MMM Do YYYY'));
    this.filteredSubjects = this.subjects.filter(m => moment(m.createdAt).format('MMM Do YYYY') === moment(value).format('MMM Do YYYY'));
  }
  movesNotes(note, id) {
    this.noteTitle = note;
    this.noteId = id;
  }
  moveNote() {
    if (this.PlanStatus == 'Active') {
      let body = {
        notesName: this.noteTitle,
        noteId: this.noteId,
        subjectId: this.subjectId,
      };
      this.spinner.show();
      this.commonService.post('updateNotes', body).subscribe((data: any) => {
        this.spinner.hide();
        $('#movenotesModalCenter3').modal('hide');
        if (data.status == 200) {
          Swal.fire(
            'Moved',
            'Note has been moved successfully',
            'success'
          );
        } else {
          Swal.fire(
            'Error Occured',
            'Internal Server Error',
            'error'
          );
        }
      }, (error) => {
        this.spinner.hide();
        $('#movenotesModalCenter3').modal('hide');
        Swal.fire(
          'Error Occured',
          'Internal Server Error',
          'error'
        );
      });
    }
    else {
      Swal.fire('Please Subscribe new Plan !!',
        'Your subscription are Expired',
        'error');
      $('#movenotesModalCenter3').modal('hide');
    }
  }
}
