Monitoring of Frontend sprints with reporting per week and per project.

# To implement
### New functionalities
- empty page
- welcome page
- no access page
- home page: add data for weeks
    - global evolution of activities (chart)
    - velocity
- project page: get data for projects & design
- home page: add data for projects
- project page: 
    - save user data for project start date & end date, list of projects he want to see
    - view by project (regex on [ ] with user defined exclusions (SUPPORT))
    - exlude cards not tagged as "Delivery"
    - time spent on each imple/review. Number of reviews, list of cards
- year management: one board per year, store in conf. By default the current year is shown, possibility to select year in the left menu
- on desktop: always show the left menu
- add trello account in the left menu
- PWA: debug on iOS
- PWA: test on Android & Chrome & Windows
- swipe management

### Technical
- AppController refacto with `libs/trello.js` creation (extend of the node one)
- remove /* eslint-disable */ & lint
- release: how to do minor/major releases ?
- inline critical css
- log
- PWA testing: perfs of appshell/cache
- replace .js- by data attr
- postcss ?
- `willchange` review
- to test: deploy:ghPages when bower deps (for this reactivate bower in gulp tasks imagemin, 6to5, build & co)
- to test: livereload: images


# resources
https://developers.google.com/web/progressive-web-apps/
https://github.com/GoogleChrome/voice-memos
https://voice-memos.appspot.com/
https://developers.trello.com/authorize
