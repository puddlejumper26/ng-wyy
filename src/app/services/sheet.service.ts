import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';

import { API_CONFIG, ServicesModule } from './services.module';
import { SongSheet } from './data-types/common.types';

    /**
     *    This service could not obtain the tracks play address, therefore it has to be used together with
     *                                  song.service.ts
     */

@Injectable({
  // it means ServiceModule will provide with HomeService
  // same as put HomeService into the proviers inside ServiceModule
  // casuse the second method could
  // be deleted when it is not used when tree shaking
  // tree shaking is to auto delete the module or package in the APP which is imported but not used
  providedIn: ServicesModule
})
export class SheetService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getSongSheetDetail(id: number): Observable<SongSheet>{
    // const params = new HttpParams({fromString : queryString.stringify(id)});

    // because here is a single variable, here is the alternative

    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', { params })
                .pipe(map((res : {playlist: SongSheet}) => res.playlist))
  }

}