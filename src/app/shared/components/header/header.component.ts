import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../core/services/common.service';
import { Router } from '@angular/router';
import { SearchPipe } from "../../../pages/search.pipe";
import { NgxSpinnerService } from "ngx-spinner";
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
  constructor(private commonService: CommonService, private _router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getUser();
    // this.onSearch()
  }


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
  ]


  searchmodal() {
    $('#searchmodal').modal('show');
  }

  getUser() {
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        this.firstName = data.result.FullName;
        this.lastName = data.result.lastName;
        this.profileImage=data.result.profileImage
        this.PlanName =data.result.PlanName
      }
    })
  }
  onSearch() {
    this.spinner.show();
    this.commonService.get(`notesSearch?search=${this.searchText}`).subscribe((data: any) => {
      if (data.status == 200) {
        console.log("notesSearch", data.data)
        this.summariesData = data.data.summariesData
        this.notesData = data.data.notesData
        this.cuesData = data.data.cuesData
        this.spinner.hide();
      }
      else{
        this.spinner.hide();

      }
    })
  }
  logout() {
    localStorage.clear()
    this._router.navigate(["login"]);
    location.reload();

  }
   signOut() {
    Swal.fire({
      title: "Are you sure to Logout?",
      // text: "Once deleted, you will not be able to recover this imaginary file!",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes !'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.logout()
        } else {
          // Swal.fire("Fail");
        }
        console.log(willDelete)
      })
  }
  routeOnNotes(notesName,id){
    this._router.navigate([`notesWriting/${id}`]);
  }
}
