<?php

namespace Kregel\NovaFailedJobs\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Kregel\ExceptionProbe\Stacktrace;

/**
 * Class FailedJob.
 *
 * @package namespace App\Models;
 * @mixin \Eloquent
 */
class FailedJob extends Model
{
    use SoftDeletes;

    public $appends = [
        'codestack',
        'message',
        'args',
    ];

    public function __construct(array $attributes = [])
    {
        $this->table = config('queue.failed.table');
        parent::__construct($attributes);
    }

    public function getArgsAttribute()
    {
        $payload = json_decode($this->payload);

        if (empty($payload)) {
            return new \stdClass();
        }

        if (empty($payload->data)) {
            return new \stdClass();
        }

        if (empty($payload->data->command)) {
            return new \stdClass();
        }

        return unserialize(json_decode($this->payload)->data->command);
    }

    public function getCodestackAttribute()
    {
        return array_map(function ($codestack) {
            $codestack->file = str_replace(base_path(), '.', $codestack->file);
            return $codestack;
        }, (new Stacktrace)->parse($this->exception));
    }

    public function getMessageAttribute()
    {
        $stack = (new Stacktrace);

        $stack->parse($this->exception);

        return $stack->message;
    }
}
