<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFailedJobsSoftDeletesTable extends Migration
{
    public function up()
    {
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
