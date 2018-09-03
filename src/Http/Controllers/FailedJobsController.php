<?php

namespace Kregel\NovaFailedJobs\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Kregel\NovaFailedJobs\Jobs\RerunDeadJob;
use Kregel\NovaFailedJobs\Models\FailedJob;
use Schema;

class FailedJobsController extends Controller
{
    public function index()
    {
        if (!Schema::hasTable('failed_jobs')) {
            return response([
                'message' => 'You do not have the failed jobs table set up'
            ], 428);
        }

        return FailedJob::orderByDesc('failed_at')->paginate(15);
    }

    public function rerunJob($id, Request $request)
    {
        dispatch(new RerunDeadJob($id));
    }
}
