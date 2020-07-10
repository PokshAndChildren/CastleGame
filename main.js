requirejs.config({
    baseUrl: 'out',
    waitSeconds: 20,

    deps: ['game'],

    urlArgs: "t=" + Date.now()  //flusing cache, do not use in production
});

