import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../core/services/common.service';
import { Router } from '@angular/router';
import { SearchPipe } from '../../../pages/search.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firstName: any;
  lastName: any;
  email: any;
  profileImage:any;
  PlanName:any
  debounce = null;
  constructor(private commonService: CommonService, private _router: Router,private spinner: NgxSpinnerService) { }

  query;
  searchText = '';
  cuesData: any;
  notesData:any;
  summariesData: any;
  characters = [
    'Ant-Man',
    'Aquaman',
    'Asterix',
    'The Atom',
    'The Avengers',
    'Batgirl',
    'Batman',
    'Batwoman',
  ];

  ngOnInit(): void {
    this.getUser();
  }

  searchmodal() {
    $('#searchmodal').modal('show').on('shown.bs.modal', () => {
      console.log('shown');
      document.getElementById('search-bar').focus();
    });
  }

  getUser() {
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        this.firstName = data.result.FullName;
        this.lastName = data.result.lastName;
        this.profileImage = data.result.profileImage;
        this.PlanName = data.result.PlanName;
      }
    });
  }
  onSearch() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.spinner.show();
      this.commonService.get(`notesSearch?search=${this.searchText}`).subscribe((data: any) => {
        this.spinner.hide();
        if (data.status == 200) {
          console.log('notesSearch', data.data);
          this.summariesData = data.data.summariesData;
          this.notesData = data.data.notesData;
          this.cuesData = data.data.cuesData;
        }
      });
    }, 1000);
  }
  logout(): void {
    localStorage.clear();
    this._router.navigate(['login']);
    location.reload();
  }
   signOut(): void {
    Swal.fire({
      title: 'Are you sure to Logout?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes'
    })
    .then((logout) => {
      if (logout.value) {
        this.logout();
      }
    });
  }

  routeOnNotes(notesName, id): void {
    this._router.navigate([`notesWriting/${id}`]);
  }
}
