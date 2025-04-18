<?php

namespace Database\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('value');
            $table->timestamps();
        });

        // Insert default colors
        $colors = [
            ['name' => 'Default', 'value' => 'rgb(255, 255, 255)'],
            ['name' => 'Red', 'value' => 'rgb(255, 226, 226)'],
            ['name' => 'Orange', 'value' => 'rgb(255, 244, 229)'],
            ['name' => 'Yellow', 'value' => 'rgb(255, 255, 229)'],
            ['name' => 'Green', 'value' => 'rgb(230, 255, 229)'],
            ['name' => 'Teal', 'value' => 'rgb(229, 255, 255)'],
            ['name' => 'Blue', 'value' => 'rgb(229, 242, 255)'],
            ['name' => 'Dark Blue', 'value' => 'rgb(234, 229, 255)'],
            ['name' => 'Purple', 'value' => 'rgb(247, 229, 255)'],
            ['name' => 'Pink', 'value' => 'rgb(255, 229, 243)'],
            ['name' => 'Brown', 'value' => 'rgb(242, 235, 233)'],
            ['name' => 'Gray', 'value' => 'rgb(242, 242, 242)'],
        ];

        DB::table('colors')->insert($colors);

        // Add color_id to notes table if it doesn't exist
        if (!Schema::hasColumn('notes', 'color_id')) {
            Schema::table('notes', function (Blueprint $table) {
                $table->foreignId('color_id')->nullable()->constrained()->onDelete('set null');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('colors');
    }
}; 