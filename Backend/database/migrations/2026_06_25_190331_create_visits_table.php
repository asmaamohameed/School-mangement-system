<?php

use App\Enums\VisitInterestLevel;
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
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->foreignId('contact_id')->constrained('contacts')->onDelete('restrict');
            $table->foreignId('rep_id')->constrained('users')->onDelete('restrict');
            $table->date('visit_date');
            $table->text('notes')->nullable();
            $table->string('interest_level')->default(VisitInterestLevel::Cold);
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
