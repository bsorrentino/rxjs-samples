import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap, retryWhen, scan, delay } from 'rxjs/operators';


export default function retryWithDelay<T>( _self:Observable<T>, retryFor:number, delayTime:number):Observable<T> {

    return _self.pipe(retryWhen( (errors: Observable<any>) => {
                return errors.pipe(scan( (errorCount:number, err:any) => {
                    if( errorCount >= retryFor ) throw err;
                    return errorCount + 1;
                } , 0),
                delay(delayTime));
            }))
            ;  
}

