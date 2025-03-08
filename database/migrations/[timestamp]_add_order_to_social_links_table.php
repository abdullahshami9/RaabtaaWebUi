<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('social_links', function (Blueprint $table) {
            $table->integer('order')->default(0)->after('url');
        });
    }

    public function down()
    {
        Schema::table('social_links', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
}; 