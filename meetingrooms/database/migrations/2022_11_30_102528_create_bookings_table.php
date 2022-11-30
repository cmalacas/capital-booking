<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->integer('client_id');
            $table->integer('meetingroom_id');
            $table->date('date');
            $table->time('from_time');
            $table->time('to_time');
            $table->double('duration')->default(0);
            $table->float('amount',11, 2)->default(0);
            $table->float('vat', 11, 2)->default(0);
            $table->float('total_amount', 11, 2);
            $table->text('description')->nullable();
            $table->smallInteger('expired_status')->default(0);
            $table->smallInteger('reschedule_status')->default(0);
            $table->smallInteger('free_of_charge')->default(0);
            $table->smallInteger('payment_status')->default(1);
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
        Schema::dropIfExists('bookings');
    }
}
