import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { faCube } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    faCube = faCube;

    momentumHeight$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.momentumHeight)
    );

    nodeVersion$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.nodeVersion)
    );

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

}
