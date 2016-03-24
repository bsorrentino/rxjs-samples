
import Rx from 'rxjs/Rx';

var source = Rx.Observable
    .interval(500 /* ms */)
    .timeInterval()
    .take(3);



var listener = Rx.Observable.create( (observer: Rx.Observer<Event>) => {

      document.addEventListener( 'next', (evt:Event) => {
          observer.onNext(evt);
      });
      document.addEventListener( "completed", (evt:Event) => {
          observer.onCompleted();
      });

      return () => console.log("disposed");
});

let s = listener.subscribe((value: Event) => {
  console.log('handle');
});

for( let i = 0 ; i< 3; ++i ) {
  var subscription = source.subscribe(
      function (x) {

          var event = new CustomEvent('next', { 'detail': x });
          document.dispatchEvent( event );
          console.log('Next:', x);
      },
      function (err) {
          console.log('Error: ' + err);
      },
      function () {
        var event = new CustomEvent('completed', {});
        document.dispatchEvent( event );
        console.log('Completed');
      });

}
