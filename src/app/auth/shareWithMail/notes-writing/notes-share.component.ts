import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonService } from '../../../core/services/common.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import jspdf from 'jspdf';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';


import html2canvas from 'html2canvas';
import * as moment from 'moment';
@Component({
  selector: 'app-notes-share',
  templateUrl: './notes-share.component.html',
  styleUrls: ['./notes-share.component.css']
})

export class NotesShareComponent implements OnInit {
  @ViewChild('container', { read: ElementRef })
  public readonly containerElement;
  form: FormGroup;
  content: any;
  htmlContent = '';
  notes: any;
  cuesTitle: any;
  content1: any;
  content2: any;
  noteId: any;
  notesContent: any;
  cuesContent: any;
  summaryContent: any;
  summaryTitle: any;
  noteTitle: any;
  debounce: any;
  timeAgo: any;
  notesName: any;
  createdDate: any;
  userName: any;
  readonly AngularResizeElementDirection = AngularResizeElementDirection;
  data: any = {};


  constructor(private toastr: ToastrService,
              private commonService: CommonService,
              private formBuilder: FormBuilder,
              private router: Router,
              private spinner: NgxSpinnerService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
    this.getNote();
    this.route.queryParams.subscribe((params) => {
      if (params.user) {
        this.userName = params.user;
      }
    });
  }

  onKeyUp(e) {
    // console.log(this.media1.nativeElement.innerHTML)
    this.content = e.target.innerHTML;
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
    console.log('this.content', this.content);

  }
  getContent() {
    this.notesContent = document.getElementById('notes').innerHTML;
    this.cuesContent = document.getElementById('cues').innerHTML;
    this.summaryContent = document.getElementById('summary').innerHTML;

    // alert(this.cuesContent)
    // this.autoUpdate()
  }

  getImage(event) {
    const file = event.target.files[0];
    var reader = new FileReader();
    let dataURI;

    reader.addEventListener(
      'load',
      function () {
        dataURI = reader.result;

        const img = document.createElement('img');
        img.src = dataURI;
        var editorContent = document.querySelector('.editor');
        editorContent.appendChild(img);
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }

  }
  execCommandWithArg(command, arg) {
    document.execCommand(command, false, arg);
  }
  execCommand(event, command, arg) {

    //console.log(event.target.classList)

    if (event.target.classList.contains('mystyle')) {
      event.target.classList.remove('mystyle');
    } else {
      event.target.classList.add('mystyle');
    }

    document.execCommand(command, false, '');
  }
  link() {
    var url = prompt('Enter the URL');
    document.execCommand('createLink', false, url);
  }
  getNote() {
    this.spinner.show();
    const myMainSite = this.router.url;
    const splitUrl = myMainSite.split('/');
    this.noteId = splitUrl[2];
    this.commonService.get(`shareNotesUrl/${this.noteId}`).subscribe((data: any) => {
      this.spinner.hide();
      if (data.status == 200) {
        console.log('dayda', data.data);
        this.createdDate = data.data[0].createdAt;
        this.notesName = data.data[0].notesName;
        this.timeAgo = moment(data.data[0].updatedAt).fromNow();
        this.content = data.data[0].cues.cuesText;
        this.cuesTitle = data.data[0].cues.cuesTitle;
        this.content1 = data.data[0].notesData.notesText;
        this.noteTitle = data.data[0].notesData.notesTitle;
        this.content2 = data.data[0].summaries.summaryText;
        this.summaryTitle = data.data[0].summaries.summaryTitle;
      }
    }, (error) => {
      console.error(error);
      this.spinner.hide();
    });
  }

}
