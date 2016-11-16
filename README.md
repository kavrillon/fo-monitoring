Monitoring of Frontend sprints with reporting per week and per project.


TODO

Functional
- empty page
- welcome page

LEFT Menu:
- Dashboard: make your own charts
    - by default there’s an initial set of charts
        - time spent on activities per week (label monitoring/support/delivery/product)
        - time spent by project
- Weeks: view by week: time spent, activities repartition
    - list of cards of each week
    - click on card 
- Projects: view by project (regex on [ ] with defined exclusions (SUPPORT))
    - time spent on inte
    - time spent on reviews
    - time spent on evols
    - time spent on product
    - list of cards with link on Trello
- Support


Technical
- remove /* eslint-disable */ & lint
- release: how to do minor/major releases ?
- inline/critical css
- log
- year management
- replace .js- by data attr
swipe management

Gulp
- postcss ?

CSS
willchange review

TO TEST
- deploy:ghPages when bower deps (for this reactivate bower in gulp tasks imagemin, 6to5, build & co)
- livereload: images


RESSOURCES
https://developers.google.com/web/progressive-web-apps/
https://github.com/GoogleChrome/voice-memos
https://voice-memos.appspot.com/
https://developers.trello.com/authorize




        <!-- iPhone 6 Plus portrait startup image -->
        <link href="images/icon-apple-splash-1242x2148.png"
              media="(device-width: 414px) and (device-height: 736px)
                and (-webkit-device-pixel-ratio: 3)
                and (orientation: portrait)"
              rel="apple-touch-startup-image">

        <!-- iPhone 6 startup image -->
        <link href="images/icon-apple-splash-750x1294.png"
              media="(device-width: 375px) and (device-height: 667px)
                and (-webkit-device-pixel-ratio: 2)"
              rel="apple-touch-startup-image">

        <!-- iPhone 5 startup image -->
        <link href="images/icon-apple-splash-640x1096.png"
              media="(device-width: 320px) and (device-height: 568px)
                and (-webkit-device-pixel-ratio: 2)"
              rel="apple-touch-startup-image">

        <!-- iPhone < 5 retina startup image -->
        <link href="images/icon-apple-splash-640x920.png"
              media="(device-width: 320px) and (device-height: 480px)
                and (-webkit-device-pixel-ratio: 2)"
              rel="apple-touch-startup-image">

        <!-- iPhone < 5 non-retina startup image -->
        <link href="images/icon-apple-splash-320x460.png"
              media="(device-width: 320px) and (device-height: 480px)
                and (-webkit-device-pixel-ratio: 1)"
              rel="apple-touch-startup-image">


        if(window.navigator.standalone) {
            document.querySelector('body').classList.add('webapp')
        }
        
        
.webapp {
    .header {
        padding-top: 36px;
        height: $header-height + 20px;
    }
}
