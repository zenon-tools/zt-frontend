import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import {
    distinctUntilChanged,
    fromEvent,
    map,
    Observable,
    startWith,
    take,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    PillarOffChainInfo,
    PillarsOffChainInfo,
} from 'src/app/services/zenon-tools-api/interfaces/pillar-off-chain-info';
import {
    Pillar,
    Pillars,
} from 'src/app/services/zenon-tools-api/interfaces/pillar';

@Component({
    selector: 'app-pillar-profile-management-page',
    templateUrl: './pillar-profile-management-page.component.html',
    styleUrls: ['./pillar-profile-management-page.component.scss'],
})
export class PillarProfileManagementPageComponent implements AfterViewInit {
    faCopy = faCopy;

    @ViewChild('telegramInput', { static: false })
    telegramInput!: ElementRef;

    @ViewChild('twitterInput', { static: false })
    twitterInput!: ElementRef;

    @ViewChild('gitHubInput', { static: false })
    gitHubInput!: ElementRef;

    @ViewChild('websiteInput', { static: false })
    websiteInput!: ElementRef;

    @ViewChild('mediumInput', { static: false })
    mediumInput!: ElementRef;

    @ViewChild('emailInput', { static: false })
    emailInput!: ElementRef;

    @ViewChild('avatarInput', { static: false })
    avatarInput!: ElementRef;

    @ViewChild('descriptionInput', { static: false })
    descriptionInput!: ElementRef;

    @ViewChild('signatureInput', { static: false })
    signatureInput!: ElementRef;

    descriptionLength$!: Observable<number>;

    pillarName: string = '';
    pillarAddress: string = '';

    pillarsOffChainInfo$ = this.zenonToolsApiService.pillarsOffChainInfo$;
    pillarOffChainInfo?: PillarOffChainInfo;

    pillars$ = this.zenonToolsApiService.pillars$;
    pillar?: Pillar;

    isLoading: boolean = false;
    isError: boolean = false;
    pillarExists: boolean = false;
    errorText: string = 'Unable to update profile.';
    maxDescriptionLength: number = 500;
    messageToSign: string = 'kF5Ja7nPZ4';

    constructor(
        private cdr: ChangeDetectorRef,
        private clipboard: Clipboard,
        private route: ActivatedRoute,
        private router: Router,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngAfterViewInit() {
        this.route.params.subscribe((params) => {
            this.pillarName = params['name'];

            this.pillarsOffChainInfo$
                .pipe(take(1))
                .subscribe((pillarInfos: PillarsOffChainInfo) => {
                    this.pillarOffChainInfo = Array.from(
                        pillarInfos.values()
                    ).find((item) => item.name == this.pillarName);
                    this.initInputFields();

                    this.descriptionLength$ = fromEvent(
                        this.descriptionInput.nativeElement,
                        'keyup'
                    ).pipe(
                        distinctUntilChanged(),
                        map(
                            () =>
                                this.descriptionInput.nativeElement.value.length
                        ),
                        startWith(
                            this.pillarOffChainInfo?.description.length ?? 0
                        )
                    );
                });

            this.pillars$.pipe(take(1)).subscribe((pillars: Pillars) => {
                this.pillarAddress =
                    Array.from(pillars.entries()).find(
                        (item) => item[1].name == this.pillarName
                    )?.[0] ?? '';
                this.pillarExists = this.pillarAddress.length > 0;
            });
        });

        this.cdr.detectChanges();
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }

    onUpdateProfile() {
        if (
            this.descriptionInput.nativeElement.value.length >
            this.maxDescriptionLength
        ) {
            this.errorText = 'Pillar description is too long.';
            this.isError = true;
        } else if (this.signatureInput.nativeElement.value.length === 0) {
            this.errorText = 'Signature is missing.';
            this.isError = true;
        } else if (this.pillarAddress.length > 0) {
            this.isError = false;
            this.isLoading = true;

            const data = {
                pillarAddress: this.pillarAddress,
                signature: this.signatureInput.nativeElement.value,
                info: {
                    name: this.pillarName,
                    avatar: this.avatarInput.nativeElement.value,
                    description: this.descriptionInput.nativeElement.value,
                    links: {
                        telegram: this.telegramInput.nativeElement.value,
                        twitter: this.twitterInput.nativeElement.value,
                        website: this.websiteInput.nativeElement.value,
                        github: this.gitHubInput.nativeElement.value,
                        medium: this.mediumInput.nativeElement.value,
                        email: this.emailInput.nativeElement.value,
                    },
                },
            };

            this.zenonToolsApiService
                .putPillarOffChainInfo(data)
                .pipe(take(1))
                .subscribe({
                    next: () => {
                        this.router.navigate(['/pillars', this.pillarName]);

                        // TODO: Fix this hack.
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    },
                    error: () => {
                        this.errorText = 'Unable to update profile.';
                        this.isError = true;
                        this.isLoading = false;
                    },
                });
        }
    }

    private initInputFields() {
        if (this.pillarOffChainInfo != undefined) {
            this.telegramInput.nativeElement.value =
                this.pillarOffChainInfo.links?.telegram ?? '';
            this.twitterInput.nativeElement.value =
                this.pillarOffChainInfo.links?.twitter ?? '';
            this.websiteInput.nativeElement.value =
                this.pillarOffChainInfo.links?.website ?? '';
            this.gitHubInput.nativeElement.value =
                this.pillarOffChainInfo.links?.github ?? '';
            this.mediumInput.nativeElement.value =
                this.pillarOffChainInfo.links?.medium ?? '';
            this.emailInput.nativeElement.value =
                this.pillarOffChainInfo.links?.email ?? '';

            this.avatarInput.nativeElement.value =
                this.pillarOffChainInfo.avatar ?? '';
            this.descriptionInput.nativeElement.value =
                this.pillarOffChainInfo.description ?? '';
        }
    }
}
