import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Project } from 'src/app/services/zenon-tools-api/interfaces/project';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';

@Component({
    selector: 'app-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit {
    project$!: Observable<Project>;
    coinDecimals: number = 100000000;
    isLoading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const projectId = params['projectId'];
            this.project$ = this.zenonToolsApiService.getProject(projectId);

            this.project$.pipe(take(1)).subscribe((project: Project) => {
                this.isLoading = false;
                this.route.fragment.subscribe((fragment) => {
                    if (fragment?.length ?? 0 > 0) {
                        this.scrollToFragment(fragment!, 250);
                    }
                });
            });
        });
    }

    onShowPhases() {
        this.scrollToFragment('phases', 0);
    }

    private scrollToFragment(fragment: string, delayMs: number) {
        setTimeout(() => {
            document?.getElementById(fragment)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }, delayMs);
    }
}
