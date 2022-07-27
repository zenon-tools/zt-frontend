import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    combineLatest,
    distinctUntilChanged,
    fromEvent,
    map,
    Observable,
    of,
    startWith,
} from 'rxjs';
import {
    Pillar,
} from 'src/app/services/zenon-tools-api/interfaces/pillar';

@Component({
    selector: 'app-pillar-selection-modal',
    templateUrl: './pillar-selection-modal.component.html',
    styleUrls: ['./pillar-selection-modal.component.scss'],
})
export class PillarSelectionModalComponent implements AfterViewInit {
    @ViewChild('searchInput', { static: false })
    searchInput!: ElementRef;

    public pillars$ = new Observable<Pillar[]>();
    public filteredPillars$ = new Observable<Pillar[]>();

    private searchText$!: Observable<string>;

    constructor(
        public dialogRef: MatDialogRef<PillarSelectionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Pillar[]
    ) {
        this.pillars$ = of(data);
        this.filteredPillars$ = this.pillars$;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onItemSelected(item: Pillar) {
        this.dialogRef.close(item);
    }

    ngAfterViewInit() {
        this.searchText$ = fromEvent(
            this.searchInput.nativeElement,
            'keyup'
        ).pipe(
            distinctUntilChanged(),
            map((value) => this.searchInput.nativeElement.value),
            startWith('')
        );

        this.filteredPillars$ = combineLatest([
            this.pillars$,
            this.searchText$,
        ]).pipe(
            map(([pillars, searchText]) =>
                pillars.filter((item) =>
                    item.name.toLowerCase().startsWith(searchText.toLowerCase())
                )
            )
        );
    }
}
