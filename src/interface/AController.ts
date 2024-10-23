import { Application } from "express";

export abstract class AController {
    protected app: Application;
    constructor(app : Application) {
        this.app = app;
    }
    protected abstract setupRoutes() : void;
}