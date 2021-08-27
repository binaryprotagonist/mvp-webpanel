import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonService } from '../../core/services/common.service';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import jspdf from 'jspdf';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import * as html from 'html2pdf.js';

import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';
import { of } from 'rxjs/internal/observable/of';
import { merge } from 'rxjs'
import Swal from 'sweetalert2';
import * as mark from 'mark.js';

declare var $: any;
@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value): SafeHtml {
    if (value === undefined){
      value = null;
    }
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-notes-writing',
  templateUrl: './notes-writing.component.html',
  styleUrls: ['./notes-writing.component.css']
})



export class NotesWritingComponent implements OnInit {
  @ViewChild('container', { read: ElementRef })
  public readonly containerElement;
  form: FormGroup;
  content: any
  htmlContent = ''
  notes: any;
  cuesTitle: any
  content1: any;
  content2: any
  noteId: any
  notesContent: any
  cuesContent: any
  summaryContent: any
  summaryTitle: any
  noteTitle: any
  debounce: any
  timeAgo: any
  email = ''
  emailError: any
  shareWith: any
  searchSubjects: any
  selectedSub: any
  subjectId: any;
  notesName: any;
  copyNotes: any
  newNotes: any;
  location: any;
  createdAt: any;
  updatedAt: any
  firstName: any;
  lastName: any;
  profileImage: any;
  PlanName: any
  internet: any = true
  findText: any
  replaceText: any
  findCount: number = 0
  readonly AngularResizeElementDirection = AngularResizeElementDirection;
  data: any = {};
  onlineOffline: any
  subjects: any
  subjectsId: string
  findResults;
  findResultsCurrentIndex = 0;
  markInstance;
  clickedOnNotesSection = true;
  onResize(evt: AngularResizeElementEvent): void {
    if (evt.currentWidthValue > 180 && evt.currentWidthValue < 1100) {
      this.data.width = evt.currentWidthValue;
    }
    this.getContent()
  }
  onResize1(evt: AngularResizeElementEvent): void {
    if (evt.currentHeightValue < 825 && evt.currentHeightValue > 400) {
      this.data.height = evt.currentHeightValue;
    }
    this.getContent()
  }
  constructor(private _router: Router, private toastr: ToastrService, private commonService: CommonService, private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService) {
    this.onlineOffline = merge(of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => {
        true
        this.internet = true
      })),
      fromEvent(window, 'offline').pipe(map(() => {
        false
        this.internet = false
      }
      ))
    );
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
    this.getNote()
    this.getUser()
    this.getSubjects()
    this.markInstance = new mark(document.querySelector('.editor'));
    $('#exampleModalCenter6').on('hidden.bs.modal', (e) => {
      this.markInstance.unmark();
      const findInput = document.querySelector('#findTextInput') as HTMLInputElement;
      findInput.value = '';
    });

    const aLink = document.querySelector('a');
    aLink.contentEditable = 'false';
    aLink.addEventListener('mouseover', () => {
      console.log('alink');
      window.open(aLink.href, '_blank');
    });

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey) {
        this.internet = false;
        document.getElementById('notes').contentEditable = 'false';
      }
      if (event.ctrlKey && event.key === 'f') {
        this.showFindAndReplaceModal();
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        document.execCommand('indent',false,null)
      }
      if (event.shiftKey && event.key === 'Tab') {
        event.preventDefault();
        document.execCommand('outdent', false, null);
        document.execCommand('outdent',false,null)
      }
    });


    document.addEventListener('keyup', (event) => {
      if (event.key === 'Control') {
        this.internet = true;
        document.getElementById('notes').contentEditable = 'true';
      }
    });
  }

  ngAfterViewInit() { }

