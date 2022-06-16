import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, take } from 'rxjs';
import { ProposalListItems } from 'src/app/services/zenon-tools-api/interfaces/proposal-list-item';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    faAngleLeft,
    faAngleRight,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-accelerator-page',
    templateUrl: './accelerator-page.component.html',
    styleUrls: ['./accelerator-page.component.scss'],
})
export class AcceleratorPageComponent implements OnInit, OnDestroy {
    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;
    faCircleInfo = faCircleInfo;

    proposals$!: Observable<ProposalListItems>;
    proposalsObservableSubject$ = new Subject<Observable<ProposalListItems>>();
    proposalsObservableSubscription!: Subscription;

    isLoading: boolean = true;
    activePage: number = 1;

    constructor(
        private zenonToolsApiService: ZenonToolsApiService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.proposalsObservableSubscription =
            this.proposalsObservableSubject$.subscribe(
                (observable: Observable<ProposalListItems>) => {
                    this.proposals$ = observable;
                    observable.pipe(take(1)).subscribe(() => {
                        this.isLoading = false;
                    });
                }
            );

        this.route.queryParams.subscribe((param) => {
            const page = parseInt(param['page'] ?? 1);
            this.activePage = page;
            this.proposalsObservableSubject$.next(
                this.zenonToolsApiService.getProposals(page)
            );
        });
    }

    ngOnDestroy(): void {
        this.proposalsObservableSubscription.unsubscribe();
    }

    onNextSelected() {
        this.isLoading = true;
        this.activePage++;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.activePage },
        });
    }

    onPreviousSelected() {
        this.isLoading = true;
        if (this.activePage > 1) {
            this.activePage--;
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { page: this.activePage },
            });
        }
    }

    onProjectPressed(projectId: string, isPhase: boolean) {
        this.router.navigate(['/accelerator', projectId], {
            fragment: isPhase ? 'phases' : undefined,
        });
    }
}
