<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeetingroomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meetingrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->float('amount_1', 11, 2)->default(0);
            $table->float('amount_2', 11, 2)->default(0);
            $table->float('amount_4', 11, 2)->default(0);
            $table->float('amount_8', 11, 2)->default(0);
            $table->text('description')->nullable();
            $table->smallInteger('status')->default(1);
            $table->smallInteger('deleted')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('meetingrooms');
    }
}
