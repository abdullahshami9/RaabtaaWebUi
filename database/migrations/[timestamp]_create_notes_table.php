<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('notes'); // Force drop if exists
        
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('content');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('color_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();

            // Add indexes for better performance
            $table->index('user_id');
            $table->index('color_id');
            $table->index('is_pinned');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notes');
    }
}; 