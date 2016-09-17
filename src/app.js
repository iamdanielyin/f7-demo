'use strict';

import 'framework7/dist/js/framework7.min';
import 'framework7/dist/css/framework7.ios.min.css';
import 'framework7/dist/css/framework7.ios.colors.css';
import 'less/index.less';

import 'page/about.html';

// Initialize app and store it to myApp variable for futher access to its methods
const myApp = new Framework7({
    pushState: true,
    swipePanel: 'left',
    modalTitle: '微商城',
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    modalPreloaderTitle: '加载中...'
});

// We need to use custom DOM library, let's save it to $$ variable:
const $$ = Dom7;

// Add view
const mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    console.log('pageInit...娃哈哈');
    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    console.log('about.pageInit');
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
});