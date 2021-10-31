import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VanguardServiceService {
  metrics$: Observable<any>;
  constructor(private httpClient: HttpClient) {
    this.metrics$ = timer(0, 5000).pipe(
      switchMap(() => {
        return httpClient
          .get('http://localhost:4200/vanguard/metrics', {
            responseType: 'text',
          })
          .pipe(
            map((result: any) => {
              return result.split('\n');
            }),
            map((lines) => {
              console.log(lines.length);
              return lines.filter((line: string) => {
                return line !== '' && !line.startsWith('#');
              });
            }),
            map((lines) => {
              return lines.reduce((acc: any, curr: any) => {
                const [key, value] = curr.split(' ');
                acc[key] = value;
                return acc;
              }, {});
            }),
            tap((lines) => {
              console.log(lines);
            })
          );
      })
    );
  }

  getMetrics$() {
    return this.metrics$;
  }
}
