import {Component, OnInit} from '@angular/core';
import {InitDataAbsService} from "./common/services/init.data.abs.service";
import {MdLoadingService} from "./common/components/loading/loading.init.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private initDataServce:InitDataAbsService,private loadingService:MdLoadingService){
  }

  ngOnInit(){
    this.initDataServce.initLoad(location.hostname);
    this.loadingService.init();
  }
}
