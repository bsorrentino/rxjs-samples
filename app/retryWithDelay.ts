import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";


export default function retryWithDelay<T>( _self:Rx.Observable<T>, retryFor:number, delayTime:number) {

    return _self.retryWhen( (errors: Rx.Observable<any>) => {
                return errors.scan( (errorCount:number, err:any) => {
                    if( errorCount >= retryFor ) {
                        throw err;
                    }
                    return errorCount + 1;
                } , 0)
                .delay(delayTime);
            })
            ;  
}

