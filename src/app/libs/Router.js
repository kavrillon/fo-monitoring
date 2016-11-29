class Router {
    constructor() {
        this.routes = {};
        this.currentAction = null;
        this.loader = document.querySelector('.loader');

        window.addEventListener('popstate', (e) => {
            this.onPopState(e);
        });

        this.manageState();
    }

    add(path, callbackIn, callbackOut, callbackUpdate) {
        // Assume the first part of the path is the
        // verb we want to action, with the rest of the path
        // being the data to pass to the handler.
        const pathParts = path.split('/');
        const action = pathParts.shift();

        if (this.routes[action]) {
            throw 'A handler already exists for this action: ' + action;
        }

        this.routes[action] = {
            in: callbackIn,
            out: callbackOut,
            update: callbackUpdate
        };

        // Check to see if this path is fulfilled.
        requestAnimationFrame(() => {
            if (this.manageState()) {
                document.body.classList.remove('deeplink');
            }
        });
    }

    remove(path) {
        const pathParts = path.split('/');
        const action = pathParts.shift();

        if (!this.routes[action]) {
            return;
        }

        delete this.routes[action];
    }

    manageState() {
        const path = document.location.pathname.replace(/^\//, '');

        // Assume the first part of the path is the
        // verb we want to action, with the rest of the path
        // being the data to pass to the handler.
        const pathParts = path.split('/');
        let action = pathParts.shift();
        const data = pathParts.join('/');

        // Add a special case for the root.
        if (action === '') {
            action = '_root';
        }

        // Remove any deeplink covers.
        if (document.body.classList.contains('app-deeplink')) {
            document.body.classList.remove('app-deeplink');
        }

        // Hide the loader.
        this.loader.classList.add('hidden');

        if (this.currentAction === this.routes[action]) {

            if (typeof this.currentAction.update === 'function') {
                this.currentAction.update(data);
                return true;
            }

            return false;
        }

        if (!this.routes[action]) {
            if (this.currentAction) {
                this.currentAction.out();
            }

            this.currentAction = null;
            document.body.focus();
            return false;
        }

        // Set the new action going.
        const delay = this.routes[action].in(data) || 0;

        // Remove the old action and update the reference.
        if (this.currentAction) {
            // Allow the incoming view to delay the outgoing one
            // so that we don't get too much overlapping animation.
            if (delay === 0) {
                this.currentAction.out();
            } else {
                setTimeout(this.currentAction.out, delay);
            }
        }

        this.currentAction = this.routes[action];

        return true;
    }

    go(path) {
        // Only process real changes.
        if (path === window.location.pathname) {
            return;
        }

        history.pushState(undefined, "", path);
        requestAnimationFrame(() => {
            this.manageState();
        });
    }

    onPopState(e) {
        e.preventDefault();
        requestAnimationFrame(() => {
            this.manageState();
        });
    }
}

export default function RouterInstance() {
    if (typeof window.RouterInstance_ !== 'undefined') {
        return Promise.resolve(window.RouterInstance_);
    }

    window.RouterInstance_ = new Router();

    return Promise.resolve(window.RouterInstance_);
}
