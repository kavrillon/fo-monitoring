Monitoring of Frontend sprints with reporting per week and per project.

# To implement
### New functionalities
- PWA: debug on iOS
- pagination
- welcome page
- empty page
- no access page
- PWA: test on Android & Chrome & Windows
- home page: add data for weeks
    - global evolution of activities (chart)
    - velocity
- swipe management
- project page: get data for projects & design
    - save user data for project start date & end date, list of projects he want to see
    - view by project (regex on [ ] with user defined exclusions (SUPPORT))
    - exlude cards not tagged as "Delivery"
    - time spent on each imple/review. Number of reviews, list of cards
- home page: add data for projects
- year management: one board per year, store in conf. By default the current year is shown, possibility to select year in the left menu
- on desktop: always show the left menu
- add trello account in the left menu
- weeks: dedicated week page ?
- weeks: problem on  total not about 100%

### Technical
- remove `/* eslint-disable */` & lint
- inline critical css
- release: how to do minor/major releases ?
- log
- PWA testing: perfs of appshell/cache
- replace .js- by data attr
- `willchange` review
- to test: deploy:ghPages when bower deps (for this reactivate bower in gulp tasks imagemin, 6to5, build & co)
- to test: livereload: images
- refacto: move js for templates in dedicated js files ?
- postcss ?


# Resources
- https://developers.google.com/web/progressive-web-apps/
- https://github.com/GoogleChrome/voice-memos
- https://voice-memos.appspot.com/
- https://developers.trello.com/authorize
