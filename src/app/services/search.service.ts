import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from "@angular/core";
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';

import { API_CONFIG, ServicesModule } from "./services.module";
import { SearchResult } from './data-types/common.types';

@Injectable({
    providedIn: ServicesModule,
})
export class SearchService {
    constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {}

    search(keywords: string): Observable<SearchResult> {
        const params = new HttpParams().set('keywords', keywords);
        return this.http
            .get(this.uri + 'search/suggest', {params})
            .pipe(map((res: { result: SearchResult}) => res.result))
    }
}
