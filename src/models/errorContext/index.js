export class ErrorContext {
    constructor({
        status,
        backLinkText,
        backLinkHref,
        title,
        description,
    }) {
        this.status = status || 400;
        this.backLinkText = backLinkText || 'Go to Home Page';
        this.backLinkHref = backLinkHref || '/';
        this.title = title || 'Error';
        this.description = description || 'Something went wrong';
    }
}
