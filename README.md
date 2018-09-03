# A Nova tool to help debug failed jobs

[![Latest Version on Packagist](https://img.shields.io/packagist/v/kregel/nova-failed-jobs-tool.svg?style=flat-square)](https://packagist.org/packages/:vendor/:package_name)
[![Total Downloads](https://img.shields.io/packagist/dt/kregel/nova-failed-jobs-tool.svg?style=flat-square)](https://packagist.org/packages/:vendor/:package_name)


This is where your description should go. Try and limit it to a paragraph or two.

Add a screenshot of the tool here.

## Installation

You can install the package in to a Laravel app that uses [Nova](https://nova.laravel.com) via composer:

```bash
composer require kregel/nova-failed-jobs-tool
```

Next up, you must register the tool with Nova. This is typically done in the `tools` method of the `NovaServiceProvider`.

```php
// in app/Providers/NovaServiceProvider.php

// ...

public function tools()
{
    return [
        // ...
        new \Kregel\NovaFailedJobs\Tool(),
    ];
}
```

## Usage

Click on the "Failed Jobs Log" menu item in your Nova app to see the tool provided by this package.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please email github@austinkregel.com instead of using the issue tracker.

## Credits

- [Austin kregel](https://github.com/austinkregel)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