checkStyle(){
  $('#notes').delegate('*', 'click',function (e) {
    // console.log("style",e.target.parentNode.firstElementChild);
        console.log('style',e);

  });
}

  getUser() {
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        this.firstName = data.result.FullName;
        // this.lastName = data.result.lastName;
        this.profileImage = data.result.profileImage
        this.PlanName = data.result.PlanName
      }
    })
  }
  signOut() {
    localStorage.clear()
    this.router.navigate(['login']);
    location.reload();

  }
  getSubjects() {
    this.spinner.show();
    this.commonService.get(`getSubjects`).subscribe((data: any) => {
      console.log(data.data)
      if (data.status == 200) {
        this.subjects = data.data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        this.spinner.hide();

      } else {
        this.subjects = []
        this.spinner.hide();

      }
    })
  }
  getSubjectsId(id: string) {
    this.spinner.show();
      let body = {
        notesName: this.notesName,
      noteId: this.noteId,
      subjectId: id,
    }
    this.commonService.post('updateNotes', body).subscribe((data: any) => {
      // console.log(data)
      this.spinner.hide();
      if (data.status == 200) {
        this.toastr.success('Notes move to subject', 'success');

      }
      else{

      }
    },
      (error) => {
      })


  }

  //

  onKeyUp(e) {
    // console.log(this.media1.nativeElement.innerHTML)
    this.content = e.target.innerHTML
    let placeholderText = e.target.innerText;
    e.target.innerText = '';
    e.target.innerText = placeholderText;

    if (e.target.innerText && document.createRange) {
      let range = document.createRange();
      let selection = window.getSelection();
      range.selectNodeContents(e.target);
      range.setStart(e.target.firstChild, e.target.innerText.length);
      range.setEnd(e.target.firstChild, e.target.innerText.length);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    console.log('this.content', this.content)

  }


  getContent() {
    this.notesContent = document.getElementById('notes').innerHTML;
    this.cuesContent = document.getElementById('cues').innerHTML;
    this.summaryContent = document.getElementById('summary').innerHTML;
    //alert(this.cuesContent)
    this.autoUpdate()
  }

  getImage(event): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    let dataURI;
    reader.addEventListener('load', () => {
        dataURI = reader.result;
        const img = document.createElement('img');
        img.src = dataURI;
        img.classList.add('pdf-image');
        img.style.height = '300px';
        const editorContent = document.querySelector('.editor_ab div');
        editorContent.appendChild(img);
      }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
    const inputFile = document.getElementById('getImage') as HTMLInputElement;
    inputFile.value = '';
    this.getContent()
  }
  execCommandWithArg(command, arg) {
   
    // Set design mode to on
    document.designMode = 'on';
   
    document.execCommand(command, false, arg);
    
    document.designMode = 'off';
    this.getContent()

  }
  execCommand(event, command, arg) {

    //console.log(event.target.classList)

    if (event.target.classList.contains('mystyle')) {
      event.target.classList.remove('mystyle')
    } else {
      event.target.classList.add('mystyle')
    }

    document.execCommand(command, false, '');
    this.getContent()
  }

  /* execute functiom for color and backg*/
  changeTextColor(color): void {
    document.execCommand('foreColor', false, color.toString());
    document.getElementById('selectTextColorBox').style.backgroundColor = color;
    this.getContent()
  }

  changeBackgroundColor(color): void {
    document.execCommand('hiliteColor', false, color.toString());
    document.getElementById('selectBackgroundColorBox').style.backgroundColor = color;
    this.getContent();
  }

  link() {
    const url = prompt('Enter the URL');
    document.execCommand('createLink', false, url);
    const aLink = document.querySelector('a');
    aLink.contentEditable = 'false';
    aLink.addEventListener('click', () => {
      window.open(aLink.href, '_blank');
    });
  }
  getNote() {
    this.spinner.show();
    let myMainSite = this.router.url
    var splitUrl = myMainSite.split('/');
    // console.log("spliturl",splitUrl)
    this.noteId = splitUrl[2]
    this.commonService.get(`getNote/${this.noteId}`).subscribe((data: any) => {
      if (data.status == 200) {
        console.log('...........', data.data)
        if (data.data[0].subjectId == null) {
          localStorage.removeItem('location');

        }
        if (data.data[0].hasOwnProperty('height') && data.data[0].height != null && data.data[0].height != '') {

          this.data.height = data.data[0].height
        }
        if (data.data[0].hasOwnProperty('width') && data.data[0].width != null && data.data[0].width != '') {
          this.data.width = data.data[0].width

        }
        this.notesName = data.data[0].notesName
        this.updatedAt = data.data[0].updatedAt
        this.createdAt = data.data[0].createdAt
        this.timeAgo = moment(data.data[0].updatedAt).fromNow()
        this.content = data.data[0].cues.cuesText
        this.cuesTitle = data.data[0].cues.cuesTitle
        this.content1 = data.data[0].notesData.notesText
        this.noteTitle = data.data[0].notesData.notesTitle
        this.shareWith = data.data[0].shareWith
        console.log('this.shareWith', this.shareWith)

        this.content2 = data.data[0].summaries.summaryText
        this.summaryTitle = data.data[0].summaries.summaryTitle
        // this.cuesTitle = data.data[0].summaries.summaryText
        this.spinner.hide();
        // this.autoUpdate()

      } else {
        this.spinner.hide();
      }
    })
  }
  autoUpdate() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.updatenote();
    }, 1000);
  }
  updatenote() {
    let body = {
      'noteId': this.noteId,
      'notesName': this.notesName,
      'subjectId': this.subjectId,
      'cues': {
        'cuesTitle': this.cuesTitle,
        'cuesText': this.cuesContent
      },
      'notesData': {
        'notesTitle': this.noteTitle,
        'notesText': this.notesContent
      },
      'summaries': {
        'summaryTitle': this.summaryTitle,
        'summaryText': this.summaryContent
      },
      'height': this.data.height,
      'width': this.data.width


    }
    // this.toastr.info('Saving');
    // console.log(body)
    this.commonService.post(`updateNotes`, body).subscribe((data: any) => {
      console.log(data.data)
      if (data.status == 200) {
        this.timeAgo = moment(data.data.updatedAt).fromNow()
      }
      else if (data.status == 204) {
        Swal.fire('Notes already exists!!',
          'please try another Notes name !!',
          'error');
      }
      else {
        console.log('datata', data)
        this.toastr.error('Not Save', 'error');
      }
    })
  }
  savePdf(value): void {
    this.notesContent = document.getElementById('notes').innerHTML;
    this.cuesContent = document.getElementById('cues').innerHTML;
    this.summaryContent = document.getElementById('summary').innerHTML;
    console.log(this.content1)
    window.scrollTo(0, 0);
    const opt = {
      margin:       0.1,
      filename:     ` ${this.notesName}.pdf`,
      image:        { type: 'jpeg', quality: 0.9 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
    };
    const element = `
    <div class="" >
      <div class="pdf-d-flex">
        <div class="pdf-cues">
          <div class="pdf-inputType">
            ${this.cuesTitle}
          </div>
          ${this.cuesContent}
        </div>
        <div class="pdf-notes">
          <div class="pdf-inputType">
            ${this.noteTitle}
          </div>
          ${this.notesContent}
        </div>
      </div>

      <div class="pdf-summarry" >
        <div>
          <div class="pdf-inputType">
            ${this.cuesTitle}
          </div>
            ${this.summaryContent}
        </div>
      </div>
    </div>
    <style>
      .pdf-d-flex{
        display:flex;
        border-bottom:1px dotted black
      }
      .pdf-cues{
        border-right:1px dotted black;
        padding:20px;
        word-wrap:break-word;
        width:2.8in;
        min-height:7in;
        font-size:14px;
        line-height: 0.2in;
      }
      .pdf-notes{
        padding:20px;
        word-wrap:break-word;
        width:5.2in;
        font-size:14px;
        line-height: 0.2in;
        min-height:7in;
      }
      .pdf-summarry{
        padding:20px;
        word-wrap:break-word;
        width:8in;
        font-size:14px;
        min-height:4in;
        line-height: 0.2in;
      }
      .pdf-inputType{
        padding:5px 10px;
        1px solid #e7e7e7;
        border-radius:30px;
        background-color: #e7e7e7;
        margin-bottom: 10px;
        width:2in;
      }

      .pdf-image {
        height: 2.2in !important;
      }
    </style>
    `;
    this.spinner.show();
    html().from(element).set(opt).save().then(() => {
      this.spinner.hide();
    });
  }

  shareWithMail() {
    let body = {
      sendTo: '',
      message: ''
    }
    this.commonService.postFile(`notesShare`, body).subscribe((data: any) => {
      // console.log("data",data)
      if (data.status == 200) {
        alert('success')
        console.log('datata', data)

      } else {
        console.log('datata', data)
        this.toastr.error('Not Save', 'error');
      }
    })
  }
  shareNoteUrl(): void {
    const reEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!this.email.match(reEmail)) {
      this.emailError = 'Invalid email address';
    }
    else {
      this.spinner.show();
      const body = {
        sendTo: this.email,
        noteId: this.noteId,
        userName: this.firstName,
        url: `https://frontendformvp.herokuapp.com/note-share/${this.noteId}`
      };
      this.commonService.post(`shareNotesUrl`, body).subscribe((data: any) => {
        console.log(data);
        this.spinner.hide();
        $('#sharemail').modal('hide');
        if (data.status == 200) {
          Swal.fire(
            'Shared Note',
            'Email has been send successfully',
            'success'
          );
          this.email = '';
        } else {
          console.log('datata', data);
          Swal.fire(
            'Email Share Failed',
            'There is an error sending email',
            'error'
          );
        }
      }, (error) => {
        Swal.fire(
          'Error',
          'Internal Server Error',
          'error'
        );
      });
    }
  }
  searchSubject(event) {
    let value = event.target.value;
    let body = {
      subjectName: value
    }
    this.commonService.post('searchSubject', body).subscribe((data: any) => {
      if (data.status == 200) {
        //  console.log(data)
        this.searchSubjects = data.data;
      } else {
        this.searchSubjects = []
      }

    })
  }
  selectSubject(selectedSub, id) {
    // alert(id)
    this.selectedSub = selectedSub;
    this.subjectId = id;
    this.searchSubjects = []
  }
  addNotesModal() {
    $('#exampleModalCenter1').modal('show');
  }
  openModel() {
    this.copyNotes = `copy of ${this.notesName}`
    $('#copyModal').modal('show');

  }

  createNotes() {
    this.spinner.show();
    let body = {
      subjectId: this.subjectId ? this.subjectId : '',
      notesName: this.newNotes
    }
    this.commonService.post('createNotes', body).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        window.open(`/notesWriting/${data.data._id}`, '_blank')
        $('#exampleModalCenter1').modal('hide');
      } else {
      }
    },
      (error) => {
      })

  }

  createCopy() {
    this.spinner.show();
    let body = {
      'notesName': this.copyNotes,
      'cues': {
        'cuesTitle': this.cuesTitle,
        'cuesText': document.getElementById('cues').innerHTML
      },
      'notesData': {
        'notesTitle': this.noteTitle,
        'notesText': document.getElementById('notes').innerHTML
      },
      'summaries': {
        'summaryTitle': this.summaryTitle,
        'summaryText': document.getElementById('summary').innerHTML
      }
    }
    this.commonService.post('createNoteCopy', body).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        window.open(`/notesWriting/${data.data._id}`, '_blank')
        // window.open(`http://localhost:4200/notesWriting/${data.data._id}`);
        $('#copyModal').modal('hide');
      } else {
      }
    })
  }
  updateNoteName() {
    this.spinner.show();
    let body = {
      notesName: this.notesName,
      noteId: this.noteId
    }
    this.commonService.post('updateNotes', body).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        $('#exampleModalCenter3').modal('hide');
      }
    })
  }

  deleteNotes() {
    this.spinner.show();
    this.commonService.delete('deleteNotes', this.noteId).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        this._router.navigate(['quickAccess']);
      }
    })
  }
  getDetails() {
    $('#exampleModalCenter5').modal('show');
    if (localStorage.getItem('location') != null) {
      this.location = localStorage.getItem('location')
    } else {
      this.location = 'root folder'
    }
  }

  showFindAndReplaceModal(): void {
    $('#exampleModalCenter6').modal({
      backdrop: false,
      show: true
    }).on('shown.bs.modal', () => {
      console.log('shown');
      document.getElementById('findTextInput').focus();
      $('body').css('overflow', 'auto');
    });
    $('.findAndReplaceModal').draggable({
      handle: '.findAndReplaceModalHandle'
    });
    $('#exampleModalCenter6').modal().on('shown', () => {
      console.log('shown');
      $('#findTextInput').focus();

    });
  }

  hideFindAndReplaceModal(): void {
    $('#exampleModalCenter6').modal('hide');
  }

  onFindText(searchValue: string): void {
    this.findText = searchValue;
    $(() => {
      this.findResults = $('mark');
      this.jumpTo();
     });
  }

  jumpTo(): void {
    if (this.findResults.length) {
      let position;
      const current = this.findResults.eq(this.findResultsCurrentIndex);
      this.findResults.removeClass('current');
      if (current.length) {
        current.addClass('current');
        position = current.offset().top - 150;
        window.scrollTo(0, position);
      }
    }
  }


  findAndReplace(): void {
    const newStr = this.content.replaceAll(this.findText, this.replaceText);
    const newStr1 = this.content1.replaceAll(this.findText, this.replaceText);
    const newStr2 = this.content2.replaceAll(this.findText, this.replaceText);
    this.content = newStr;
    this.content1 = newStr1;
    this.content2 = newStr2;
  }

  findAndReplaceOne(): void {
    const current = this.findResults.eq(this.findResultsCurrentIndex);
    current.text(this.replaceText);
    current.removeClass('current');
    this.markInstance.unmark(this.replaceText);
    this.markInstance.mark(this.findText);
    this.findResultsCurrentIndex = 0;
    $(() => {
      this.findResults = $('mark');
      this.jumpTo();
     });
  }

  findNext(): void {
    if (this.findResults.length) {
      if (this.findResultsCurrentIndex <= this.findResults.length - 1) {
        this.findResultsCurrentIndex += 1;
      }
      if (this.findResultsCurrentIndex > this.findResults.length - 1) {
        this.findResultsCurrentIndex = 0;
      }
      this.jumpTo();
    }
  }

  findPrevious(): void {
    if (this.findResults.length) {
      if (this.findResultsCurrentIndex > 0) {
        --this.findResultsCurrentIndex;
      } else if (this.findResultsCurrentIndex === 0) {
        this.findResultsCurrentIndex = this.findResults.length - 1;
      }
      this.jumpTo();
    }
  }
}
