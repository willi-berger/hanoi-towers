# Towers of Hanoi

The famous towers of Hanoi. Implmented with Javascript and HTML canvas.

As drawing on the canvas is asynchrounous, we use a _Generator_ to produce the individual moves of the animation,

```
this.moveTower = function* (n, source, target, auxiliary) {

    if (n > 0) {
        // Move n - 1 disks from source to auxiliary, so they are out of the way
        yield * this.moveTower(n - 1, source, auxiliary, target)

        // Move the nth disk from source to target and signal one iteration step
        target.pushTile(source.popTile());
        yield target;

        // Move the n - 1 disks that we left on auxiliary onto target
        yield * this.moveTower(n - 1, auxiliary, target, source)
    }
} 
```


## Demo

[https://willi-berger.github.io/hanoi-towers/](https://willi-berger.github.io/hanoi-towers/)


## Developer notes
To run locally in docker container:

```
docker run -dit --name my-apache-app -p 8080:80 -v "$PWD":/usr/local/apache2/htdocs/  httpd
```

or ith php

```
docker run -dit --name my-apache-app -p 8080:80 -v "$PWD":/var/www/html php:7.2-apache
```


## Credits

base algorithm as taken from [wikipedia.org/Tower_of_Hanoi](https://en.wikipedia.org/wiki/Tower_of_Hanoi)