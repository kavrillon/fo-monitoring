Monitoring of Frontend sprints with reporting per week and per project.

# Next things
- JS 15000 fois trop gros
- home page: round values
- home page: add % in label
- add dashboard init, charts & template in a separated file
- replace .js- by data attr
- refacto: move js for templates in dedicated js files ?
- menu desktop: always displayed

# To implement
### New functionalities
- PWA: debug on iOS
- pagination
- welcome page
- empty page
- PWA: test on Android & Chrome & Windows
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
- product page: get data for product
    - based on regex on []: templates, V3, V2
- support page: get data for support
    - based on regex on [], Jeremie, Laetitia, etc.

### Technical
- remove `/* eslint-disable */` & lint
- inline critical css
- release: how to do minor/major releases ?
- log
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
