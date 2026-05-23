<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('delete_tva')->default(false);
            $table->boolean('delivery_free')->default(false);
            $table->decimal('delivery_fee', 10, 2)->default(15.00);
            $table->decimal('delivery_free_threshold', 10, 2)->default(150.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};
