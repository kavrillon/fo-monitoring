export default class Controller {
    constructor() {
        this.STATUS_CODE_SUCCESS = 200;
    }

    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            script.src = url;

            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    }

    loadCSS(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'text';
            xhr.onload = function() {
                if (this.status === this.STATUS_CODE_SUCCESS) {
                    const style = document.createElement('style');
                    style.textContent = xhr.response;
                    document.head.appendChild(style);
                    resolve();
                } else {
                    reject();
                }
            };

            xhr.send();
        });
    }

}
