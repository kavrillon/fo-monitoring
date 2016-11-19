
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
