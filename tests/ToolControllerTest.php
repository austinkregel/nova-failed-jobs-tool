<?php

namespace Kregel\NovaFailedJobs\Tests;

use Kregel\NovaFailedJobs\Http\Controllers\FailedJobsController;
use Kregel\NovaFailedJobs\:namespace_tool_name;
use Symfony\Component\HttpFoundation\Response;

class ToolControllerTest extends TestCase
{
    /** @test */
    public function it_can_can_return_a_response()
    {
        $this
            ->get('nova-vendor/Kregel/nova-failed-jobs/endpoint')
            ->assertSuccessful();
    }
}
