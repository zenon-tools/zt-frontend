import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
    @Input() placeholder: string = 'Search';
    @Output() search = new EventEmitter<string>();
    @Output() clear = new EventEmitter<void>();

    @ViewChild('searchInput', { static: false })
    searchInput!: ElementRef;

    faSearch = faSearch;
    faXmark = faXmark;

    searchInputLengthSubscription!: Subscription;
    searchInputLengthSubjectSubscription!: Subscription;
    searchInputLengthSubject$ = new BehaviorSubject<number>(0);

    activeSearchText: string = '';

    constructor() {}

    ngAfterViewInit() {
        this.searchInputLengthSubscription = fromEvent(
            this.searchInput.nativeElement,
            'keyup'
        )
            .pipe(
                distinctUntilChanged(),
                map(() => this.searchInput.nativeElement.value?.length ?? 0)
            )
            .subscribe((length) => {
                this.searchInputLengthSubject$.next(length);
            });

        this.searchInputLengthSubjectSubscription =
            this.searchInputLengthSubject$.subscribe((length) => {
                if (length === 0 && this.activeSearchText.length > 0) {
                    this.activeSearchText = '';
                    this.clear.emit();
                }
            });
    }

    ngOnDestroy(): void {
        this.searchInputLengthSubscription.unsubscribe();
        this.searchInputLengthSubjectSubscription.unsubscribe();
    }

    onSearch() {
        if (this.searchInput.nativeElement.value.length > 0) {
            this.activeSearchText = this.searchInput.nativeElement.value;
            this.search.emit(this.activeSearchText);
        }
    }

    onClear() {
        this.searchInput.nativeElement.value = '';
        this.searchInputLengthSubject$.next(0);
    }
}
