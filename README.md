Monitoring of Frontend sprints with reporting per week and per project.

# Next things
- dashboard
- support: moy/semaine passée + pie chart
- monitoring: pie chart
- product: pie chart
- delivery:
    order: alphabet/spent/date
    filter: text/spent/spent imple&review/duration imple&review 
    infos: imple duration / review duration
- log
- pagination

# To implement
### New functionalities
- add trello account in the left menu
- welcome page
- empty page
- PWA: test on Android & Chrome & Windows
- swipe management
- home page: add data for projects
- year management: one board per year, store in conf. By default the current year is shown, possibility to select year in the left menu
- weeks: problem on  total not about 100%
- product page: get data for product
    - based on regex on []: templates, V3, V2
- support page: get data for support
    - based on regex on [], Jeremie, Laetitia, etc.

### Technical
- PWA: debug on iOS
- JS 15000 fois trop gros
- remove `/* eslint-disable */` & lint
- inline critical css
- release: how to do minor/major releases ?
- PWA testing: perfs of appshell/cache
- `willchange` review
- to test: deploy:ghPages when bower deps (for this reactivate bower in gulp tasks imagemin, 6to5, build & co)
- to test: livereload: images
- postcss ?


# Resources
- https://developers.google.com/web/progressive-web-apps/
- https://github.com/GoogleChrome/voice-memos
- https://voice-memos.appspot.com/
- https://developers.trello.com/authorize
